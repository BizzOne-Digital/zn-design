import mongoose, { type Model, Schema } from "mongoose";
import {
  PROJECT_CATEGORIES,
  PROJECT_STATUSES,
  type IPortfolioProject,
} from "@/types";
import { ContentBlockSchema, MediaImageSchema } from "./shared";

const PortfolioProjectSchema = new Schema<IPortfolioProject>(
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
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: PROJECT_CATEGORIES,
        message: "{VALUE} is not a valid project category",
      },
    },
    shortDescription: {
      type: String,
      required: [true, "Short description is required"],
      trim: true,
      maxlength: 500,
    },
    client: { type: String, trim: true, maxlength: 120 },
    year: {
      type: Number,
      min: 1900,
      max: 2100,
    },
    services: {
      type: [String],
      default: [],
    },
    coverImage: {
      type: MediaImageSchema,
      required: [true, "Cover image is required"],
    },
    gallery: {
      type: [MediaImageSchema],
      default: [],
    },
    contentBlocks: {
      type: [ContentBlockSchema],
      default: [],
    },
    challenge: { type: String, trim: true },
    strategy: { type: String, trim: true },
    creativeDirection: { type: String, trim: true },
    solution: { type: String, trim: true },
    result: { type: String, trim: true },
    status: {
      type: String,
      enum: PROJECT_STATUSES,
      default: "draft",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    seoTitle: { type: String, trim: true, maxlength: 70 },
    seoDescription: { type: String, trim: true, maxlength: 160 },
    aspectRatio: { type: String, trim: true },
    isSample: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: "portfolio_projects",
  },
);

PortfolioProjectSchema.index({ slug: 1 }, { unique: true });
PortfolioProjectSchema.index({ status: 1, displayOrder: 1 });
PortfolioProjectSchema.index({ category: 1, status: 1 });
PortfolioProjectSchema.index({ featured: 1, status: 1, displayOrder: 1 });
PortfolioProjectSchema.index({ isSample: 1 });

const PortfolioProject: Model<IPortfolioProject> =
  (mongoose.models.PortfolioProject as Model<IPortfolioProject>) ||
  mongoose.model<IPortfolioProject>("PortfolioProject", PortfolioProjectSchema);

export default PortfolioProject;
