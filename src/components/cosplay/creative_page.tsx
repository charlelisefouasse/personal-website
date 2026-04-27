import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import CreativeBackground from "@/components/cosplay/creative_background";
import { useCharAnimation } from "@/utils/text-animation";

import rulers from "@/assets/rulers.png";
import paint from "@/assets/paint.png";
import cutter from "@/assets/cutter.png";

gsap.registerPlugin(ScrollTrigger, SplitText);

const CreativePage = () => {
  const subtitleRef = useCharAnimation({ speed: 0.1, ease: 0.05 });
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cutterRef = useRef<HTMLImageElement>(null);
  const paintRef = useRef<HTMLImageElement>(null);
  const rulersRef = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const cutter = cutterRef.current;
      const paint = paintRef.current;
      const rulers = rulersRef.current;
      if (!cutter || !paint || !rulers) return;

      const items = [
        { el: cutter, x: -30, y: -10, rot: -8, delay: 0, float: 10 },
        { el: paint, x: 30, y: -12, rot: 8, delay: 0.05, float: 12 },
        { el: rulers, x: 0, y: 24, rot: -6, delay: 0.1, float: 8 },
      ] as const;

      items.forEach(({ el, x, y, rot, delay, float }) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, x, y, rotate: `+=${rot}`, scale: 0.95 },
          {
            autoAlpha: 0.8,
            x: 0,
            y: 0,
            rotate: "-=0",
            scale: 1,
            duration: 0.8,
            delay,
            ease: "power2.out",
          },
        );

        gsap.to(el, {
          y: `-=${float}`,
          duration: 2.4,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: 0.8 + delay,
        });
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative flex min-h-screen w-full flex-col overflow-hidden bg-slate-950 p-8 text-white md:p-16"
    >
      <CreativeBackground />

      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="relative flex flex-1 flex-col justify-end gap-6 text-center">
          <img
            ref={cutterRef}
            src={cutter}
            alt=""
            className="absolute top-2/6 -left-6 w-28 -rotate-45 opacity-80 md:top-10 md:-left-70 md:w-64"
          />
          <img
            ref={paintRef}
            src={paint}
            alt=""
            className="absolute top-5/12 -right-8 w-28 rotate-12 opacity-80 md:top-10 md:-right-60 md:w-64"
          />
          <img
            ref={rulersRef}
            src={rulers}
            alt=""
            className="absolute right-6 -bottom-4/10 w-32 -rotate-12 opacity-80 md:right-32 md:-bottom-65 md:w-64"
          />
          <h2 className="font-bowlby animate-text-gradient animate-gradient-shift bg-linear-to-br from-cyan-400 via-purple-600 to-blue-400 bg-size-[300%_300%] bg-clip-text text-center text-5xl leading-none text-transparent opacity-80 md:text-[12rem]">
            COSPLAYER
          </h2>
          <span
            ref={subtitleRef}
            className="text-bold font-mono text-2xl text-cyan-200 uppercase md:text-4xl"
          >
            Since 2018
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
