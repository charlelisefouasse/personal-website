import React from "react";
import { ChevronDownIcon } from "lucide-react";

interface LayerProps {
  hideImage?: boolean;
}

const CreativeLayer: React.FC<LayerProps> = ({ hideImage = false }) => {
  return (
    <div className="absolute inset-0 z-0 flex flex-col px-4 md:px-16 py-16">
      {/* Dynamic Background */}

      <div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-screen pointer-events-none opacity-20">
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-600 rounded-full blur-[150px] animate-pulse delay-700" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative ">
        {/* Centered Image - must match ProfessionalLayer exactly in size/pos */}
        {!hideImage && (
          <div className="w-full max-w-2xl aspect-16/10 bg-gray-900 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(0,180,255,0.1)] border border-white/10 group">
            <img
              src="/creative.png"
              alt="Creative"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="absolute bottom-0 left-0 max-w-lg text-left flex items-end gap-4">
          <div className="flex flex-col text-cyan-400 animate-bounce">
            <ChevronDownIcon className="w-8 h-8 md:w-12 md:h-12" />
            <ChevronDownIcon className="w-8 h-8 md:w-12 md:h-12" />
            <ChevronDownIcon className="w-8 h-8 md:w-12 md:h-12" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black leading-[0.9] text-white">
            <span className="text-4xl sm:text-6xl md:text-8xl text-transparent bg-clip-text bg-linear-to-br from-cyan-400 to-purple-600">
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
