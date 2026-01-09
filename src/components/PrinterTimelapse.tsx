import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CreativeBackground from "./CreativeBackground";

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
      className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-slate-950"
    >
      <CreativeBackground />

      <div className="relative flex aspect-square w-full max-w-5xl items-center justify-center p-8 md:aspect-video md:p-16">
        {/* Empty Printer (Background Layer) */}
        <img
          src="/printer_empty.png"
          alt="3D Printer Empty"
          className="absolute inset-0 z-0 m-auto h-full overflow-hidden rounded-3xl object-contain shadow-2xl"
        />

        {/* Finished Printer (Foreground Layer with ClipPath) */}
        <div
          ref={finishedImageRef}
          className="absolute inset-0 z-10 h-full w-full"
          style={{ clipPath: "inset(100% 0% 0% 0%)" }} // Initial state
        >
          <img
            src="/printer_finished.png"
            alt="3D Printer Finished"
            className="m-auto h-full rounded-3xl object-contain shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
};

export default PrinterTimelapse;
