import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Snap from "lenis/snap";

import CreativePage from "./components/CreativePage";
import ProfessionalPage from "./components/ProfessionalPage";
import WebGLHero from "./components/hero/WebGLHero";
import GalleryPage from "./components/GalleryPage";
import PrinterTimelapse from "./components/PrinterTimelapse";
import Loader3D from "./components/Loader3D";

gsap.registerPlugin(ScrollTrigger);

function App() {
  const heroRef = useRef<HTMLDivElement>(null);

  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const [isHeroReady, setIsHeroReady] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
    });

    const snap = new Snap(lenis, {
      type: "proximity",
      lerp: 0.1,
      duration: 0.4,
    });

    const sections = document.querySelectorAll<HTMLElement>(".snap-section");
    sections.forEach((section) => snap.addElement(section));

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const target = hero.offsetTop;

    setTimeout(() => {
      window.scrollTo({
        top: target,
        behavior: "instant",
      });
    }, 10);

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroVisible(entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: "50% 0px 50% 0px",
      },
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white">
      {showLoader && (
        <Loader3D ready={isHeroReady} onComplete={() => setShowLoader(false)} />
      )}

      <section className="snap-section bg-pro-bg h-svh w-full shrink-0">
        <ProfessionalPage />
      </section>

      <section
        ref={heroRef}
        className="snap-section bg-pro-bg relative h-svh w-full shrink-0 overflow-hidden"
      >
        {isHeroVisible && <WebGLHero onReady={() => setIsHeroReady(true)} />}
      </section>

      <section className="snap-section w-full shrink-0 bg-slate-950">
        <CreativePage />
        <GalleryPage />
        <PrinterTimelapse />
      </section>
    </div>
  );
}

export default App;
