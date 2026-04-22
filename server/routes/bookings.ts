import "dotenv/config";
import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { Resend } from "resend";
import Booking from "../models/Booking.js";
import User from "../models/User.js";

interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

interface JwtPayloadWithUser {
  userId: string;
}

const router = express.Router();

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@ceylontrails.com";
const FROM_EMAIL = "CeylonTrails <CeylonTrails@resend.dev>";

function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  const parts = authHeader.split(" ");
  const token = parts[1];
  if (!token) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res
      .status(500)
      .json({ message: "Server JWT secret not configured" });
  }

  try {
    const payload = jwt.verify(token, secret as string) as unknown;
    if (
      !payload ||
      typeof payload !== "object" ||
      Array.isArray(payload) ||
      !("userId" in payload)
    ) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    const typedPayload = payload as { userId?: string };
    if (typeof typedPayload.userId !== "string") {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    req.userId = typedPayload.userId;

    // Get user role
    User.findById(req.userId)
      .then((user) => {
        if (user) {
          req.userRole = user.role;
        }
        next();
      })
      .catch(() => {
        // If user lookup fails, proceed without role (will fail admin check)
        next();
      });
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token", error });
  }
}

function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.userRole !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
}

async function sendEmail(to: string, subject: string, html: string) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    html,
  });
}

async function sendAdminNotification(subject: string, html: string) {
  await sendEmail(ADMIN_EMAIL, subject, html);
}

router.post("/", authenticate, async (req: AuthRequest, res: Response) => {
  const { tourId, tourTitle, date, guests, total } = req.body;

  if (!req.userId || !tourId || !tourTitle || !date || !guests || !total) {
    return res.status(400).json({ message: "Missing booking fields" });
  }

  try {
    // Set cancellation deadline to 48 hours from now
    const cancellationDeadline = new Date();
    cancellationDeadline.setHours(cancellationDeadline.getHours() + 48);

    const booking = await Booking.create({
      user: req.userId,
      tourId,
      tourTitle,
      date,
      guests,
      total,
      status: "confirmed",
      cancellationDeadline,
    });

    // Send confirmation email to user
    try {
      const user = await User.findById(req.userId);
      if (user) {
        await sendEmail(
          user.email,
          "Booking Confirmed - Ceylon Trails",
          `
            <h2>Booking Confirmed!</h2>
            <p>Dear ${user.firstName},</p>
            <p>Your booking for <strong>${tourTitle}</strong> has been confirmed.</p>
            <p><strong>Booking Details:</strong></p>
            <ul>
              <li>Date: ${date}</li>
              <li>Guests: ${guests}</li>
              <li>Total: $${total}</li>
            </ul>
            <p>You can cancel your booking for free up to 48 hours before the tour date.</p>
            <p>Thank you for choosing Ceylon Trails!</p>
          `,
        );
      }
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
    }

    // Send admin notification
    try {
      const user = await User.findById(req.userId);
      await sendAdminNotification(
        "New Booking - Ceylon Trails",
        `
          <h2>New Booking Received</h2>
          <p><strong>Tour:</strong> ${tourTitle}</p>
          <p><strong>Customer:</strong> ${user?.firstName} ${user?.lastName}</p>
          <p><strong>Email:</strong> ${user?.email}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Guests:</strong> ${guests}</p>
          <p><strong>Total:</strong> $${total}</p>
        `,
      );
    } catch (adminEmailError) {
      console.error("Admin email failed:", adminEmailError);
    }

    res.status(201).json({ booking });
  } catch (error) {
    res.status(500).json({ message: "Error creating booking", error });
  }
});

router.get("/me", authenticate, async (req: AuthRequest, res: Response) => {
  if (!req.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const bookings = await Booking.find({
      user: req.userId,
    }).sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error });
  }
});

router.put(
  "/:id/cancel",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    try {
      const booking = await Booking.findById(id);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      if (booking.user !== req.userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      if (booking.status !== "confirmed") {
        return res.status(400).json({ message: "Booking cannot be cancelled" });
      }

      const now = new Date();
      const isFreeCancellation = now <= booking.cancellationDeadline;
      const cancellationFee = isFreeCancellation
        ? 0
        : Math.round(booking.total * 0.2); // 20% fee
      const refundAmount = booking.total - cancellationFee;

      booking.status = "cancelled";
      booking.cancelledAt = now;
      booking.cancellationFee = cancellationFee;
      booking.refundAmount = refundAmount;
      await booking.save();

      // Send cancellation email to user
      try {
        const user = await User.findById(req.userId);
        if (user) {
          await sendEmail(
            user.email,
            "Booking Cancelled - Ceylon Trails",
            `
            <h2>Booking Cancelled</h2>
            <p>Dear ${user.firstName},</p>
            <p>Your booking for <strong>${booking.tourTitle}</strong> has been cancelled.</p>
            <p><strong>Cancellation Details:</strong></p>
            <ul>
              <li>Original Amount: $${booking.total}</li>
              <li>Cancellation Fee: $${cancellationFee}</li>
              <li>Refund Amount: $${refundAmount}</li>
            </ul>
            <p>If you have any questions, please contact our support team.</p>
          `,
          );
        }
      } catch (emailError) {
        console.error("Cancellation email failed:", emailError);
      }

      // Send admin notification
      try {
        const user = await User.findById(req.userId);
        await sendAdminNotification(
          "Booking Cancelled - Ceylon Trails",
          `
            <h2>Booking Cancelled</h2>
            <p><strong>Tour:</strong> ${booking.tourTitle}</p>
            <p><strong>Customer:</strong> ${user?.firstName} ${user?.lastName}</p>
            <p><strong>Email:</strong> ${user?.email}</p>
            <p><strong>Original Amount:</strong> $${booking.total}</p>
            <p><strong>Cancellation Fee:</strong> $${cancellationFee}</p>
            <p><strong>Refund Amount:</strong> $${refundAmount}</p>
          `,
        );
      } catch (adminEmailError) {
        console.error("Admin cancellation email failed:", adminEmailError);
      }

      res.json({ booking });
    } catch (error) {
      res.status(500).json({ message: "Error cancelling booking", error });
    }
  },
);

router.get("/all", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await Booking.find({}).lean();
    res.json({ bookings });
  } catch (error: unknown) {
    console.error("Error fetching bookings:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({
      message: "Error fetching bookings",
      error: errorMessage,
    });
  }
});

router.get("/:id", authenticate, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (booking.user !== req.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }
    res.json({ booking });
  } catch (error) {
    res.status(500).json({ message: "Error fetching booking", error });
  }
});

router.put(
  "/:id/status",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!["confirmed", "cancelled", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    try {
      const booking = await Booking.findByIdAndUpdate(
        id,
        { status },
        { new: true },
      );

      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      res.json({ booking });
    } catch (error) {
      res.status(500).json({ message: "Error updating booking status", error });
    }
  },
);

export default router;
