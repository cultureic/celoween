const items = [
  'Ultra-green',
  'Lower Fees',
  'OP-Stack L2',
  'EigenDA v2',
  'Proof of Ship',
  'Native Bridging',
];

export default function FrontierInnovation() {
  return (
    <div className="grid gap-3 sm:gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((x) => (
        <div key={x} className="celo-card celo-border rounded-2xl p-4 sm:p-5 lg:p-6 hover:scale-105 transition-transform duration-200">
          <div className="text-xs sm:text-sm opacity-70 mb-2">Pillar</div>
          <div className="font-display text-lg sm:text-xl lg:text-2xl leading-tight">{x}</div>
        </div>
      ))}
    </div>
  );
}



