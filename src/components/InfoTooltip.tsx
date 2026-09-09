import React, { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';

interface InfoTooltipProps {
  text: string;
  className?: string;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({ text, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className={`relative inline-flex items-center ml-1 ${className}`}>
      <button
        type="button"
        id="info-tooltip-btn"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        aria-label="More information"
        className="text-stone-400 hover:text-emerald-700 transition-colors p-0.5 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        <Info className="w-3.5 h-3.5" />
      </button>

      {isOpen && (
        <div
          role="tooltip"
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2.5 bg-stone-900 text-stone-100 text-xs rounded-lg shadow-xl pointer-events-none transition-all leading-relaxed"
        >
          <div className="font-medium text-emerald-300 mb-0.5">How this works</div>
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-stone-900" />
        </div>
      )}
    </div>
  );
};
