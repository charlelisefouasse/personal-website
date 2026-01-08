import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import CreativeBackground from "./CreativeBackground";

const PrinterTimelapse = ({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const localRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: localRef,
    container: containerRef,
    offset: ["start start", "end end"],
  });

  // Reveal the finished print from bottom (100% clip) to top (0% clip)
  // as the user scrolls through the section.
  const clipPathInset = useTransform(
    scrollYProgress,
    [0.2, 0.8],
    ["100%", "0%"],
  );

  return (
    <div
      ref={localRef}
      className="relative h-[150vh] md:h-[300vh] w-full bg-slate-950 "
    >
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden p-8 md:p-16">
        <CreativeBackground />

        <div className="relative w-full max-w-5xl aspect-square md:aspect-video flex items-center justify-center">
          <img
            src="/printer_empty.png"
            alt="3D Printer Empty"
            className="absolute inset-0 h-full object-contain z-0 rounded-3xl overflow-hidden m-auto"
          />
          <motion.div
            style={{
              clipPath: useTransform(
                clipPathInset,
                (val) => `inset(${val} 0 0 0)`,
              ),
            }}
            className="absolute inset-0 w-full h-full z-10"
          >
            <img
              src="/printer_finished.png"
              alt="3D Printer Finished"
              className="h-full object-contain rounded-3xl m-auto"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PrinterTimelapse;
