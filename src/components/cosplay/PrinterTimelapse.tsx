import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CreativeBackground from "@/components/cosplay/CreativeBackground";

gsap.registerPlugin(ScrollTrigger);

const PrinterTimelapse = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const finishedImageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const wrapper = wrapperRef.current;
      const finishedImage = finishedImageRef.current;

      if (!wrapper || !finishedImage) return;

      gsap.fromTo(
        finishedImage,
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "none",
          scrollTrigger: {
            trigger: wrapper,
            pin: true,
            start: "top top",
            end: () => (window.innerWidth > 1024 ? "+=200%" : "+=100%"),
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
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
            <p className="mt-5 font-mono text-base text-pink-100/90 md:text-lg">
              I love 3D printing, especially figurines that I can later paint by
              hand. It&apos;s the perfect mix of precision and creativity:
              print, sand, prime, then bring it to life with color.
            </p>
            <p className="mt-4 font-mono text-base text-pink-100/90 md:text-lg">
              Scroll to reveal the finished print!
            </p>

            <p className="mt-4 font-mono text-base text-pink-100/90 md:text-lg">
              And adventure further to discover some figurines!
            </p>
          </div>

          <div className="w-full">
            <div className="max-h-xl relative mx-auto aspect-square w-full max-w-2xl overflow-hidden rounded-xl md:rounded-2xl">
              <img
                src="/printer_empty.png"
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
                  src="/printer_finished.png"
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

export default PrinterTimelapse;
