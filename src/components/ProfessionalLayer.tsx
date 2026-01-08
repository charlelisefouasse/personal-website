import { ChevronUpIcon } from "lucide-react";
import React from "react";

interface LayerProps {
  hideImage?: boolean;
}

const ProfessionalLayer: React.FC<LayerProps> = ({ hideImage = false }) => {
  return (
    <div className="absolute inset-0 flex flex-col px-4 py-16 md:px-16">
      <div className="relative flex flex-1 flex-col items-center justify-center">
        {/* Centered Image */}
        {!hideImage && (
          <div className="aspect-16/10 w-full max-w-2xl overflow-hidden rounded-3xl border border-white bg-gray-100 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)]">
            <img
              src="/professional.png"
              alt="Professional"
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="absolute top-10 right-0 flex max-w-lg items-start gap-4 text-right">
          <h2 className="text-2xl leading-[0.9] font-black text-gray-400 sm:text-3xl md:text-5xl">
            <span className="text-4xl text-gray-900 sm:text-5xl md:text-7xl">
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
