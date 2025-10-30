'use client';
import { Collection } from '@/app/marketplace/data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, ArrowRight, Eye } from 'lucide-react';
// Mock authentication for demo
import { useState } from 'react';
import BuySheet from './BuySheet';
import RampLauncher from '@/components/RampLauncher';

interface CollectionHeroProps {
  collection: Collection;
  onViewAssets: () => void;
}

export default function CollectionHero({ collection, onViewAssets }: CollectionHeroProps) {
  const [authenticated] = useState(true); // Mock: assume authenticated for demo
  const [showBuySheet, setShowBuySheet] = useState(false);

  const handleBuy = () => {
    if (!authenticated) {
      // This will be handled by the BuySheet component
    }
    setShowBuySheet(true);
  };

  return (
    <>
      <div className="celo-card celo-border rounded-2xl p-6 lg:p-8 shadow-soft">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Collection Image */}
          <div className="order-2 lg:order-1">
            <div className="aspect-square celo-border border rounded-2xl overflow-hidden bg-gradient-to-br from-celo-yellow/20 to-celo-lime/20 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-24 h-24 mx-auto mb-4 celo-border border-2 rounded-full bg-celo-yellow/30 flex items-center justify-center">
                  <ShoppingCart className="w-12 h-12 celo-heading" />
                </div>
                <p className="text-sm celo-text opacity-70">Imagen de colección</p>
              </div>
            </div>
          </div>

          {/* Collection Info */}
          <div className="order-1 lg:order-2 space-y-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-display celo-heading mb-3">
                {collection.name}
              </h1>
              <p className="text-lg celo-text leading-relaxed">
                {collection.short}
              </p>
            </div>

            {/* Collection Stats */}
            <div className="flex flex-wrap gap-3">
              <Badge variant="outline" className="celo-border celo-text">
                {collection.network}
              </Badge>
              <Badge variant="outline" className="celo-border celo-text">
                Supply: {collection.supply.toLocaleString()}
              </Badge>
              <Badge variant="outline" className="celo-border celo-text">
                Minted: {collection.minted.toLocaleString()}
              </Badge>
            </div>

            {/* Floor Price */}
            <div className="p-4 celo-border border rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm celo-text">Floor Price</span>
                <span className="text-2xl font-display celo-heading">{collection.floorPrice}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleBuy}
                className="flex-1 bg-celo-yellow hover:bg-celo-yellowAlt text-celo-black font-semibold py-3 rounded-xl transition-all duration-200 hover:shadow-lg"
                aria-label="Comprar NFT de la colección"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Comprar
              </Button>
              
              <Button
                onClick={onViewAssets}
                variant="outline"
                className="flex-1 celo-border celo-text hover:bg-celo-yellow/10 py-3 rounded-xl transition-all duration-200"
                aria-label="Ver todos los assets de la colección"
              >
                <Eye className="w-4 h-4 mr-2" />
                Ver Assets
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* On-Ramp Section */}
            <div className="pt-4 border-t celo-border">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium celo-heading">On-Ramp</span>
                <span className="text-xs celo-text opacity-70">Comprar cUSD</span>
              </div>
              <RampLauncher />
            </div>
          </div>
        </div>
      </div>

      {/* Buy Sheet Modal */}
      <BuySheet
        open={showBuySheet}
        onOpenChange={setShowBuySheet}
        asset={{
          id: collection.id,
          name: collection.name,
          price: collection.floorPrice
        }}
      />
    </>
  );
}
