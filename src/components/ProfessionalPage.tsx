const ProfessionalPage = () => {
  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden p-8 md:p-16">
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="flex max-w-4xl flex-col items-center gap-12 text-center">
          <h2 className="text-8xl leading-[0.8] font-black tracking-tighter text-black md:text-[12rem]">
            SYSTEM <br /> <span className="text-gray-400">PURITY.</span>
          </h2>
          <div className="h-px w-24 bg-black/10" />
          <p className="max-w-xl text-lg leading-relaxed font-medium text-gray-500">
            Delivering scalable architecture and impeccable code quality for
            world-class digital products. Precision in every line, excellence in
            every pixel.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalPage;
