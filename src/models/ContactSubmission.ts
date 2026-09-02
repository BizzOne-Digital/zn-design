import mongoose, { type Model, Schema } from "mongoose";
import { CONTACT_STATUSES, type IContactSubmission } from "@/types";

const ContactSubmissionSchema = new Schema<IContactSubmission>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
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
    business: { type: String, trim: true, maxlength: 120 },
    serviceInterest: { type: String, trim: true, maxlength: 200 },
    budgetRange: { type: String, trim: true, maxlength: 80 },
    timeline: { type: String, trim: true, maxlength: 80 },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxlength: 5000,
    },
    consent: {
      type: Boolean,
      required: [true, "Consent is required"],
      validate: {
        validator: (value: boolean) => value === true,
        message: "Consent must be granted to submit the form",
      },
    },
    status: {
      type: String,
      enum: CONTACT_STATUSES,
      default: "new",
    },
    internalNotes: { type: String, trim: true, maxlength: 5000 },
    honeypot: { type: String, select: false, default: "" },
  },
  {
    timestamps: true,
    collection: "contact_submissions",
  },
);

ContactSubmissionSchema.index({ status: 1, createdAt: -1 });
ContactSubmissionSchema.index({ email: 1 });

const ContactSubmission: Model<IContactSubmission> =
  (mongoose.models.ContactSubmission as Model<IContactSubmission>) ||
  mongoose.model<IContactSubmission>(
    "ContactSubmission",
    ContactSubmissionSchema,
  );

export default ContactSubmission;
