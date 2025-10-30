export default function PillRow() {
  const items = ['Mento', 'Valora', 'Circle', 'Opera', 'GoodDollar', 'Bitso', 'Rarible', 'Safe', 'Uniswap'];
  return (
    <div className="flex gap-2 sm:gap-3 overflow-x-auto py-2 scrollbar-hide" role="list">
      {items.map((i) => (
        <div 
          key={i} 
          role="listitem" 
          className="celo-card celo-border rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm whitespace-nowrap flex-shrink-0 hover:scale-105 transition-transform duration-200"
        >
          {i}
        </div>
      ))}
    </div>
  );
}



