export const TERMINAL_NAME = "charlelise@fouasse";

export const TerminalPrompt = ({
  path = "~",
  command,
  showCursor = false,
  className = "",
}: {
  path?: string;
  command?: string;
  showCursor?: boolean;
  className?: string;
}) => (
  <div className={`flex flex-wrap items-center ${className}`}>
    <span className="font-bold text-[#8ae234]">{TERMINAL_NAME}</span>
    <span className="text-white">:</span>
    <span className="font-bold text-[#729fcf]">{path}</span>
    <span className="text-white">$</span>
    {command && <span className="ml-3 text-white">{command}</span>}
    {showCursor && (
      <div className="animate-blink ml-3 h-6 w-3 bg-white font-bold" />
    )}
  </div>
);
