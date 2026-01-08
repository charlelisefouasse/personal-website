import { useRef, useState, useLayoutEffect, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import CreativeBackground from "./CreativeBackground";

const GalleryPage = ({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const [scrollRange, setScrollRange] = useState(0);
  const [viewportW, setViewportW] = useState(0);

  useLayoutEffect(() => {
    scrollRef.current && setScrollRange(scrollRef.current.scrollWidth);
  }, [scrollRef]);

  // Use a resize observer to keep viewport width accurate
  const onResize = useCallback((entries: ResizeObserverEntry[]) => {
    for (const entry of entries) {
      setViewportW(entry.contentRect.width);
    }
  }, []);

  useLayoutEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => onResize(entries));
    if (ghostRef.current) resizeObserver.observe(ghostRef.current);
    return () => resizeObserver.disconnect();
  }, [onResize]);

  const { scrollYProgress } = useScroll({
    target: ghostRef,
    container: containerRef,
    offset: ["start start", "end end"],
  });

  const finalX = -scrollRange + viewportW;
  const transform = useTransform(scrollYProgress, [0, 1], [0, finalX]);

  const physics = { damping: 15, mass: 0.27, stiffness: 55 };
  const spring = useSpring(transform, physics);

  return (
    <div
      ref={ghostRef}
      style={{ height: scrollRange }}
      className="relative w-full bg-slate-950"
    >
      <div className="sticky top-0 left-0 right-0 h-screen overflow-hidden flex items-center">
        <CreativeBackground />

        <motion.section
          ref={scrollRef}
          style={{ x: spring }}
          className="relative flex items-center px-[5vw] gap-[5vw] w-max z-10"
        >
          {/* Spacer to center the first image initially */}
          <div className="shrink-0 w-[20vw] md:w-[calc(50vw-200px)] h-1" />
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="relative shrink-0 w-[60vw] md:w-[400px] aspect-3/4 bg-gray-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl group"
            >
              <img
                src="/creative.png"
                alt={`Gallery ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          <div className="shrink-0 w-[15vw] md:w-[calc(50vw-200px)] h-1" />
        </motion.section>
      </div>
    </div>
  );
};

export default GalleryPage;
