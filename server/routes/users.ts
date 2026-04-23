import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Booking from "../models/Booking.js";

interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
  userEmail?: string;
}

const router = express.Router();

const SUPER_ADMIN_EMAIL = process.env.ADMIN_EMAIL?.toLowerCase();

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

    // Get user role and email
    User.findById(req.userId)
      .then((user) => {
        if (user) {
          req.userRole = user.role;
          req.userEmail = user.email?.toLowerCase();
        }
        next();
      })
      .catch(() => {
        return res.status(500).json({ message: "Failed to authenticate user" });
      });
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.userRole !== "admin" && req.userRole !== "superadmin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
}

// GET /users/all - Get all users (admin only)
router.get(
  "/all",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const users = await User.find({})
        .select("-password") // Exclude password
        .sort({ createdAt: -1 });

      // Get booking counts for each user
      const usersWithBookings = await Promise.all(
        users.map(async (user) => {
          const bookingCount = await Booking.countDocuments({ user: user._id.toString() });
          return {
            ...user.toObject(),
            bookings: bookingCount,
            lastActive: user.lastLogin || user.createdAt,
          };
        }),
      );

      res.json({ users: usersWithBookings });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  },
);

// PUT /users/:id/role - Update user role (admin only)
router.put(
  "/:id/role",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const { role } = req.body;
      if (!role || !["user", "admin", "superadmin"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      const targetUser = await User.findById(req.params.id);
      if (!targetUser) {
        return res.status(404).json({ message: "User not found" });
      }

      if (targetUser.email?.toLowerCase() === SUPER_ADMIN_EMAIL) {
        return res.status(403).json({ message: "Cannot modify super admin role" });
      }

      const user = await User.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true },
      ).select("-password");

      res.json({ user });
    } catch (error) {
      console.error("Error updating user role:", error);
      res.status(500).json({ message: "Failed to update user role" });
    }
  },
);

export default router;
