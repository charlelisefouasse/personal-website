import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CreativeBackground from "@/components/cosplay/CreativeBackground";

gsap.registerPlugin(ScrollTrigger);

const MOBILE_MAX_WIDTH = 767;

function setupMobileEnterFromLeft(cards: HTMLDivElement[]) {
  cards.forEach((card) => {
    gsap.fromTo(
      card,
      { x: -40, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          end: "top 55%",
          toggleActions: "play none none reverse",
        },
      },
    );
  });
}

function setupDesktopPinnedHorizontalScroll(
  wrapper: HTMLDivElement,
  container: HTMLDivElement,
) {
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
}

const GalleryPage = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRefInternal = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Mobile: vertical list + "enter from left" as you scroll
      mm.add(`(max-width: ${MOBILE_MAX_WIDTH}px)`, () => {
        const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
        if (cards.length === 0) return;

        setupMobileEnterFromLeft(cards);
      });

      // Desktop/tablet: pinned horizontal scroll
      mm.add(`(min-width: ${MOBILE_MAX_WIDTH + 1}px)`, () => {
        if (!wrapperRef.current || !containerRefInternal.current) return;

        setupDesktopPinnedHorizontalScroll(
          wrapperRef.current,
          containerRefInternal.current,
        );
      });

      return () => mm.revert();
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative flex min-h-screen w-full items-start overflow-x-hidden overflow-y-visible bg-slate-950 md:h-screen md:items-center md:overflow-hidden"
    >
      <CreativeBackground />

      <div className="pointer-events-none absolute top-6 left-6 z-20 md:top-10 md:left-12">
        <h1 className="font-bowlby animate-text-gradient animate-gradient-shift bg-linear-to-br from-cyan-400 via-purple-600 to-blue-400 bg-size-[300%_300%] bg-clip-text text-4xl leading-none text-transparent md:text-6xl">
          COSPLAY GALLERY
        </h1>
        <p className="mt-2 font-mono text-sm text-cyan-200/80 md:text-base">
          Scroll to explore
        </p>
      </div>

      <div
        ref={containerRefInternal}
        className="flex w-full flex-col items-center gap-6 px-5 pt-28 pb-[200px] md:w-max md:flex-row md:gap-[5vw] md:px-[5vw] md:pt-0 md:pb-0"
      >
        <div className="hidden w-[40vw] shrink-0 md:block" />
        {new Array(10).fill(null).map((_, i) => (
          <div
            key={`/cosplays/${i + 1}.webp`}
            ref={(el) => {
              cardsRef.current[i] = el;
            }}
            className="group relative aspect-3/4 w-[92vw] shrink-0 overflow-hidden rounded-xl border border-purple-400/10 shadow-2xl sm:w-[86vw] md:w-[400px] md:rounded-2xl"
          >
            <img
              src={`/cosplays/${i + 1}.webp`}
              alt={`Gallery ${i + 1}`}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        ))}
        <div className="hidden w-[40vw] shrink-0 md:block" />
      </div>
    </div>
  );
};

export default GalleryPage;
