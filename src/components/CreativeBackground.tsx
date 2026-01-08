const CreativeBackground = () => {
  return (
    <div className="absolute top-1/2 left-1/2 h-screen w-screen -translate-x-1/2 -translate-y-1/2 opacity-30">
      <div className="absolute top-1/4 left-1/4 h-[250px] w-[250px] rounded-full bg-blue-600 blur-[80px] md:h-[500px] md:w-[400px] md:blur-[180px]" />
      <div className="absolute right-1/4 bottom-1/4 h-[250px] w-[250px] rounded-full bg-purple-600 blur-[80px] md:h-[500px] md:w-[400px] md:blur-[180px]" />
    </div>
  );
};

export default CreativeBackground;
