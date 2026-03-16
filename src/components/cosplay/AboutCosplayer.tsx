import CreativeBackground from "@/components/cosplay/CreativeBackground";
import { InstagramIcon } from "lucide-react";

const AboutCosplayer = () => {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-6 py-20 md:px-20">
      <CreativeBackground />

      <div className="b relative z-10 mx-auto flex max-w-4xl flex-col gap-6 rounded-3xl border border-purple-300/20 bg-slate-950/70 p-6 font-mono shadow-[0_0_80px_rgba(179,51,255,0.6)] md:p-10">
        <p className="text-sm tracking-[0.25em] text-purple-200/80 uppercase">
          About me
        </p>

        <h2 className="font-bowlby text-3xl leading-tight text-white md:text-5xl">
          Hi, I&apos;m <span className="text-purple-300">AccioCastiel</span>
        </h2>

        <p className="text-base md:text-lg">
          I&apos;ve been cosplaying since 2018, bringing to life characters I
          love through detailed costumes, armor builds, and oversized props.
          Over the years I&apos;ve crafted multiple cosplays and had the chance
          to step on stage for contests like the Coupe de France de Cosplay
          2023.
        </p>

        <p className="text-base md:text-lg">
          My favorite part of cosplay is building armor sets and big weapons,
          mixing foam crafting, painting, and all the little details that make a
          design feel real.
        </p>

        <p className="text-base md:text-lg">
          Follow me on{" "}
          <a
            href="https://www.instagram.com/acciocastiel_/"
            target="_blank"
            className="items-center font-semibold text-purple-300 hover:underline"
          >
            <InstagramIcon className="mr-0.5 inline h-5 pb-0.5" />
            Instagram
          </a>{" "}
          to see more of my builds, work-in-progress shots, and finished
          photoshoots.
        </p>
        <p className="text-base md:text-lg">
          In the meantime, scroll down to see a selection of my cosplays!
        </p>
      </div>
    </div>
  );
};

export default AboutCosplayer;
