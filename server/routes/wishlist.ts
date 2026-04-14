import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Wishlist from "../models/Wishlist.js";

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

router.post("/", authenticate, async (req: AuthRequest, res: Response) => {
  const { tourId, tourTitle, tourImage, tourPrice } = req.body;

  if (
    !req.userId ||
    !tourId ||
    !tourTitle ||
    !tourImage ||
    tourPrice === undefined
  ) {
    return res.status(400).json({ message: "Missing wishlist fields" });
  }

  try {
    const existingWish = await Wishlist.findOne({
      user: req.userId,
      tourId,
    });

    if (existingWish) {
      return res.status(400).json({ message: "Tour already in wishlist" });
    }

    const wishlist = await Wishlist.create({
      user: req.userId,
      tourId,
      tourTitle,
      tourImage,
      tourPrice,
    });

    res.status(201).json({ wishlist });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Tour already in wishlist" });
    }
    res.status(500).json({ message: "Error adding to wishlist", error });
  }
});

router.get("/me", authenticate, async (req: AuthRequest, res: Response) => {
  if (!req.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const wishlists = await Wishlist.find({
      user: new mongoose.Types.ObjectId(req.userId),
    }).sort({ createdAt: -1 });
    res.json({ wishlists });
  } catch (error) {
    res.status(500).json({ message: "Error fetching wishlist", error });
  }
});

router.delete(
  "/:tourId",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    const { tourId } = req.params;

    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const result = await Wishlist.findOneAndDelete({
        user: new mongoose.Types.ObjectId(req.userId),
        tourId,
      });

      if (!result) {
        return res.status(404).json({ message: "Wishlist item not found" });
      }

      res.json({ message: "Removed from wishlist" });
    } catch (error) {
      res.status(500).json({ message: "Error removing from wishlist", error });
    }
  },
);

router.get(
  "/check/:tourId",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    const { tourId } = req.params;

    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const isSaved = await Wishlist.findOne({
        user: new mongoose.Types.ObjectId(req.userId),
        tourId,
      });

      res.json({ isSaved: !!isSaved });
    } catch (error) {
      res.status(500).json({ message: "Error checking wishlist", error });
    }
  },
);

export default router;
