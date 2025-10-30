import { ReactNode } from 'react';

export default function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="mb-6 sm:mb-8 lg:mb-12">
        <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight text-black dark:text-celo-yellow transition-colors group-hover:text-black">{title}</h2>
        {subtitle && <p className="mt-2 sm:mt-3 max-w-2xl text-sm sm:text-base opacity-80 leading-relaxed text-black/80 dark:text-celo-fg transition-colors group-hover:text-black">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}



