import mongoose, { type Model, Schema } from "mongoose";
import { BOOKING_STATUSES, type IBooking } from "@/types";

const BookingSchema = new Schema<IBooking>(
  {
    reference: {
      type: String,
      required: [true, "Reference is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    clientName: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    phone: { type: String, trim: true, maxlength: 30 },
    businessName: { type: String, trim: true, maxlength: 120 },
    website: { type: String, trim: true, maxlength: 255 },
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "Service",
    },
    serviceName: { type: String, trim: true, maxlength: 200 },
    projectType: { type: String, trim: true, maxlength: 120 },
    budgetRange: { type: String, trim: true, maxlength: 80 },
    timeline: { type: String, trim: true, maxlength: 80 },
    description: { type: String, trim: true, maxlength: 5000 },
    referralSource: { type: String, trim: true, maxlength: 120 },
    scheduledAt: {
      type: Date,
      required: [true, "Scheduled date/time is required"],
    },
    timezone: {
      type: String,
      required: [true, "Timezone is required"],
      trim: true,
      default: "America/New_York",
    },
    status: {
      type: String,
      enum: {
        values: BOOKING_STATUSES,
        message: "{VALUE} is not a valid booking status",
      },
      default: "New",
    },
    internalNotes: { type: String, trim: true, maxlength: 5000 },
    emailSent: {
      type: Boolean,
      default: false,
    },
    emailError: { type: String, trim: true },
  },
  {
    timestamps: true,
    collection: "bookings",
  },
);

BookingSchema.index({ reference: 1 }, { unique: true });
BookingSchema.index({ scheduledAt: 1, status: 1 });
BookingSchema.index({ email: 1 });
BookingSchema.index({ status: 1, createdAt: -1 });

const Booking: Model<IBooking> =
  (mongoose.models.Booking as Model<IBooking>) ||
  mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;
