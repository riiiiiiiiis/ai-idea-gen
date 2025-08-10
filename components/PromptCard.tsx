import React, { useState, useRef, useLayoutEffect } from 'react';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon';

interface PromptCardProps {
  title: string;
  prompt: string;
  isCopied: boolean;
  onCopy: () => void;
}

export const PromptCard: React.FC<PromptCardProps> = ({ title, prompt, isCopied, onCopy }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const backRef = useRef<HTMLDivElement>(null);
  const [cardHeight, setCardHeight] = useState(0);

  useLayoutEffect(() => {
    if (backRef.current) {
      setCardHeight(backRef.current.offsetHeight);
    }
  }, [prompt]);

  return (
    <div
      className="relative cursor-pointer [perspective:1000px]"
      style={{ height: cardHeight ? cardHeight : undefined }}
      onClick={() => setIsFlipped((prev) => !prev)}
    >
      <div
        className={`absolute inset-0 transition-transform duration-500 [transform-style:preserve-3d] ${
          isFlipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        <div className="absolute inset-0 bg-white border border-gray-200 rounded-md p-6 flex flex-col justify-between [backface-visibility:hidden]">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        </div>

        <div
          ref={backRef}
          className="absolute inset-0 bg-white border border-gray-200 rounded-md p-6 flex flex-col justify-between [transform:rotateY(180deg)] [backface-visibility:hidden]"
        >
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 text-base leading-relaxed">{prompt}</p>
          </div>
          <div className="mt-6 text-right">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCopy();
              }}
              className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-200 focus:outline-none border ${
                isCopied
                  ? 'bg-gray-900 text-white border-gray-900 cursor-default'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
              }`}
            >
              {isCopied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
              {isCopied ? 'Скопировано!' : 'Копировать'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
