import { Schema } from "mongoose";

export const MediaImageSchema = new Schema(
  {
    url: { type: String, required: true, trim: true },
    publicId: { type: String, required: true, trim: true },
    alt: { type: String, required: true, trim: true, default: "" },
    width: { type: Number, min: 0 },
    height: { type: Number, min: 0 },
  },
  { _id: false },
);

export const TimeRangeSchema = new Schema(
  {
    start: {
      type: String,
      required: true,
      trim: true,
      match: /^([01]\d|2[0-3]):[0-5]\d$/,
    },
    end: {
      type: String,
      required: true,
      trim: true,
      match: /^([01]\d|2[0-3]):[0-5]\d$/,
    },
  },
  { _id: false },
);

export const WeeklyHoursSchema = new Schema(
  {
    dayOfWeek: { type: Number, required: true, min: 0, max: 6 },
    ranges: { type: [TimeRangeSchema], default: [] },
  },
  { _id: false },
);

const ColorSwatchSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    hex: {
      type: String,
      required: true,
      trim: true,
      match: /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/,
    },
  },
  { _id: false },
);

const TypographySampleSchema = new Schema(
  {
    label: { type: String, required: true, trim: true },
    fontFamily: { type: String, required: true, trim: true },
    fontWeight: { type: String, trim: true },
    fontSize: { type: String, trim: true },
    sampleText: { type: String, trim: true },
  },
  { _id: false },
);

export const ContentBlockSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: [
        "full-width-image",
        "two-column-images",
        "text-image",
        "color-palette",
        "typography",
        "quote",
        "video-embed",
        "final-result",
      ],
    },
    displayOrder: { type: Number, default: 0 },
    caption: { type: String, trim: true },
    leftCaption: { type: String, trim: true },
    rightCaption: { type: String, trim: true },
    heading: { type: String, trim: true },
    body: { type: String, trim: true },
    image: MediaImageSchema,
    leftImage: MediaImageSchema,
    rightImage: MediaImageSchema,
    imagePosition: { type: String, enum: ["left", "right"] },
    colors: { type: [ColorSwatchSchema], default: undefined },
    samples: { type: [TypographySampleSchema], default: undefined },
    quote: { type: String, trim: true },
    attribution: { type: String, trim: true },
    url: { type: String, trim: true },
    title: { type: String, trim: true },
    provider: { type: String, enum: ["youtube", "vimeo", "other"] },
    images: { type: [MediaImageSchema], default: undefined },
  },
  { _id: true },
);
