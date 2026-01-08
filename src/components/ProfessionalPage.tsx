const ProfessionalPage = () => {
  return (
    <div className="w-full h-screen bg-[#fcfbf9] text-[#1a1a1a] flex flex-col p-8 md:p-16 relative overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="max-w-4xl text-center">
          <h2 className="text-8xl md:text-[12rem] font-black leading-[0.8] tracking-tighter text-black mb-12">
            SYSTEM <br /> <span className="text-gray-400">PURITY.</span>
          </h2>
          <div className="w-24 h-px bg-black/10 mx-auto my-12" />
          <p className="text-lg text-gray-500 font-medium leading-relaxed max-w-xl mx-auto">
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
