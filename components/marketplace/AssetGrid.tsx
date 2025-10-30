'use client';
import { Asset } from '@/app/marketplace/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';
import BuySheet from './BuySheet';

interface AssetGridProps {
  assets: Asset[];
  className?: string;
}

export default function AssetGrid({ assets, className = '' }: AssetGridProps) {
  const [authenticated] = useState(true); // Mock: assume authenticated for demo
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [showBuySheet, setShowBuySheet] = useState(false);

  const handleBuyAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setShowBuySheet(true);
  };

  return (
    <>
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-display celo-heading">Assets Disponibles</h2>
          <span className="text-sm celo-text opacity-70">
            {assets.length} items
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {assets.map((asset) => (
            <Card
              key={asset.id}
              className="celo-card celo-border rounded-2xl overflow-hidden shadow-soft hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group"
            >
              <CardContent className="p-0">
                {/* Asset Image */}
                <div className="aspect-square celo-border border-b bg-gradient-to-br from-celo-yellow/20 to-celo-lime/20 flex items-center justify-center relative overflow-hidden">
                  <div className="text-center p-6">
                    <div className="w-16 h-16 mx-auto mb-3 celo-border border-2 rounded-full bg-celo-yellow/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <ImageIcon className="w-8 h-8 celo-heading" />
                    </div>
                    <p className="text-xs celo-text opacity-70">NFT Preview</p>
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-celo-yellow/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <Button
                      onClick={() => handleBuyAsset(asset)}
                      size="sm"
                      className="bg-celo-yellow hover:bg-celo-yellowAlt text-celo-black font-semibold shadow-lg"
                      aria-label={`Comprar ${asset.name}`}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Comprar
                    </Button>
                  </div>
                </div>

                {/* Asset Info */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold celo-heading text-lg">{asset.name}</h3>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm celo-text">Precio</span>
                    <span className="font-semibold celo-heading">{asset.price}</span>
                  </div>

                  <Button
                    onClick={() => handleBuyAsset(asset)}
                    className="w-full bg-celo-yellow hover:bg-celo-yellowAlt text-celo-black font-semibold transition-all duration-200"
                    aria-label={`Comprar ${asset.name}`}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Comprar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {assets.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 celo-border border-2 rounded-full bg-celo-yellow/30 flex items-center justify-center">
              <ImageIcon className="w-8 h-8 celo-heading" />
            </div>
            <h3 className="text-lg font-display celo-heading mb-2">No hay assets disponibles</h3>
            <p className="text-sm celo-text opacity-70">
              Los nuevos assets aparecerán aquí cuando estén disponibles.
            </p>
          </div>
        )}
      </div>

      {/* Buy Sheet Modal */}
      {selectedAsset && (
        <BuySheet
          open={showBuySheet}
          onOpenChange={setShowBuySheet}
          asset={selectedAsset}
        />
      )}
    </>
  );
}
