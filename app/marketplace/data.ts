export interface Collection {
  id: string;
  name: string;
  short: string;
  image: string;
  supply: number;
  minted: number;
  floorPrice: string;
  network: string;
}

export interface Asset {
  id: string;
  name: string;
  img: string;
  price: string;
}

export interface UpcomingCollection {
  name: string;
  eta: string;
  disabled: boolean;
}

export const featuredCollection: Collection = {
  id: "impact-nft-001",
  name: "Impact NFTs — Celo Mexico",
  short: "Colección piloto para financiar proyectos con impacto real.",
  image: "/placeholder/collection-hero.png",
  supply: 1000,
  minted: 128,
  floorPrice: "5 cUSD",
  network: "Celo Mainnet",
};

export const featuredAssets: Asset[] = [
  {
    id: "asset-001",
    name: "Impact #001",
    img: "/placeholder/nft-1.png",
    price: "5 cUSD"
  },
  {
    id: "asset-002", 
    name: "Impact #002",
    img: "/placeholder/nft-2.png",
    price: "5 cUSD"
  },
  {
    id: "asset-003",
    name: "Impact #003", 
    img: "/placeholder/nft-3.png",
    price: "5 cUSD"
  },
  {
    id: "asset-004",
    name: "Impact #004",
    img: "/placeholder/nft-4.png", 
    price: "5 cUSD"
  },
  {
    id: "asset-005",
    name: "Impact #005",
    img: "/placeholder/nft-5.png",
    price: "5 cUSD"
  },
  {
    id: "asset-006",
    name: "Impact #006",
    img: "/placeholder/nft-6.png",
    price: "5 cUSD"
  },
  {
    id: "asset-007",
    name: "Impact #007",
    img: "/placeholder/nft-7.png",
    price: "5 cUSD"
  },
  {
    id: "asset-008",
    name: "Impact #008",
    img: "/placeholder/nft-8.png",
    price: "5 cUSD"
  }
];

export const upcoming: UpcomingCollection[] = [
  { name: "Colección #2", eta: "Próximamente", disabled: true },
  { name: "Colección #3", eta: "Próximamente", disabled: true },
  { name: "Colección #4", eta: "Próximamente", disabled: true },
  { name: "Colección #5", eta: "Próximamente", disabled: true },
];
