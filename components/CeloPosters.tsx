'use client';
import Image from 'next/image';

// Poster URLs ordered from 1-11
const posterUrls = [
  'https://i.postimg.cc/gjz70Gjr/01.avif',
  'https://i.postimg.cc/MZ54Ff3B/02.avif',
  'https://i.postimg.cc/NM7VYKgW/03.avif',
  'https://i.postimg.cc/VvKVr20g/04.avif',
  'https://i.postimg.cc/J4hgV7S2/05.avif',
  'https://i.postimg.cc/BQwzq90Q/06.avif',
  'https://i.postimg.cc/2SsXZQys/07.avif',
  'https://i.postimg.cc/bv1VHZ2s/09.avif',
  'https://i.postimg.cc/zvGdrp2g/010.avif',
  'https://i.postimg.cc/d3N5tdgS/011.avif'
];

export default function CeloPosters() {
  return (
    <div className="grid gap-2 sm:gap-3 lg:gap-4 grid-cols-3 sm:grid-cols-4 lg:grid-cols-6">
      {posterUrls.map((url, index) => (
        <div key={index} className="relative aspect-[3/4] overflow-hidden group cursor-pointer">
          <Image
            src={url}
            alt={`Celo Poster ${index + 1}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>
      ))}
    </div>
  );
}
