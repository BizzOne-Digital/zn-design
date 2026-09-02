"use client";

import { Button } from "@/components/ui/Button";
import type { ContentBlock, MediaImage } from "@/types";
import {
  ChevronDown,
  ChevronUp,
  GripVertical,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { FormField, inputClassName, textareaClassName } from "./FormField";
import { ImageUpload } from "./ImageUpload";

const BLOCK_TYPES = [
  { value: "full-width-image", label: "Full Width Image" },
  { value: "two-column-images", label: "Two Column Images" },
  { value: "text-image", label: "Text + Image" },
  { value: "color-palette", label: "Color Palette" },
  { value: "typography", label: "Typography" },
  { value: "quote", label: "Quote" },
  { value: "video-embed", label: "Video Embed" },
  { value: "final-result", label: "Final Result" },
] as const;

function createEmptyBlock(type: ContentBlock["type"]): ContentBlock {
  const order = 0;
  switch (type) {
    case "full-width-image":
      return {
        type,
        image: { url: "", publicId: "", alt: "" },
        displayOrder: order,
      };
    case "two-column-images":
      return {
        type,
        leftImage: { url: "", publicId: "", alt: "" },
        rightImage: { url: "", publicId: "", alt: "" },
        displayOrder: order,
      };
    case "text-image":
      return {
        type,
        body: "",
        image: { url: "", publicId: "", alt: "" },
        imagePosition: "right",
        displayOrder: order,
      };
    case "color-palette":
      return {
        type,
        colors: [{ name: "Primary", hex: "#11100f" }],
        displayOrder: order,
      };
    case "typography":
      return {
        type,
        samples: [{ label: "Heading", fontFamily: "serif" }],
        displayOrder: order,
      };
    case "quote":
      return { type, quote: "", displayOrder: order };
    case "video-embed":
      return { type, url: "", displayOrder: order };
    case "final-result":
      return { type, images: [], displayOrder: order };
    default:
      return { type: "quote", quote: "", displayOrder: order };
  }
}

export interface ContentBlockEditorProps {
  value: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}

export function ContentBlockEditor({ value, onChange }: ContentBlockEditorProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [addType, setAddType] = useState<ContentBlock["type"]>("full-width-image");

  function updateBlock(index: number, block: ContentBlock) {
    const updated = [...value];
    updated[index] = { ...block, displayOrder: index };
    onChange(updated);
  }

  function removeBlock(index: number) {
    onChange(
      value
        .filter((_, i) => i !== index)
        .map((b, i) => ({ ...b, displayOrder: i })),
    );
  }

  function moveBlock(index: number, direction: -1 | 1) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= value.length) return;
    const updated = [...value];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    onChange(updated.map((b, i) => ({ ...b, displayOrder: i })));
  }

  function handleDragStart(index: number) {
    setDragIndex(index);
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    const updated = [...value];
    const [dragged] = updated.splice(dragIndex, 1);
    updated.splice(index, 0, dragged);
    onChange(updated.map((b, i) => ({ ...b, displayOrder: i })));
    setDragIndex(index);
  }

  function handleDragEnd() {
    setDragIndex(null);
  }

  function addBlock() {
    onChange([...value, { ...createEmptyBlock(addType), displayOrder: value.length }]);
  }

  return (
    <div className="space-y-4">
      {value.map((block, index) => (
        <div
          key={index}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
          className="rounded-xl border border-taupe/20 bg-white"
        >
          <div className="flex items-center gap-2 border-b border-taupe/15 bg-cream/30 px-4 py-2">
            <GripVertical className="h-4 w-4 cursor-grab text-taupe" />
            <span className="flex-1 text-sm font-medium text-ink">
              {BLOCK_TYPES.find((t) => t.value === block.type)?.label ?? block.type}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => moveBlock(index, -1)}
              disabled={index === 0}
              aria-label="Move up"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => moveBlock(index, 1)}
              disabled={index === value.length - 1}
              aria-label="Move down"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeBlock(index)}
              aria-label="Remove block"
            >
              <Trash2 className="h-4 w-4 text-dusty-rose" />
            </Button>
          </div>
          <div className="p-4">
            <BlockFields block={block} onChange={(b) => updateBlock(index, b)} />
          </div>
        </div>
      ))}

      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-dashed border-taupe/30 bg-cream/20 p-4">
        <select
          value={addType}
          onChange={(e) => setAddType(e.target.value as ContentBlock["type"])}
          className={inputClassName + " w-auto"}
        >
          {BLOCK_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        <Button type="button" variant="outline" size="sm" onClick={addBlock}>
          <Plus className="h-4 w-4" />
          Add block
        </Button>
      </div>
    </div>
  );
}

