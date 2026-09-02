import mongoose, { type Model, Schema } from "mongoose";
import type { IService } from "@/types";
import { MediaImageSchema } from "./shared";

const ServiceSchema = new Schema<IService>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be URL-friendly"],
    },
    shortDescription: {
      type: String,
      required: [true, "Short description is required"],
      trim: true,
      maxlength: 500,
    },
    fullDescription: { type: String, trim: true },
    deliverables: {
      type: [String],
      default: [],
    },
    processNotes: { type: String, trim: true },
    featuredImage: MediaImageSchema,
    gallery: {
      type: [MediaImageSchema],
      default: [],
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    seoTitle: { type: String, trim: true, maxlength: 70 },
    seoDescription: { type: String, trim: true, maxlength: 160 },
  },
  {
    timestamps: true,
    collection: "services",
  },
);

ServiceSchema.index({ slug: 1 }, { unique: true });
ServiceSchema.index({ active: 1, displayOrder: 1 });
ServiceSchema.index({ featured: 1, active: 1 });

const Service: Model<IService> =
  (mongoose.models.Service as Model<IService>) ||
  mongoose.model<IService>("Service", ServiceSchema);

export default Service;
