"use client";

import ImageGallery from "@/components/ui/image_gallery";
import CreativeBackground from "@/components/cosplay/creative_background";

const IMAGES = Array.from({ length: 6 }, (_, i) => `/figurines/${i + 1}.jpg`);

export default function FigurinesGallery() {
  return (
    <ImageGallery
      items={IMAGES}
      renderItem={(src, _, setRef) => (
        <div
          key={src}
          ref={setRef}
          className="group relative aspect-3/4 w-[92vw] shrink-0 overflow-hidden rounded-xl border-2 border-purple-400 shadow-[0_0_20px_rgba(179,51,255,0.6)] sm:w-[86vw] md:w-[400px] md:rounded-2xl"
        >
          <img
            src={src}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
      )}
    >
      {/* Background and Overlay Titles passed as children */}
      <CreativeBackground />
      <div className="pointer-events-none absolute top-6 left-6 z-20 md:top-10 md:left-12">
        <h1 className="font-bowlby animate-text-gradient bg-linear-to-br from-cyan-400 via-purple-600 to-blue-400 bg-clip-text text-3xl leading-none text-transparent md:text-6xl">
          FIGURINES GALLERY
        </h1>
        <p className="mt-2 font-mono text-sm text-cyan-200/80 md:text-base">
          Scroll to explore
        </p>
      </div>
    </ImageGallery>
  );
}
