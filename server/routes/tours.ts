import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import Tour from "../models/Tour.js";
import User from "../models/User.js";

interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

const router = express.Router();

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "assets/tours/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/webp"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, and WEBP are allowed."));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit per file
  },
});

// POST /tours/upload-images - Upload images (admin only)
router.post(
  "/upload-images",
  authenticate,
  requireAdmin,
  upload.array("images", 4), // Allow up to 4 images
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.files || !Array.isArray(req.files)) {
        return res.status(400).json({ message: "No images uploaded" });
      }

      const imagePaths = (req.files as Express.Multer.File[]).map(
        (file) => file.filename,
      );

      if (imagePaths.length !== 4) {
        return res
          .status(400)
          .json({ message: "Exactly 4 images must be uploaded" });
      }

      res.json({ imagePaths });
    } catch (error) {
      console.error("Error uploading images:", error);
      res.status(500).json({ message: "Failed to upload images" });
    }
  },
);

// Authentication middleware
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

    // Get user role for admin checks
    User.findById(req.userId)
      .then((user) => {
        if (user) {
          req.userRole = user.role;
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

// Admin middleware
function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.userRole !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
}

// Optional authentication middleware
function optionalAuthenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // No token, proceed without user
    next();
    return;
  }

  const parts = authHeader.split(" ");
  const token = parts[1];
  if (!token) {
    next();
    return;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    next();
    return;
  }

  try {
    const payload = jwt.verify(token, secret as string) as unknown;
    if (
      !payload ||
      typeof payload !== "object" ||
      Array.isArray(payload) ||
      !("userId" in payload)
    ) {
      next();
      return;
    }

    const typedPayload = payload as { userId?: string };
    if (typeof typedPayload.userId !== "string") {
      next();
      return;
    }

    req.userId = typedPayload.userId;

    // Get user role for admin checks
    User.findById(req.userId)
      .then((user) => {
        if (user) {
          req.userRole = user.role;
        }
        next();
      })
      .catch(() => {
        next();
      });
  } catch (error) {
    next();
  }
}

// GET /tours - Get all tours (public, but admin sees all)
router.get(
  "/",
  optionalAuthenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const query = req.userRole === "admin" ? {} : { status: "active" };
      const tours = await Tour.find(query).sort({ createdAt: -1 });
      res.json({ tours });
    } catch (error) {
      console.error("Error fetching tours:", error);
      res.status(500).json({ message: "Failed to fetch tours" });
    }
  },
);

// GET /tours/:id - Get a specific tour (public)
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }
    res.json({ tour });
  } catch (error) {
    console.error("Error fetching tour:", error);
    res.status(500).json({ message: "Failed to fetch tour" });
  }
});

// POST /tours - Create a new tour (admin only)
router.post(
  "/",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const {
        title,
        location,
        price,
        rating,
        reviewCount,
        duration,
        type,
        groupType,
        includes,
        images,
        description,
        status,
      } = req.body;

      // Validate required fields
      if (
        !title ||
        !location ||
        price === undefined ||
        rating === undefined ||
        reviewCount === undefined ||
        !duration ||
        !type ||
        !groupType ||
        !images ||
        !Array.isArray(images) ||
        images.length !== 4 ||
        !description
      ) {
        return res
          .status(400)
          .json({
            message:
              "All required fields must be provided, including exactly 4 images",
          });
      }

      const tour = new Tour({
        title,
        location,
        price,
        rating,
        reviewCount,
        duration,
        type,
        groupType,
        includes: includes || [],
        images,
        description,
        status: status || "active",
      });

      await tour.save();
      res.status(201).json({ tour, message: "Tour created successfully" });
    } catch (error) {
      console.error("Error creating tour:", error);
      res.status(500).json({ message: "Failed to create tour" });
    }
  },
);

// PUT /tours/:id - Update a tour (admin only)
router.put(
  "/:id",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const {
        title,
        location,
        price,
        rating,
        reviewCount,
        duration,
        type,
        groupType,
        includes,
        images,
        description,
        status,
      } = req.body;

      const updateData: any = {
        title,
        location,
        price,
        rating,
        reviewCount,
        duration,
        type,
        groupType,
        includes,
        description,
        status,
      };

      if (images) {
        if (!Array.isArray(images) || images.length !== 4) {
          return res
            .status(400)
            .json({ message: "Images must be an array of exactly 4 paths" });
        }
        updateData.images = images;
      }

      const tour = await Tour.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true,
      });

      if (!tour) {
        return res.status(404).json({ message: "Tour not found" });
      }

      res.json({ tour, message: "Tour updated successfully" });
    } catch (error) {
      console.error("Error updating tour:", error);
      res.status(500).json({ message: "Failed to update tour" });
    }
  },
);

// DELETE /tours/:id - Delete a tour (admin only)
router.delete(
  "/:id",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const tour = await Tour.findByIdAndDelete(req.params.id);
      if (!tour) {
        return res.status(404).json({ message: "Tour not found" });
      }
      res.json({ message: "Tour deleted successfully" });
    } catch (error) {
      console.error("Error deleting tour:", error);
      res.status(500).json({ message: "Failed to delete tour" });
    }
  },
);

// Multer error handling middleware
router.use((error: any, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ message: "File too large. Maximum size is 5MB." });
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({ message: "Too many files uploaded." });
    }
  }
  if (error.message.includes("Invalid file type")) {
    return res.status(400).json({ message: error.message });
  }
  next(error);
});

export default router;
