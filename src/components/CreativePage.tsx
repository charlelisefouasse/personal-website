import CreativeBackground from "./CreativeBackground";

const CreativePage = () => {
  return (
    <div className="w-full min-h-screen bg-slate-950 text-white flex flex-col p-8 md:p-16 relative overflow-hidden">
      <CreativeBackground />

      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        <h2 className="text-8xl md:text-[12rem] font-black leading-none text-transparent bg-clip-text bg-linear-to-br from-cyan-400 via-purple-600 to-blue-500 opacity-80 animate-reveal text-center">
          TOTAL <br /> CHAOS.
        </h2>
        <p className="mt-12 text-md font-semibold text-cyan-400/40 font-mono uppercase tracking-[0.5em] text-center max-w-lg">
          // pushing the limits of interaction and visual distortion //
          001.002.LAB
        </p>
      </div>
    </div>
  );
};

export default CreativePage;
