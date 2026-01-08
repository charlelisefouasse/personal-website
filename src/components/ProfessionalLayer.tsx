import { ChevronUpIcon } from "lucide-react";
import React from "react";

interface LayerProps {
  hideImage?: boolean;
}

const ProfessionalLayer: React.FC<LayerProps> = ({ hideImage = false }) => {
  return (
    <div className="absolute inset-0 flex flex-col p-8 md:p-16">
      <div className="flex-1 relative flex flex-col items-center justify-center">
        {/* Centered Image */}
        {!hideImage && (
          <div className="w-full max-w-2xl aspect-16/10 bg-gray-100 rounded-3xl overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-white">
            <img
              src="/professional.png"
              alt="Professional"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="absolute top-0 right-0 max-w-lg text-right flex items-start gap-4">
          <h2 className="text-3xl md:text-5xl font-black leading-[0.9] text-gray-400">
            <span className="text-gray-900 text-5xl md:text-7xl">
              FRONT-END
            </span>
            <br />
            DEVELOPER
          </h2>
          <div className="flex flex-col text-gray-400 opacity-60 mb-4 animate-bounce">
            <ChevronUpIcon size={40} />
            <ChevronUpIcon size={40} />
            <ChevronUpIcon size={40} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalLayer;
