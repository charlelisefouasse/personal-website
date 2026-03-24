import { Instagram } from "lucide-react";

export default function InstagramCta() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-950 px-5 py-20 text-white">
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-linear-to-tr from-[#fcb045] via-[#fd1d1d] to-[#833ab4] blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center justify-center text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-linear-to-tr from-[#fcb045] via-[#fd1d1d] to-[#833ab4] shadow-xl shadow-pink-500/20 md:h-24 md:w-24">
          <Instagram className="h-15 w-15 text-white md:h-18 md:w-18" />
        </div>

        <h2 className="font-bowlby mb-4 text-3xl leading-tight uppercase md:text-5xl">
          Follow my Cosplay Adventures
        </h2>

        <p className="mb-8 max-w-2xl font-mono text-base text-pink-100/80 md:text-lg">
          Want to see more behind-the-scenes, work in progress, and the latest
          cosplay and 3D printing projects? Join me on Instagram!
        </p>

        <a
          href="https://www.instagram.com/acciocastiel_/"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center overflow-hidden rounded-full bg-linear-to-tr from-[#fcb045] via-[#fd1d1d] to-[#833ab4] px-8 py-4 font-mono text-lg font-bold text-white transition-transform duration-300 hover:scale-105 hover:bg-linear-to-tr hover:shadow-lg hover:shadow-pink-500/25 md:bg-white md:bg-none md:text-slate-950"
        >
          <span className="relative z-10 flex items-center gap-2 transition-colors duration-300 group-hover:text-white">
            <Instagram className="h-5 w-5" />
            @acciocastiel_
          </span>
        </a>
      </div>
    </div>
  );
}
