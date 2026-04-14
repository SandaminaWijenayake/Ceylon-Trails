import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

interface AuthRequest extends Request {
  userId?: string;
}

const router = express.Router();

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
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token", error });
  }
}

router.post("/register", async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const exsistingUser = await User.findOne({ email });
    if (exsistingUser)
      return res.status(400).json({ message: "User already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" },
    );

    res.json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
});

router.get(
  "/profile",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const user = await User.findById(req.userId).select(
        "_id firstName lastName email role",
      );
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ user });
    } catch (error) {
      res.status(500).json({ message: "Error fetching profile", error });
    }
  },
);

router.put(
  "/profile",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email) {
      return res
        .status(400)
        .json({ message: "First name, last name, and email are required" });
    }

    try {
      const updateData: any = { firstName, lastName, email };

      // If password is provided, hash it
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateData.password = hashedPassword;
      }

      const user = await User.findByIdAndUpdate(req.userId, updateData, {
        new: true,
      }).select("_id firstName lastName email role");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ user, message: "Profile updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error updating profile", error });
    }
  },
);

export default router;
