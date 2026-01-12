import { ChevronUpIcon } from "lucide-react";
import React from "react";

interface LayerProps {
  hideImage?: boolean;
}

const ProfessionalLayer: React.FC<LayerProps> = ({ hideImage = false }) => {
  return (
    <div className="absolute inset-0 flex flex-col p-4 py-8 md:p-16">
      <div className="relative flex flex-1 flex-col items-center justify-center">
        {/* Centered Image */}
        {!hideImage && (
          <div className="aspect-square w-[85%] max-w-none overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] min-[2000px]:w-[calc(1350px*100vh/100vw)] lg:w-[calc(1100px*100vh/100vw)]">
            <img
              src="/normal.jpg"
              alt="Professional"
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="absolute top-0 right-0 flex max-w-lg items-start gap-4 text-right">
          <h2 className="font-orbitron text-2xl leading-[0.9] font-black text-gray-400 md:text-4xl">
            <span className="text-3xl text-gray-900 sm:text-xl md:text-6xl">
              FRONT-END
            </span>
            <br />
            DEVELOPER
          </h2>
          <div className="mb-4 flex animate-bounce flex-col text-gray-400 opacity-60">
            <ChevronUpIcon className="h-8 w-8 md:h-12 md:w-12" />
            <ChevronUpIcon className="h-8 w-8 md:h-12 md:w-12" />
            <ChevronUpIcon className="h-8 w-8 md:h-12 md:w-12" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalLayer;
