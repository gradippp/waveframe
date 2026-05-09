import React, { memo } from 'react';

interface CodeBlockProps {
  code: string;
  highlightFn: (code: string) => React.ReactNode[];
  onCopy: () => void;
  copied: boolean;
}

export const CodeBlock: React.FC<CodeBlockProps> = memo(({ code, highlightFn, onCopy, copied }) => {
  const highlightedLines = highlightFn(code);

  return (
    <div className="bg-[#1e1e1e] rounded-xl shadow-2xl overflow-hidden border border-[#333]">
      <div className="flex items-center justify-between px-6 py-3 bg-[#252526] border-b border-[#333]">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
          React Code Export
        </h2>
        <button 
          onClick={onCopy}
          className={`flex items-center gap-2 px-3 py-1 rounded transition-all duration-300 text-[10px] font-bold uppercase tracking-widest ${
            copied 
            ? 'text-green-400' 
            : 'text-blue-400 hover:text-blue-300'
          }`}
        >
          {copied ? 'Copied!' : 'Copy Snippet'}
        </button>
      </div>
      <div className="p-6 overflow-x-auto custom-scrollbar bg-[#1e1e1e]">
        <pre style={{ fontFamily: '"JetBrains Mono", "Fira Code", monospace' }} className="text-[13px] leading-relaxed">
          <code className="text-gray-300">
            {highlightedLines.map((line, i) => (
              <div key={i} className="whitespace-pre">
                <span className="mr-4 text-gray-700 select-none inline-block w-4 text-right">{(i + 1)}</span>
                <span dangerouslySetInnerHTML={{ __html: line }} />
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
});

CodeBlock.displayName = 'CodeBlock';
