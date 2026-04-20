import mongoose, { Document, Schema } from "mongoose";

export interface ITour extends Document {
  title: string;
  location: string;
  price: number;
  rating: number;
  reviewCount: number;
  duration: string;
  type: string;
  groupType: string;
  includes: string[];
  images: string[];
  description: string;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

const tourSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    rating: { type: Number, required: true, min: 0, max: 5 },
    reviewCount: { type: Number, required: true, min: 0 },
    duration: { type: String, required: true },
    type: { type: String, required: true },
    groupType: { type: String, required: true },
    includes: [{ type: String }],
    images: [{ type: String, required: true }],
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true },
);

export default mongoose.model<ITour>("Tour", tourSchema);
