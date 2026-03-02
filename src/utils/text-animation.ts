// hooks/useCharAnimation.ts
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export function useCharAnimation<T extends HTMLElement>(
  {
    speed,
    ease,
    charsForEach,
  }: {
    speed: number;
    ease: number;
    charsForEach?: (char: HTMLElement) => void;
  } = { speed: 0.5, ease: 1.7 },
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    const split = new SplitText(el, { type: "chars" });
    const chars = split.chars as HTMLElement[];

    if (!!charsForEach) {
      chars.forEach((char) => charsForEach(char));
    }

    gsap.set(chars, { opacity: 0, x: -20 });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 80%",
      onEnter: () =>
        gsap.to(chars, {
          opacity: 1,
          x: 0,
          duration: speed,
          stagger: 0.1,
          ease: `back.out(${ease})`,
        }),
      onEnterBack: () =>
        gsap.to(chars, {
          opacity: 1,
          x: 0,
          duration: speed,
          stagger: 0.1,
          ease: `back.out(${ease})`,
        }),
      onLeave: () => {
        gsap.to(chars, {
          opacity: 0,
          x: 20,
          duration: 0.3,
          stagger: 0.05,
          ease: "power2.in",
        });
      },
      onLeaveBack: () => {
        gsap.to(chars, {
          opacity: 0,
          x: 20,
          duration: 0.3,
          stagger: 0.05,
          ease: "power2.in",
        });
      },
    });

    return () => {
      trigger.kill();
      split.revert();
    };
  }, []);

  return ref;
}
