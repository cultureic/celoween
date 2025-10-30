export default function CTA({ title, href }: { title: string; href: string }) {
  return (
    <a href={href} className="celo-card celo-border rounded-2xl p-6 block hover:-translate-y-1 transition-transform">
      <h3 className="font-display text-xl">{title}</h3>
      <p className="text-sm opacity-80">Más detalles →</p>
    </a>
  );
}



