"use client";

import { useRef, useLayoutEffect, ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const MOBILE_MAX_WIDTH = 767;

interface ImageGalleryProps<T> {
  items: T[];
  renderItem: (
    item: T,
    index: number,
    ref: (el: HTMLDivElement | null) => void,
  ) => ReactNode;
  children?: ReactNode; // For titles/backgrounds
}

export default function ImageGallery<T>({
  items,
  renderItem,
  children,
}: ImageGalleryProps<T>) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      const cards = cardsRef.current.filter(Boolean);

      // 1. Mobile Logic
      mm.add(`(max-width: ${MOBILE_MAX_WIDTH}px)`, () => {
        cards.forEach((card, idx) => {
          const fromX = idx % 2 === 0 ? -120 : 120;
          gsap.fromTo(
            card,
            {
              x: fromX,
              opacity: 0,
              rotate: idx % 2 === 0 ? -2.5 : 2.5,
              scale: 0.94,
            },
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
      });

      // 2. Desktop Logic
      mm.add(`(min-width: ${MOBILE_MAX_WIDTH + 1}px)`, () => {
        if (!wrapperRef.current || !containerRef.current) return;

        const scrollDistance =
          containerRef.current.scrollWidth - window.innerWidth;

        const containerTween = gsap.to(containerRef.current, {
          x: -scrollDistance,
          ease: "none",
          scrollTrigger: {
            trigger: wrapperRef.current,
            pin: true,
            scrub: 1.5,
            start: "top top",
            end: () => (window.innerWidth > 1024 ? "+=4000" : "+=2000"),
            invalidateOnRefresh: true,
          },
        });

        cards.forEach((card, idx) => {
          if (!card) {
            return;
          }
          const rect = card.getBoundingClientRect();
          if (rect.right > 0 && rect.left < window.innerWidth) {
            gsap.set(card, { y: 0, opacity: 1, rotate: 0, scale: 1 });
            return;
          }

          gsap.set(card, {
            y: idx % 2 === 0 ? -200 : 200,
            opacity: 0,
            rotate: idx % 2 === 0 ? 2 : -2,
            scale: 0.94,
          });

          gsap.to(card, {
            y: 0,
            opacity: 1,
            rotate: 0,
            scale: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              containerAnimation: containerTween,
              start: "left 85%",
              end: "left 55%",
              toggleActions: "play none none reverse",
            },
          });
        });
      });

      return () => mm.revert();
    }, wrapperRef);

    return () => ctx.revert();
  }, [items]);

  return (
    <div
      ref={wrapperRef}
      className="relative flex min-h-screen w-full items-start overflow-x-hidden overflow-y-visible md:h-screen md:items-center md:overflow-hidden"
    >
      {children}

      <div
        ref={containerRef}
        className="flex w-full flex-col items-center gap-6 px-5 pt-28 pb-[100px] md:w-max md:flex-row md:gap-[5vw] md:px-[5vw] md:pt-0 md:pb-0"
      >
        {/* Spacers for desktop horizontal scroll feel */}
        <div className="hidden w-[40vw] shrink-0 md:block" />

        {items.map((item, i) =>
          renderItem(item, i, (el) => (cardsRef.current[i] = el)),
        )}

        <div className="hidden w-[40vw] shrink-0 md:block" />
      </div>
    </div>
  );
}
