import mongoose, { type Model, Schema } from "mongoose";
import type { IActivityLog } from "@/types";

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    action: {
      type: String,
      required: [true, "Action is required"],
      trim: true,
      maxlength: 120,
    },
    entity: {
      type: String,
      required: [true, "Entity is required"],
      trim: true,
      maxlength: 80,
    },
    entityId: {
      type: Schema.Types.Mixed,
    },
    details: {
      type: Schema.Types.Mixed,
      default: {},
    },
    adminEmail: {
      type: String,
      required: [true, "Admin email is required"],
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: "activity_logs",
  },
);

ActivityLogSchema.index({ entity: 1, entityId: 1 });
ActivityLogSchema.index({ adminEmail: 1, createdAt: -1 });
ActivityLogSchema.index({ createdAt: -1 });

const ActivityLog: Model<IActivityLog> =
  (mongoose.models.ActivityLog as Model<IActivityLog>) ||
  mongoose.model<IActivityLog>("ActivityLog", ActivityLogSchema);

export default ActivityLog;
