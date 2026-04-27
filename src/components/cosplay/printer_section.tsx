import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CreativeBackground from "@/components/cosplay/creative_background";

import printer_finished from "@/assets/printer_finished.png";
import printer_empty from "@/assets/printer_empty.png";

gsap.registerPlugin(ScrollTrigger);

const PrinterSection = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const finishedImageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const wrapper = wrapperRef.current;
      const finishedImage = finishedImageRef.current;

      if (!wrapper || !finishedImage) return;

      let st: ScrollTrigger | null = null;
      let idleCall: gsap.core.Tween | null = null;
      let autoTween: gsap.core.Tween | null = null;
      let isAutoScrolling = false;
      let inSection = false;

      const stopAuto = () => {
        if (idleCall) {
          idleCall.kill();
          idleCall = null;
        }
        if (autoTween) {
          autoTween.kill();
          autoTween = null;
        }
        isAutoScrolling = false;
      };

      const startAuto = () => {
        if (!inSection) return;
        if (!st) return;
        if (autoTween) return;

        const end = st.end;
        const current = st.scroll();

        // Nothing to autoplay if we're already at the end.
        if (current >= end - 1) return;

        const proxy = { y: current };
        autoTween = gsap.to(proxy, {
          y: end,
          duration: 4,
          ease: "none",
          onStart: () => {
            isAutoScrolling = true;
          },
          onUpdate: () => {
            st?.scroll(proxy.y);
          },
          onInterrupt: () => {
            isAutoScrolling = false;
            autoTween = null;
          },
          onComplete: () => {
            isAutoScrolling = false;
            autoTween = null;
          },
        });
      };

      const scheduleAuto = () => {
        if (!inSection) return;
        if (autoTween) return;

        if (idleCall) idleCall.kill();
        idleCall = gsap.delayedCall(0.5, startAuto);
      };

      const onUserInteraction = () => {
        if (isAutoScrolling) return;
        stopAuto();
        scheduleAuto();
      };

      const revealTween = gsap.fromTo(
        finishedImage,
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "none",
          scrollTrigger: {
            trigger: wrapper,
            pin: true,
            start: "top top",
            end: () => (globalThis.innerWidth > 1024 ? "+=200%" : "+=100%"),
            scrub: true,
            invalidateOnRefresh: true,
            onRefresh: (self) => {
              st = self;
            },
            onEnter: () => {
              inSection = true;
              scheduleAuto();
            },
            onEnterBack: () => {
              inSection = true;
              scheduleAuto();
            },
            onLeave: () => {
              inSection = false;
              stopAuto();
            },
            onLeaveBack: () => {
              inSection = false;
              stopAuto();
            },
          },
        },
      );

      // If the section is already active on mount (e.g. refresh mid-page)
      st = revealTween.scrollTrigger ?? null;
      inSection = !!st?.isActive;
      if (inSection) scheduleAuto();

      globalThis.addEventListener("wheel", onUserInteraction, {
        passive: true,
      });
      globalThis.addEventListener("touchstart", onUserInteraction, {
        passive: true,
      });
      globalThis.addEventListener("touchmove", onUserInteraction, {
        passive: true,
      });
      globalThis.addEventListener("pointerdown", onUserInteraction, {
        passive: true,
      });
      globalThis.addEventListener("keydown", onUserInteraction);
      globalThis.addEventListener("scroll", onUserInteraction, {
        passive: true,
      });

      return () => {
        stopAuto();
        globalThis.removeEventListener("wheel", onUserInteraction);
        globalThis.removeEventListener("touchstart", onUserInteraction);
        globalThis.removeEventListener("touchmove", onUserInteraction);
        globalThis.removeEventListener("pointerdown", onUserInteraction);
        globalThis.removeEventListener("keydown", onUserInteraction);
        globalThis.removeEventListener("scroll", onUserInteraction);
      };
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative flex h-screen w-full items-center justify-center overflow-hidden"
    >
      <CreativeBackground />

      <div className="w-full px-5 pb-10 md:px-16 md:pt-16 md:pb-16">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-8 md:grid-cols-2 md:gap-12">
          <div className="relative z-10 max-w-xl">
            <h2 className="font-bowlby mt-3 text-3xl leading-tight text-white md:text-5xl">
              3D printing is my other playground
            </h2>
            <p className="font-geist-mono mt-5 text-base text-pink-100/90 md:text-lg">
              I love 3D printing, especially figurines that I can later paint by
              hand. It&apos;s the perfect mix of precision and creativity:
              print, sand, prime, then bring it to life with color.
            </p>

            <p className="font-geist-mono mt-4 text-base text-pink-100/90 md:text-lg">
              Adventure further to discover some figurines!
            </p>
          </div>

          <div className="w-full">
            <div className="max-h-xl relative mx-auto aspect-square w-full max-w-2xl overflow-hidden rounded-xl md:rounded-2xl">
              <img
                src={printer_empty}
                alt="3D Printer Empty"
                loading="lazy"
                className="absolute inset-0 z-0 h-full w-full object-cover"
              />

              <div
                ref={finishedImageRef}
                className="absolute inset-0 z-10 h-full w-full overflow-hidden"
                style={{
                  clipPath: "inset(100% 0% 0% 0%)", // Initial state
                }}
              >
                <img
                  src={printer_finished}
                  alt="3D Printer Finished"
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrinterSection;
