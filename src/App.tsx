import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Snap from "lenis/snap";

import { ArrowUpIcon } from "lucide-react";
import Loader3D from "@/components/loader_3D";
import ProfessionalPage from "@/components/professional/professional_page";
import WebGLHero from "@/components/hero/WebGLHero";
import StaticHero from "@/components/hero/StaticHero";
import CreativePage from "@/components/cosplay/creative_page";
import AboutCosplayer from "@/components/cosplay/about_cosplayer";
import CosplayGallery from "@/components/cosplay/cosplay_gallery";
import PrinterSection from "@/components/cosplay/printer_section";
import FigurinesGallery from "@/components/cosplay/figurines_gallery";
import InstagramCta from "@/components/cosplay/instagram_cta";

gsap.registerPlugin(ScrollTrigger);

function App() {
  const heroRef = useRef<HTMLDivElement>(null);
  const aboutSentinelRef = useRef<HTMLDivElement>(null);

  const [isHeroReady, setIsHeroReady] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [showBackToHero, setShowBackToHero] = useState(false);
  const [heroMode, setHeroMode] = useState<"webgl" | "fallback">("webgl");

  console.log({ heroMode });

  useEffect(() => {
    // FIX: Do not attach scroll logic or change heroMode while the loader
    // is visible or the WebGL hero is not fully ready.
    if (showLoader || !isHeroReady) return;

    const handleScroll = () => {
      const sentinel = aboutSentinelRef.current;
      if (!sentinel) return;

      const rect = sentinel.getBoundingClientRect();
      const sentinelTop = rect.top + window.scrollY;
      const hideThreshold = sentinelTop - 120;

      if (window.scrollY >= hideThreshold && heroMode === "webgl") {
        setHeroMode("fallback");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Check initially once safely mounted and loaded
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [heroMode, showLoader, isHeroReady]);

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
    sections.forEach((section) => {
      snap.addElement(section, {
        align: section.classList.contains("snap-end") ? "end" : "start",
      });
    });

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
    const onScroll = () => {
      const hero = heroRef.current;
      if (!hero) return;

      const heroTop = hero.offsetTop;
      const threshold = heroTop + hero.offsetHeight * 0.4;
      setShowBackToHero(window.scrollY > threshold);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const handleBackToHero = () => {
    const hero = heroRef.current;
    if (!hero) return;

    const target = hero.offsetTop;
    window.scrollTo({
      top: target,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (isHeroReady) {
      if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
      }

      const hero = heroRef.current;
      if (!hero) return;

      const target = hero.offsetTop;

      setTimeout(() => {
        window.scrollTo({
          top: target,
          behavior: "instant",
        });
      }, 10);
    }
  }, [isHeroReady]);

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    const hero = heroRef.current;
    if (!hero) return;

    const target = hero.offsetTop;

    setTimeout(() => {
      window.scrollTo({
        top: target,
        behavior: "instant",
      });
    }, 10);
  }, []);

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white antialiased">
      {showLoader && (
        <Loader3D ready={isHeroReady} onComplete={() => setShowLoader(false)} />
      )}

      <section className="snap-section bg-pro-bg w-full shrink-0 snap-end">
        <ProfessionalPage />
      </section>

      <section
        ref={heroRef}
        className="snap-section bg-pro-bg relative h-svh w-full shrink-0 overflow-hidden"
      >
        {heroMode === "webgl" ? (
          <WebGLHero onReady={() => setIsHeroReady(true)} />
        ) : (
          <StaticHero onLoadAnimation={() => setHeroMode("webgl")} />
        )}
      </section>

      <section className="snap-section w-full shrink-0 bg-slate-950">
        <CreativePage />
        <div ref={aboutSentinelRef} />
        <AboutCosplayer />
        <CosplayGallery />
        <PrinterSection />
        <FigurinesGallery />
        <InstagramCta />
      </section>

      <div
        className={`fixed right-5 bottom-5 z-50 transition-opacity duration-300 md:right-10 md:bottom-10 ${
          showBackToHero
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <button
          type="button"
          aria-label="scroll to top"
          onClick={handleBackToHero}
          className="transform rounded-full bg-slate-900/80 px-2 py-2 tracking-wide text-cyan-100 uppercase shadow-lg ring-1 shadow-cyan-500/30 ring-cyan-400/60 backdrop-blur-md transition-transform duration-200 hover:-translate-y-1 hover:bg-slate-900 hover:shadow-cyan-400/50"
        >
          <ArrowUpIcon />
        </button>
      </div>
    </div>
  );
}

export default App;
