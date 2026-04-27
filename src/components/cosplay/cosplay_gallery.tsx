"use client";

import ImageGallery from "@/components/ui/image_gallery";
import CreativeBackground from "@/components/cosplay/creative_background";
import cosplayImages from "@/components/cosplay/cosplay_images.json";
import { CameraIcon } from "lucide-react";

interface ImageCredit {
  displayName: string;
  link?: string;
}

interface GalleryImage {
  src: string;
  alt: string;
  credit?: ImageCredit;
}

const COSPLAY_IMAGES = cosplayImages as GalleryImage[];

export default function CosplayGallery() {
  return (
    <ImageGallery
      items={COSPLAY_IMAGES}
      renderItem={(image, _, setRef) => (
        <div
          key={image.src}
          ref={setRef}
          className="group relative aspect-3/4 w-[92vw] shrink-0 overflow-hidden rounded-xl border-2 border-purple-400 shadow-[0_0_20px_rgba(179,51,255,0.6)] sm:w-[86vw] md:w-[400px] md:rounded-2xl"
        >
          <img
            src={image.src}
            alt={image.alt}
            loading="lazy"
            className="h-full w-full object-cover"
          />
          {image.credit && (
            <div
              className={`text-shadow-2xl absolute right-3 bottom-2 z-10 flex items-center gap-1 rounded font-mono text-[11px] leading-none text-white ${image.credit.link ? "hover:text-purple-300" : ""}`}
            >
              <CameraIcon size={14} className="mb-0.5" />
              {image.credit.link ? (
                <a
                  href={image.credit.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {image.credit.displayName}
                </a>
              ) : (
                <span>{image.credit.displayName}</span>
              )}
            </div>
          )}
        </div>
      )}
    >
      {/* Background and Overlay Titles passed as children */}
      <CreativeBackground />
      <div className="pointer-events-none absolute top-6 left-6 z-20 md:top-10 md:left-12">
        <h2 className="font-bowlby animate-text-gradient bg-linear-to-br from-cyan-400 via-purple-600 to-blue-400 bg-clip-text text-3xl leading-none text-transparent md:text-6xl">
          COSPLAY GALLERY
        </h2>
        <p className="mt-2 font-mono text-sm text-cyan-200/80 md:text-base">
          Scroll to explore
        </p>
      </div>
    </ImageGallery>
  );
}
