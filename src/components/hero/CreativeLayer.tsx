import React from "react";
import { ChevronDownIcon } from "lucide-react";

interface LayerProps {
  hideImage?: boolean;
}

const CreativeLayer: React.FC<LayerProps> = ({ hideImage = false }) => {
  return (
    <div className="absolute inset-0 z-0 flex flex-col p-4 py-8 md:p-16">
      <div className="pointer-events-none absolute bottom-1/2 left-1/2 h-screen w-screen -translate-x-1/2 -translate-y-1/2 opacity-20">
        <div className="absolute bottom-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full bg-blue-600 blur-[150px]" />
        <div className="absolute top-1/4 right-1/4 h-96 w-96 animate-pulse rounded-full bg-purple-600 blur-[150px] delay-700" />
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-center">
        {!hideImage && (
          <div className="group aspect-square w-[85%] overflow-hidden rounded-[24px] shadow-[0_0_80px_rgba(179,51,255,0.6)] min-[2000px]:w-[calc(1350px*100vh/100vw)] lg:w-[calc(1100px*100vh/100vw)]">
            <img
              src="/cosplay.jpg"
              alt="Creative"
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="absolute bottom-0 left-0 flex max-w-lg items-end gap-4 text-left">
          <div className="flex animate-bounce flex-col text-cyan-400">
            <ChevronDownIcon className="h-8 w-8 md:h-12 md:w-12" />
            <ChevronDownIcon className="h-8 w-8 md:h-12 md:w-12" />
            <ChevronDownIcon className="h-8 w-8 md:h-12 md:w-12" />
          </div>
          <h2 className="text-2xl leading-[0.9] font-black text-white md:text-4xl">
            <span className="font-bowlby bg-linear-to-br from-cyan-400 to-purple-600 bg-clip-text text-4xl text-transparent sm:text-5xl md:text-[80px]">
              COSPLAY
            </span>
            <br />
            3D PRINTING
            <br />& MORE
          </h2>
        </div>
      </div>
    </div>
  );
};

export default CreativeLayer;