function BlockFields({
  block,
  onChange,
}: {
  block: ContentBlock;
  onChange: (block: ContentBlock) => void;
}) {
  switch (block.type) {
    case "full-width-image":
      return (
        <div className="space-y-4">
          <ImageUpload
            label="Image"
            value={block.image.url ? block.image : null}
            onChange={(img) => img && onChange({ ...block, image: img })}
            folder="zn-design/projects"
          />
          <FormField label="Caption">
            <input
              type="text"
              value={block.caption ?? ""}
              onChange={(e) => onChange({ ...block, caption: e.target.value })}
              className={inputClassName}
            />
          </FormField>
        </div>
      );

    case "two-column-images":
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <ImageUpload
            label="Left image"
            value={block.leftImage.url ? block.leftImage : null}
            onChange={(img) => img && onChange({ ...block, leftImage: img })}
            folder="zn-design/projects"
          />
          <ImageUpload
            label="Right image"
            value={block.rightImage.url ? block.rightImage : null}
            onChange={(img) => img && onChange({ ...block, rightImage: img })}
            folder="zn-design/projects"
          />
        </div>
      );

    case "text-image":
      return (
        <div className="space-y-4">
          <FormField label="Heading">
            <input
              type="text"
              value={block.heading ?? ""}
              onChange={(e) => onChange({ ...block, heading: e.target.value })}
              className={inputClassName}
            />
          </FormField>
          <FormField label="Body" required>
            <textarea
              value={block.body}
              onChange={(e) => onChange({ ...block, body: e.target.value })}
              className={textareaClassName}
              rows={4}
            />
          </FormField>
          <FormField label="Image position">
            <select
              value={block.imagePosition}
              onChange={(e) =>
                onChange({
                  ...block,
                  imagePosition: e.target.value as "left" | "right",
                })
              }
              className={inputClassName}
            >
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
          </FormField>
          <ImageUpload
            label="Image"
            value={block.image.url ? block.image : null}
            onChange={(img) => img && onChange({ ...block, image: img })}
            folder="zn-design/projects"
          />
        </div>
      );

    case "color-palette":
      return (
        <div className="space-y-4">
          <FormField label="Heading">
            <input
              type="text"
              value={block.heading ?? ""}
              onChange={(e) => onChange({ ...block, heading: e.target.value })}
              className={inputClassName}
            />
          </FormField>
          {block.colors.map((color, i) => (
            <div key={i} className="flex gap-3">
              <input
                type="text"
                value={color.name}
                placeholder="Name"
                onChange={(e) => {
                  const colors = [...block.colors];
                  colors[i] = { ...color, name: e.target.value };
                  onChange({ ...block, colors });
                }}
                className={inputClassName}
              />
              <input
                type="color"
                value={color.hex}
                onChange={(e) => {
                  const colors = [...block.colors];
                  colors[i] = { ...color, hex: e.target.value };
                  onChange({ ...block, colors });
                }}
                className="h-10 w-14 rounded border border-taupe/30"
              />
              <input
                type="text"
                value={color.hex}
                onChange={(e) => {
                  const colors = [...block.colors];
                  colors[i] = { ...color, hex: e.target.value };
                  onChange({ ...block, colors });
                }}
                className={inputClassName + " w-28"}
              />
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              onChange({
                ...block,
                colors: [...block.colors, { name: "", hex: "#000000" }],
              })
            }
          >
            Add color
          </Button>
        </div>
      );

    case "typography":
      return (
        <div className="space-y-4">
          <FormField label="Heading">
            <input
              type="text"
              value={block.heading ?? ""}
              onChange={(e) => onChange({ ...block, heading: e.target.value })}
              className={inputClassName}
            />
          </FormField>
          {block.samples.map((sample, i) => (
            <div key={i} className="grid gap-3 rounded-lg border border-taupe/15 p-3 md:grid-cols-2">
              <input
                type="text"
                value={sample.label}
                placeholder="Label"
                onChange={(e) => {
                  const samples = [...block.samples];
                  samples[i] = { ...sample, label: e.target.value };
                  onChange({ ...block, samples });
                }}
                className={inputClassName}
              />
              <input
                type="text"
                value={sample.fontFamily}
                placeholder="Font family"
                onChange={(e) => {
                  const samples = [...block.samples];
                  samples[i] = { ...sample, fontFamily: e.target.value };
                  onChange({ ...block, samples });
                }}
                className={inputClassName}
              />
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              onChange({
                ...block,
                samples: [...block.samples, { label: "", fontFamily: "" }],
              })
            }
          >
            Add sample
          </Button>
        </div>
      );

    case "quote":
      return (
        <div className="space-y-4">
          <FormField label="Quote" required>
            <textarea
              value={block.quote}
              onChange={(e) => onChange({ ...block, quote: e.target.value })}
              className={textareaClassName}
              rows={3}
            />
          </FormField>
          <FormField label="Attribution">
            <input
              type="text"
              value={block.attribution ?? ""}
              onChange={(e) =>
                onChange({ ...block, attribution: e.target.value })
              }
              className={inputClassName}
            />
          </FormField>
        </div>
      );

    case "video-embed":
      return (
        <div className="space-y-4">
          <FormField label="Video URL" required>
            <input
              type="url"
              value={block.url}
              onChange={(e) => onChange({ ...block, url: e.target.value })}
              className={inputClassName}
              placeholder="https://youtube.com/..."
            />
          </FormField>
          <FormField label="Title">
            <input
              type="text"
              value={block.title ?? ""}
              onChange={(e) => onChange({ ...block, title: e.target.value })}
              className={inputClassName}
            />
          </FormField>
          <FormField label="Provider">
            <select
              value={block.provider ?? "youtube"}
              onChange={(e) =>
                onChange({
                  ...block,
                  provider: e.target.value as "youtube" | "vimeo" | "other",
                })
              }
              className={inputClassName}
            >
              <option value="youtube">YouTube</option>
              <option value="vimeo">Vimeo</option>
              <option value="other">Other</option>
            </select>
          </FormField>
        </div>
      );

    case "final-result":
      return (
        <div className="space-y-4">
          <FormField label="Heading">
            <input
              type="text"
              value={block.heading ?? ""}
              onChange={(e) => onChange({ ...block, heading: e.target.value })}
              className={inputClassName}
            />
          </FormField>
          <FormField label="Body">
            <textarea
              value={block.body ?? ""}
              onChange={(e) => onChange({ ...block, body: e.target.value })}
              className={textareaClassName}
              rows={3}
            />
          </FormField>
          <GalleryImages
            images={block.images}
            onChange={(images) => onChange({ ...block, images })}
          />
        </div>
      );

    default:
      return null;
  }
}

function GalleryImages({
  images,
  onChange,
}: {
  images: MediaImage[];
  onChange: (images: MediaImage[]) => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-taupe">
        Images
      </p>
      {images.map((img, i) => (
        <div key={i} className="flex items-start gap-2">
          <div className="flex-1">
            <ImageUpload
              label={`Image ${i + 1}`}
              value={img.url ? img : null}
              onChange={(updated) => {
                if (!updated) return;
                const next = [...images];
                next[i] = updated;
                onChange(next);
              }}
              folder="zn-design/projects"
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange(images.filter((_, idx) => idx !== i))}
          >
            <Trash2 className="h-4 w-4 text-dusty-rose" />
          </Button>
        </div>
      ))}
      {images.length < 6 ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            onChange([...images, { url: "", publicId: "", alt: "" }])
          }
        >
          Add image
        </Button>
      ) : null}
    </div>
  );
}
