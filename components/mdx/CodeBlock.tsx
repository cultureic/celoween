"use client";

import { ComponentPropsWithoutRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps extends ComponentPropsWithoutRef<'code'> {
  inline?: boolean;
}

export function CodeBlock({ inline, className, children, ...props }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(String(children));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Inline code
  if (inline || !language) {
    return (
      <code className="bg-white/10 px-2 py-1 rounded text-celo-yellow font-mono text-sm" {...props}>
        {children}
      </code>
    );
  }

  // Code block with syntax highlighting
  return (
    <div className="relative group my-4">
      {/* Copy button */}
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 rounded bg-white/10 hover:bg-white/20 transition-colors opacity-0 group-hover:opacity-100 z-10"
        title="Copy code"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-400" />
        ) : (
          <Copy className="w-4 h-4 text-white" />
        )}
      </button>

      {/* Language label */}
      <div className="absolute top-2 left-2 px-2 py-1 rounded bg-celo-yellow/20 text-celo-yellow text-xs font-mono z-10">
        {language}
      </div>

      {/* Syntax highlighted code */}
      <SyntaxHighlighter
        style={vscDarkPlus as any}
        language={language}
        PreTag="div"
        className="!bg-black/50 !rounded-lg !p-4 !mt-8"
        customStyle={{
          margin: 0,
          padding: '2rem 1rem 1rem 1rem',
        }}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    </div>
  );
}
