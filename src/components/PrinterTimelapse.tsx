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
      className="relative h-[150vh] w-full bg-slate-950 md:h-[300vh]"
    >
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden p-8 md:p-16">
        <CreativeBackground />

        <div className="relative flex aspect-square w-full max-w-5xl items-center justify-center md:aspect-video">
          <img
            src="/printer_empty.png"
            alt="3D Printer Empty"
            className="absolute inset-0 z-0 m-auto h-full overflow-hidden rounded-3xl object-contain"
          />
          <motion.div
            style={{
              clipPath: useTransform(
                clipPathInset,
                (val) => `inset(${val} 0 0 0)`,
              ),
            }}
            className="absolute inset-0 z-10 h-full w-full"
          >
            <img
              src="/printer_finished.png"
              alt="3D Printer Finished"
              className="m-auto h-full rounded-3xl object-contain"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PrinterTimelapse;
