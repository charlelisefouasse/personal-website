const CreativePage = () => {
  return (
    <div className="w-full min-h-screen bg-slate-950 text-white flex flex-col p-8 md:p-16 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-screen pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600 rounded-full blur-[180px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600 rounded-full blur-[180px]" />
      </div>

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
