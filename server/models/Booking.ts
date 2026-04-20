import mongoose, { Document, Schema } from "mongoose";

export interface IBooking extends Document {
  user: string;
  tourId: string;
  tourTitle: string;
  date: string;
  guests: number;
  total: number;
  status: "confirmed" | "cancelled" | "expired";
  cancellationDeadline: Date;
  cancelledAt?: Date;
  cancellationFee?: number;
  refundAmount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema: Schema = new Schema(
  {
    user: { type: String, required: true },
    tourId: { type: String, required: true },
    tourTitle: { type: String, required: true },
    date: { type: String, required: true },
    guests: { type: Number, required: true, min: 1 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["confirmed", "cancelled", "expired", "completed"],
      default: "confirmed",
    },
    cancellationDeadline: { type: Date, required: true },
    cancelledAt: { type: Date },
    cancellationFee: { type: Number },
    refundAmount: { type: Number },
  },
  { timestamps: true },
);

export default mongoose.model<IBooking>("Booking", bookingSchema);
