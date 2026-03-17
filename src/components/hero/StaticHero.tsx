import CreativeLayer from "@/components/hero/creative_layer";
import ProfessionalLayer from "@/components/hero/professional_layer";

interface StaticHeroProps {
  onLoadAnimation: () => void;
}

const StaticHero: React.FC<StaticHeroProps> = ({ onLoadAnimation }) => {
  return (
    <div className="relative flex h-full w-full items-stretch justify-center px-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="relative h-full w-full">
          {/* Top-right diagonal: professional */}
          <div
            className="bg-grid absolute inset-0"
            style={{
              clipPath: "polygon(0 0, 100% 0, 100% 100%)",
            }}
          >
            <ProfessionalLayer />
          </div>
          {/* Bottom-left diagonal: creative */}
          <div
            className="absolute inset-0 bg-slate-950"
            style={{
              clipPath: "polygon(0 0, 0 100%, 100% 100%)",
            }}
          >
            <CreativeLayer />
          </div>
        </div>
      </div>

      <div className="relative z-10 m-auto flex flex-col items-center gap-4 rounded-2xl bg-slate-950/80 px-6 py-4 text-center shadow-xl backdrop-blur-md md:px-8 md:py-5">
        <p className="font-mono text-xs tracking-[0.25em] text-cyan-200/80 uppercase md:text-sm">
          Performance saver
        </p>
        <h2 className="font-bowlby text-xl text-white uppercase md:text-2xl">
          Animation is paused
        </h2>
        <p className="max-w-md font-mono text-xs text-cyan-100/90 md:text-sm">
          To keep the experience smooth, the animation has been disabled. You
          can reactivate it at any time.
        </p>
        <button
          type="button"
          onClick={onLoadAnimation}
          className="rounded-full bg-purple-600 px-5 py-2 font-mono text-xs font-semibold text-white shadow-lg transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:bg-purple-400/70 md:px-6 md:py-2.5 md:text-sm"
        >
          Reactivate animation
        </button>
      </div>
    </div>
  );
};

export default StaticHero;
