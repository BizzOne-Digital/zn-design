"use client";

import { createUploadSignature } from "@/actions/admin/uploads";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/utils";
import type { MediaImage } from "@/types";
import { ImageIcon, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { FormField, inputClassName } from "./FormField";

export interface ImageUploadProps {
  value?: MediaImage | null;
  onChange: (image: MediaImage | null) => void;
  folder?: string;
  label?: string;
  required?: boolean;
  error?: string;
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  folder = "zn-design",
  label = "Image",
  required,
  error,
  className,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [altText, setAltText] = useState(value?.alt ?? "");

  async function handleFileSelect(file: File) {
    setUploading(true);
    setUploadError(null);

    try {
      const sigResult = await createUploadSignature({ folder });
      if (!sigResult.success) {
        setUploadError(sigResult.error);
        return;
      }

      const { signature, timestamp, api_key, cloud_name } = sigResult.data;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", api_key);
      formData.append("timestamp", String(timestamp));
      formData.append("signature", signature);
      formData.append("folder", folder);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
        { method: "POST", body: formData },
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();

      const image: MediaImage = {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        alt: altText || file.name.replace(/\.[^.]+$/, ""),
      };

      onChange(image);
      setAltText(image.alt);
    } catch {
      setUploadError("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  function handleAltChange(newAlt: string) {
    setAltText(newAlt);
    if (value) {
      onChange({ ...value, alt: newAlt });
    }
  }

  return (
    <FormField label={label} required={required} error={error || uploadError || undefined} className={className}>
      {value ? (
        <div className="space-y-3">
          <div className="relative overflow-hidden rounded-lg border border-taupe/20 bg-cream/30">
            <Image
              src={value.url}
              alt={value.alt}
              width={value.width ?? 400}
              height={value.height ?? 300}
              className="h-40 w-full object-cover"
            />
            <button
              type="button"
              onClick={() => onChange(null)}
              className="absolute right-2 top-2 rounded-full bg-ink/70 p-1.5 text-ivory hover:bg-ink"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <input
            type="text"
            value={altText}
            onChange={(e) => handleAltChange(e.target.value)}
            placeholder="Alt text (required for accessibility)"
            className={inputClassName}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            Replace image
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={cn(
            "flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-taupe/30 bg-cream/20 px-6 py-10 text-sm text-taupe transition-colors hover:border-gold/50 hover:bg-cream/40",
            uploading && "pointer-events-none opacity-60",
          )}
        >
          {uploading ? (
            <Spinner size="md" />
          ) : (
            <>
              <ImageIcon className="h-8 w-8 text-taupe/60" />
              <span className="flex items-center gap-1.5 font-medium text-ink">
                <Upload className="h-4 w-4" />
                Upload image
              </span>
              <span className="text-xs">PNG, JPG, WebP up to 10MB</span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFileSelect(file);
          e.target.value = "";
        }}
      />
    </FormField>
  );
}
