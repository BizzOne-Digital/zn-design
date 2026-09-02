import mongoose, { type Model, Schema } from "mongoose";
import type { IAvailabilityRule } from "@/types";
import { WeeklyHoursSchema } from "./shared";

export const AVAILABILITY_SINGLETON_KEY = "default";

const AvailabilityRuleSchema = new Schema<IAvailabilityRule>(
  {
    singletonKey: {
      type: String,
      required: true,
      unique: true,
      default: AVAILABILITY_SINGLETON_KEY,
      immutable: true,
    },
    timezone: {
      type: String,
      required: [true, "Timezone is required"],
      trim: true,
      default: "America/New_York",
    },
    slotDurationMinutes: {
      type: Number,
      required: true,
      min: 15,
      max: 240,
      default: 60,
    },
    leadTimeHours: {
      type: Number,
      required: true,
      min: 0,
      max: 168,
      default: 24,
    },
    bookingHorizonDays: {
      type: Number,
      required: true,
      min: 1,
      max: 365,
      default: 60,
    },
    weeklyHours: {
      type: [WeeklyHoursSchema],
      default: [],
    },
    blackoutDates: {
      type: [Date],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: "availability_rules",
  },
);

const AvailabilityRule: Model<IAvailabilityRule> =
  (mongoose.models.AvailabilityRule as Model<IAvailabilityRule>) ||
  mongoose.model<IAvailabilityRule>("AvailabilityRule", AvailabilityRuleSchema);

export default AvailabilityRule;
