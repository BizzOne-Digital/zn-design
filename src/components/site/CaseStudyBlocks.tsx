import Image from "next/image";
import type { ContentBlock } from "@/types";
import { cn } from "@/lib/utils";

export interface CaseStudyBlocksProps {
  blocks: ContentBlock[];
}

function getYouTubeEmbedUrl(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]+)/,
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

function getVimeoEmbedUrl(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? `https://player.vimeo.com/video/${match[1]}` : null;
}

export function CaseStudyBlocks({ blocks }: CaseStudyBlocksProps) {
  const sortedBlocks = [...blocks].sort(
    (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0),
  );

  if (sortedBlocks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-16">
      {sortedBlocks.map((block, index) => {
        switch (block.type) {
          case "full-width-image":
            return (
              <figure key={index} className="space-y-4">
                <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] bg-cream">
                  <Image
                    src={block.image.url}
                    alt={block.image.alt || block.caption || "Project image"}
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                </div>
                {block.caption ? (
                  <figcaption className="text-sm text-taupe">{block.caption}</figcaption>
                ) : null}
              </figure>
            );

          case "two-column-images":
            return (
              <div
                key={index}
                className="grid gap-6 md:grid-cols-2"
              >
                <figure className="space-y-3">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-cream">
                    <Image
                      src={block.leftImage.url}
                      alt={block.leftImage.alt || "Project image"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  {block.leftCaption ? (
                    <figcaption className="text-sm text-taupe">
                      {block.leftCaption}
                    </figcaption>
                  ) : null}
                </figure>
                <figure className="space-y-3">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-cream">
                    <Image
                      src={block.rightImage.url}
                      alt={block.rightImage.alt || "Project image"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  {block.rightCaption ? (
                    <figcaption className="text-sm text-taupe">
                      {block.rightCaption}
                    </figcaption>
                  ) : null}
                </figure>
              </div>
            );

          case "text-image":
            return (
              <div
                key={index}
                className={cn(
                  "grid items-center gap-8 lg:grid-cols-2",
                  block.imagePosition === "left" && "lg:[&>*:first-child]:order-2",
                )}
              >
                <div>
                  {block.heading ? (
                    <h3 className="font-display text-3xl text-ink">{block.heading}</h3>
                  ) : null}
                  <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-soft-black/80">
                    {block.body}
                  </p>
                </div>
                <div className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-cream">
                  <Image
                    src={block.image.url}
                    alt={block.image.alt || block.heading || "Project image"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            );

          case "color-palette":
            return (
              <div key={index} className="space-y-6">
                {block.heading ? (
                  <h3 className="font-display text-3xl text-ink">{block.heading}</h3>
                ) : null}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {block.colors.map((color) => (
                    <div
                      key={color.hex}
                      className="overflow-hidden rounded-2xl border border-taupe/15"
                    >
                      <div
                        className="aspect-[3/2]"
                        style={{ backgroundColor: color.hex }}
                        aria-hidden="true"
                      />
                      <div className="bg-ivory p-4">
                        <p className="font-medium text-ink">{color.name}</p>
                        <p className="text-sm text-taupe">{color.hex}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );

          case "typography":
            return (
              <div key={index} className="space-y-6">
                {block.heading ? (
                  <h3 className="font-display text-3xl text-ink">{block.heading}</h3>
                ) : null}
                <div className="space-y-6">
                  {block.samples.map((sample) => (
                    <div
                      key={`${sample.label}-${sample.fontFamily}`}
                      className="rounded-2xl border border-taupe/15 bg-cream/40 p-6"
                    >
                      <p className="text-xs uppercase tracking-[0.16em] text-taupe">
                        {sample.label}
                      </p>
                      <p
                        className="mt-3 text-3xl text-ink"
                        style={{
                          fontFamily: sample.fontFamily,
                          fontWeight: sample.fontWeight,
                          fontSize: sample.fontSize,
                        }}
                      >
                        {sample.sampleText || sample.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );

          case "quote":
            return (
              <blockquote
                key={index}
                className="rounded-[1.5rem] border border-taupe/15 bg-cream/50 px-8 py-10"
              >
                <p className="font-display text-3xl leading-snug text-ink">
                  &ldquo;{block.quote}&rdquo;
                </p>
                {block.attribution ? (
                  <cite className="mt-4 block text-sm not-italic text-taupe">
                    — {block.attribution}
                  </cite>
                ) : null}
              </blockquote>
            );

          case "video-embed": {
            const embedUrl =
              block.provider === "vimeo"
                ? getVimeoEmbedUrl(block.url)
                : getYouTubeEmbedUrl(block.url) ?? block.url;

            if (!embedUrl) return null;

            return (
              <div key={index} className="space-y-4">
                {block.title ? (
                  <h3 className="font-display text-2xl text-ink">{block.title}</h3>
                ) : null}
                <div className="relative aspect-video overflow-hidden rounded-[1.25rem] bg-ink">
                  <iframe
                    src={embedUrl}
                    title={block.title || "Project video"}
                    className="absolute inset-0 h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            );
          }

          case "final-result":
            return (
              <div key={index} className="space-y-6">
                {block.heading ? (
                  <h3 className="font-display text-3xl text-ink">{block.heading}</h3>
                ) : null}
                {block.body ? (
                  <p className="max-w-3xl whitespace-pre-line text-base leading-relaxed text-soft-black/80">
                    {block.body}
                  </p>
                ) : null}
                <div className="grid gap-4 md:grid-cols-2">
                  {block.images.map((image, imageIndex) => (
                    <div
                      key={image.publicId || imageIndex}
                      className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-cream"
                    >
                      <Image
                        src={image.url}
                        alt={image.alt || "Final result"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  ))}
                </div>
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
