import { ComponentPropsWithoutRef } from 'react';
import { CodeBlock } from './CodeBlock';
import { Callout } from '../course/Callout';
import { Tabs } from '../course/Tabs';
import { Accordion } from '../course/Accordion';
import { CodeEmbed } from '../course/CodeEmbed';

export const MdxComponents = {
  // Headings with better styling
  h1: (props: ComponentPropsWithoutRef<'h1'>) => (
    <h1 className="text-4xl font-bold mb-6 mt-8 text-celo-yellow" {...props} />
  ),
  h2: (props: ComponentPropsWithoutRef<'h2'>) => (
    <h2 className="text-3xl font-bold mb-4 mt-6 text-celo-yellow border-l-4 border-celo-yellow pl-4" {...props} />
  ),
  h3: (props: ComponentPropsWithoutRef<'h3'>) => (
    <h3 className="text-2xl font-semibold mb-3 mt-5 text-white" {...props} />
  ),
  h4: (props: ComponentPropsWithoutRef<'h4'>) => (
    <h4 className="text-xl font-semibold mb-2 mt-4 text-white/90" {...props} />
  ),
  h5: (props: ComponentPropsWithoutRef<'h5'>) => (
    <h5 className="text-lg font-semibold mb-2 mt-3 text-white/80" {...props} />
  ),
  h6: (props: ComponentPropsWithoutRef<'h6'>) => (
    <h6 className="text-base font-semibold mb-2 mt-3 text-white/70" {...props} />
  ),

  // Paragraphs with better spacing
  p: (props: ComponentPropsWithoutRef<'p'>) => (
    <p className="text-lg leading-relaxed mb-4 text-white/90" {...props} />
  ),

  // Lists
  ul: (props: ComponentPropsWithoutRef<'ul'>) => (
    <ul className="list-disc list-inside mb-4 space-y-2 text-white/90 ml-4" {...props} />
  ),
  ol: (props: ComponentPropsWithoutRef<'ol'>) => (
    <ol className="list-decimal list-inside mb-4 space-y-2 text-white/90 ml-4" {...props} />
  ),
  li: (props: ComponentPropsWithoutRef<'li'>) => (
    <li className="text-lg leading-relaxed" {...props} />
  ),

  // Code blocks
  code: CodeBlock,

  // Pre blocks (for code)
  pre: (props: ComponentPropsWithoutRef<'pre'>) => (
    <pre className="my-4" {...props} />
  ),

  // Links
  a: (props: ComponentPropsWithoutRef<'a'>) => (
    <a 
      className="text-celo-yellow hover:underline font-medium" 
      target={props.href?.startsWith('http') ? '_blank' : undefined}
      rel={props.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      {...props} 
    />
  ),

  // Blockquotes
  blockquote: (props: ComponentPropsWithoutRef<'blockquote'>) => (
    <blockquote className="border-l-4 border-celo-yellow/50 pl-4 italic my-4 text-white/80 bg-white/5 py-2 rounded-r" {...props} />
  ),

  // Tables
  table: (props: ComponentPropsWithoutRef<'table'>) => (
    <div className="overflow-x-auto my-6">
      <table className="min-w-full border-collapse border border-white/10" {...props} />
    </div>
  ),
  thead: (props: ComponentPropsWithoutRef<'thead'>) => (
    <thead className="bg-white/5" {...props} />
  ),
  tbody: (props: ComponentPropsWithoutRef<'tbody'>) => (
    <tbody {...props} />
  ),
  tr: (props: ComponentPropsWithoutRef<'tr'>) => (
    <tr className="border-b border-white/10" {...props} />
  ),
  th: (props: ComponentPropsWithoutRef<'th'>) => (
    <th className="px-4 py-2 text-left text-celo-yellow font-semibold" {...props} />
  ),
  td: (props: ComponentPropsWithoutRef<'td'>) => (
    <td className="px-4 py-2 text-white/90" {...props} />
  ),

  // Horizontal rule
  hr: (props: ComponentPropsWithoutRef<'hr'>) => (
    <hr className="my-8 border-t border-white/20" {...props} />
  ),

  // Strong/Bold
  strong: (props: ComponentPropsWithoutRef<'strong'>) => (
    <strong className="font-bold text-celo-yellow" {...props} />
  ),

  // Emphasis/Italic
  em: (props: ComponentPropsWithoutRef<'em'>) => (
    <em className="italic text-white" {...props} />
  ),

  // Images
  img: (props: ComponentPropsWithoutRef<'img'>) => (
    <img 
      className="rounded-lg my-6 max-w-full h-auto shadow-lg"
      loading="lazy"
      {...props} 
    />
  ),

  // iframe for embeds (YouTube, etc.)
  iframe: (props: ComponentPropsWithoutRef<'iframe'>) => (
    <div className="my-6 aspect-video rounded-lg overflow-hidden shadow-lg">
      <iframe
        className="w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        {...props}
      />
    </div>
  ),

  // div to allow wrapped iframes
  div: (props: ComponentPropsWithoutRef<'div'>) => (
    <div {...props} />
  ),

  // video tag support
  video: (props: ComponentPropsWithoutRef<'video'>) => (
    <video 
      className="w-full rounded-lg my-6 shadow-lg"
      controls
      {...props}
    />
  ),

  // Interactive Components
  Callout,
  Tabs,
  Accordion,
  CodeEmbed,
};
