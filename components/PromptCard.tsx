import React, { useState } from 'react';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon';

interface PromptCardProps {
  title: string;
  prompt: string;
  isCopied: boolean;
  onCopy: () => void;
}

export const PromptCard: React.FC<PromptCardProps> = ({ title, prompt, isCopied, onCopy }) => {
  const [showPrompt, setShowPrompt] = useState(false);

  return (
    <div
      onClick={() => setShowPrompt(!showPrompt)}
      className="bg-white border border-gray-200 rounded-md p-6 flex flex-col justify-between transition-all duration-300 hover:border-gray-300 cursor-pointer"
    >
      {!showPrompt ? (
        <div className="flex items-center justify-center h-full">
          <h3 className="text-xl font-bold text-gray-900 text-center">{title}</h3>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
  };
