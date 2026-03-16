import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CreativeBackground from "@/components/cosplay/CreativeBackground";

gsap.registerPlugin(ScrollTrigger);

const MOBILE_MAX_WIDTH = 767;

function setupMobileEnterAlternating(cards: HTMLDivElement[]) {
  cards.forEach((card, idx) => {
    const fromX = idx % 2 === 0 ? -120 : 120;
    const fromRot = idx % 2 === 0 ? -2.5 : 2.5;
    gsap.fromTo(
      card,
      { x: fromX, opacity: 0, rotate: fromRot, scale: 0.94 },
      {
        x: 0,
        opacity: 1,
        rotate: 0,
        scale: 1,
        duration: 0.8,
        ease: "power3.out",
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

  return gsap.to(container, {
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

function setupDesktopEnterAlternating(
  cards: HTMLDivElement[],
  containerAnimation: gsap.core.Tween,
) {
  cards.forEach((card, idx) => {
    const fromY = idx % 2 === 0 ? -200 : 200;
    const fromRot = idx % 2 === 0 ? 2 : -2;

    // If the card is already on screen at load, don't animate it in.
    const rect = card.getBoundingClientRect();
    const isInitiallyVisible = rect.right > 0 && rect.left < window.innerWidth;
    if (isInitiallyVisible) {
      gsap.set(card, { y: 0, opacity: 1, rotate: 0, scale: 1 });
      return;
    }

    // Start off-screen cards hidden, then animate them in as they enter.
    gsap.set(card, { y: fromY, opacity: 0, rotate: fromRot, scale: 0.94 });
    gsap.to(card, {
      y: 0,
      opacity: 1,
      rotate: 0,
      scale: 1,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: card,
        containerAnimation,
        start: "left 85%",
        end: "left 55%",
        toggleActions: "play none none reverse",
      },
    });
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

        setupMobileEnterAlternating(cards);
      });

      // Desktop/tablet: pinned horizontal scroll
      mm.add(`(min-width: ${MOBILE_MAX_WIDTH + 1}px)`, () => {
        if (!wrapperRef.current || !containerRefInternal.current) return;

        const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
        const containerTween = setupDesktopPinnedHorizontalScroll(
          wrapperRef.current,
          containerRefInternal.current,
        );

        if (cards.length > 0) {
          setupDesktopEnterAlternating(cards, containerTween);
        }
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
        <h1 className="font-bowlby animate-text-gradient animate-gradient-shift bg-linear-to-br from-cyan-400 via-purple-600 to-blue-400 bg-size-[300%_300%] bg-clip-text text-3xl leading-none text-transparent md:text-6xl">
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
            className="group relative aspect-3/4 w-[92vw] shrink-0 overflow-hidden rounded-xl border-2 border-purple-400 shadow-[0_0_20px_rgba(179,51,255,0.6)] sm:w-[86vw] md:w-[400px] md:rounded-2xl"
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
