import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CreativeBackground from "./CreativeBackground";

gsap.registerPlugin(ScrollTrigger);

const GalleryPage = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRefInternal = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!wrapperRef.current || !containerRefInternal.current) return;

      const container = containerRefInternal.current;
      const wrapper = wrapperRef.current;

      const scrollDistance = container.scrollWidth - window.innerWidth;

      gsap.to(container, {
        x: -scrollDistance,
        ease: "none",
        scrollTrigger: {
          trigger: wrapper,
          pin: true,
          scrub: 1.5,
          start: "top top",
          end: () => (window.innerWidth > 1024 ? "+=4000" : "+=2000"),
          invalidateOnRefresh: true,
        },
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative flex h-screen w-full items-center overflow-hidden bg-slate-950"
    >
      <CreativeBackground />

      <div
        ref={containerRefInternal}
        className="flex w-max items-center gap-[5vw] px-[5vw]"
      >
        <div className="w-[40vw] shrink-0" />
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            ref={(el) => {
              cardsRef.current[i] = el;
            }}
            className="group relative aspect-3/4 w-[60vw] shrink-0 overflow-hidden rounded-3xl border border-purple-400/10 shadow-2xl md:w-[400px]"
          >
            <img
              src="/creative.png"
              alt={`Gallery ${i + 1}`}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
        <div className="w-[40vw] shrink-0" />
      </div>
    </div>
  );
};

export default GalleryPage;
