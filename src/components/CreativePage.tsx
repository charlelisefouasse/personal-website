import CreativeBackground from "./CreativeBackground";

const CreativePage = () => {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-slate-950 p-8 text-white md:p-16">
      <CreativeBackground />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center">
        <h2 className="animate-reveal bg-linear-to-br from-cyan-400 via-purple-600 to-blue-500 bg-clip-text text-center text-8xl leading-none font-black text-transparent opacity-80 md:text-[12rem]">
          TOTAL <br /> CHAOS.
        </h2>
        <p className="text-md mt-12 max-w-lg text-center font-mono font-semibold tracking-[0.5em] text-cyan-400/40 uppercase">
          // pushing the limits of interaction and visual distortion //
          001.002.LAB
        </p>
      </div>
    </div>
  );
};

export default CreativePage;
