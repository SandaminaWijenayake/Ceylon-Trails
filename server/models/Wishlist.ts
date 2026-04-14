import mongoose, { Document, Schema } from "mongoose";

export interface IWishlist extends Document {
  user: mongoose.Types.ObjectId;
  tourId: string;
  tourTitle: string;
  tourImage: string;
  tourPrice: number;
  createdAt: Date;
}

const wishlistSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tourId: { type: String, required: true },
    tourTitle: { type: String, required: true },
    tourImage: { type: String, required: true },
    tourPrice: { type: Number, required: true },
  },
  { timestamps: true },
);

// Ensure each user can only save a tour once
wishlistSchema.index({ user: 1, tourId: 1 }, { unique: true });

export default mongoose.model<IWishlist>("Wishlist", wishlistSchema);
