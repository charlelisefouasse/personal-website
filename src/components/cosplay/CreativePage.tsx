import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import CreativeBackground from "@/components/cosplay/CreativeBackground";
import { useCharAnimation } from "@/utils/text-animation";

gsap.registerPlugin(ScrollTrigger, SplitText);

const CreativePage = () => {
  const subtitleRef = useCharAnimation({ speed: 0.1, ease: 0.05 });

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-slate-950 p-8 text-white md:p-16">
      <CreativeBackground />

      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="relative flex flex-1 flex-col justify-end gap-6 text-center">
          {/* <img
            src="/cutter.png"
            alt=""
            className="absolute w-32 -rotate-45 opacity-80 md:-top-50 md:-left-70 md:w-64"
          />
          <img
            src="/paint.png"
            alt=""
            className="absolute w-32 rotate-12 opacity-80 md:-top-55 md:-right-60 md:w-64"
          />
          <img
            src="/rulers.png"
            alt=""
            className="absolute w-40 -rotate-12 opacity-80 md:right-32 md:-bottom-65 md:w-64"
          /> */}
          <h2 className="font-bowlby animate-text-gradient animate-gradient-shift bg-linear-to-br from-cyan-400 via-purple-600 to-blue-400 bg-size-[300%_300%] bg-clip-text text-center text-5xl leading-none text-transparent opacity-80 md:text-[12rem]">
            COSPLAYER
          </h2>
          <span
            ref={subtitleRef}
            className="text-bold font-mono text-2xl text-cyan-200 md:text-4xl"
          >
            SINCE 2018
          </span>
        </div>
      </div>
      <div className="flex flex-1 items-end justify-center">
        {/* SEE MY COSPLAYS */}
      </div>
    </div>
  );
};

export default CreativePage;
