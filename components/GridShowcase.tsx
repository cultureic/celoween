export default function GridShowcase() {
  const cards = Array.from({ length: 9 }, (_, i) => ({
    title: `Starter ${i + 1}`,
    desc: 'Descripción breve del recurso',
  }));
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {cards.map((c) => (
        <div key={c.title} className="celo-card celo-border rounded-2xl p-5">
          <div className="h-28 rounded-xl bg-gradient-to-br from-celo.yellowAlt to-celo.lime mb-4" />
          <h3 className="font-display">{c.title}</h3>
          <p className="text-sm opacity-80">{c.desc}</p>
        </div>
      ))}
    </div>
  );
}



