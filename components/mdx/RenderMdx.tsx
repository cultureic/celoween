"use client";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { MdxComponents } from './MdxComponents';

// Import highlight.js theme for syntax highlighting
import 'highlight.js/styles/github-dark.css';

interface RenderMdxProps {
  source: string;
}

export default function RenderMdx({ source }: RenderMdxProps) {
  if (!source) return null;

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeHighlight]}
      components={MdxComponents}
      // Allow dangerous HTML (needed for iframes, videos, etc.)
      // Note: Only use with trusted content!
    >
      {source}
    </ReactMarkdown>
  );
}


