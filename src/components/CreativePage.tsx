import CreativeBackground from "./CreativeBackground";

const CreativePage = () => {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-slate-950 p-8 text-white md:p-16">
      <CreativeBackground />

      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="flex max-w-4xl flex-col items-center gap-12 text-center">
          <h2 className="font-bowlby bg-linear-to-br from-cyan-400 via-purple-600 to-blue-500 bg-clip-text text-center text-7xl leading-none font-black text-transparent opacity-80 md:text-[12rem]">
            TOTAL <br /> CHAOS
          </h2>
          <img
            src="/cutter.png"
            alt=""
            className="absolute -top-40 -left-70 w-32 -rotate-45 opacity-80 md:w-64"
          />
          <img
            src="/paint.png"
            alt=""
            className="absolute -top-45 -right-60 w-32 rotate-12 opacity-80 md:w-64"
          />
          <img
            src="/rulers.png"
            alt=""
            className="absolute right-32 -bottom-65 w-40 -rotate-12 opacity-80 md:w-64"
          />
          <p className="max-w-lg font-mono text-lg font-semibold tracking-[0.5em] text-cyan-400/40 uppercase">
            // pushing the limits of interaction and visual distortion //
            001.002.LAB
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreativePage;
