const CreativeBackground = () => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-screen opacity-30">
      <div className="absolute top-1/4 left-1/4 w-[250px] h-[250px] md:w-[400px] md:h-[500px] bg-blue-600 rounded-full blur-[80px] md:blur-[180px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] md:w-[400px] md:h-[500px] bg-purple-600 rounded-full blur-[80px] md:blur-[180px]" />
    </div>
  );
};

export default CreativeBackground;
