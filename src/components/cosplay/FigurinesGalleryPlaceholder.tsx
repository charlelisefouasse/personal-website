import CreativeBackground from "@/components/cosplay/CreativeBackground";

const FigurinesGalleryPlaceholder = () => {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-950 px-6 py-16 md:px-20 md:py-20">
      <CreativeBackground />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-4 rounded-3xl border border-purple-200/20 bg-slate-950/70 p-8 text-center font-mono shadow-[0_0_80px_rgba(179,51,255,0.6)] md:p-10">
        <p className="text-sm tracking-[0.25em] text-purple-200/80 uppercase">
          Figurine gallery
        </p>
        <h2 className="font-bowlby text-3xl leading-tight text-white md:text-5xl">
          Hand-painted 3D prints
        </h2>
        <p className="text-base md:text-lg">
          A dedicated gallery for my 3D printed and hand-painted figurines will
          appear here soon.
        </p>
        <p className="text-sm text-purple-200/80 md:text-base">
          Images to come — stay tuned for close-ups, work-in-progress shots, and
          finished pieces.
        </p>
      </div>
    </div>
  );
};

export default FigurinesGalleryPlaceholder;
