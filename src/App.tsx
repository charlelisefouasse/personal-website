import { useEffect, useRef, useState } from "react";
import CreativePage from "./components/CreativePage";
import ProfessionalPage from "./components/ProfessionalPage";
import WebGLHero from "./components/WebGLHero";
import GalleryPage from "./components/GalleryPage";
import PrinterTimelapse from "./components/PrinterTimelapse";

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const creativeSectionRef = useRef<HTMLDivElement>(null);

  const [isSnapping, setIsSnapping] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    const hero = heroRef.current;
    if (!container || !hero) return;

    const target = hero.offsetTop;
    container.scrollTop = target;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (!creativeSectionRef.current) return;

      const creativeSectionTop = creativeSectionRef.current.offsetTop;
      const currentScroll = container.scrollTop;

      // Tolerance buffer (e.g., 10px) to prevent flickering at the exact border
      const buffer = 10;

      if (currentScroll >= creativeSectionTop - buffer) {
        setIsSnapping(false);
      } else {
        setIsSnapping(true);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`h-screen overflow-y-auto overflow-x-hidden scrollbar-hide
        ${isSnapping ? "snap-mandatory snap-y scroll-snap-y" : ""} 
      `}
    >
      <section className="h-screen w-full snap-start shrink-0">
        <ProfessionalPage />
      </section>

      <section
        ref={heroRef}
        className="relative h-screen w-full snap-start shrink-0 overflow-hidden bg-[#fcfbf9]"
      >
        <WebGLHero />
      </section>

      <section
        className="w-full shrink-0 bg-slate-950 snap-start"
        ref={creativeSectionRef}
      >
        <CreativePage />
        <GalleryPage containerRef={containerRef} />
        <PrinterTimelapse containerRef={containerRef} />
      </section>
    </div>
  );
}

export default App;
