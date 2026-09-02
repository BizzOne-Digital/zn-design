import mongoose, { type Model, Schema } from "mongoose";
import type { IPricingPackage } from "@/types";

const PricingPackageSchema = new Schema<IPricingPackage>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 120,
    },
    subtitle: { type: String, trim: true, maxlength: 200 },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    deliverables: {
      type: [String],
      default: [],
    },
    idealFor: { type: String, trim: true },
    priceLabel: { type: String, trim: true, maxlength: 80 },
    featured: {
      type: Boolean,
      default: false,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "pricing_packages",
  },
);

PricingPackageSchema.index({ active: 1, displayOrder: 1 });
PricingPackageSchema.index({ featured: 1, active: 1 });

const PricingPackage: Model<IPricingPackage> =
  (mongoose.models.PricingPackage as Model<IPricingPackage>) ||
  mongoose.model<IPricingPackage>("PricingPackage", PricingPackageSchema);

export default PricingPackage;
