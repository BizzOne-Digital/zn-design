import mongoose, { type Model, Schema } from "mongoose";
import type { ITestimonial } from "@/types";
import { MediaImageSchema } from "./shared";

const TestimonialSchema = new Schema<ITestimonial>(
  {
    clientName: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
      maxlength: 120,
    },
    businessRole: { type: String, trim: true, maxlength: 120 },
    quote: {
      type: String,
      required: [true, "Quote is required"],
      trim: true,
      maxlength: 2000,
    },
    clientImage: MediaImageSchema,
    relatedProject: {
      type: Schema.Types.ObjectId,
      ref: "PortfolioProject",
    },
    showRating: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    published: {
      type: Boolean,
      default: false,
    },
    isSample: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: "testimonials",
  },
);

TestimonialSchema.index({ published: 1, displayOrder: 1 });
TestimonialSchema.index({ featured: 1, published: 1 });
TestimonialSchema.index({ relatedProject: 1 });
TestimonialSchema.index({ isSample: 1 });

const Testimonial: Model<ITestimonial> =
  (mongoose.models.Testimonial as Model<ITestimonial>) ||
  mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);

export default Testimonial;
