'use client';
import { useState } from 'react';
// Mock authentication for demo
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ShoppingCart, Wallet, X } from 'lucide-react';
import PrivyLogin from '@/components/PrivyLogin';

interface Asset {
  id: string;
  name: string;
  price: string;
}

interface BuySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: Asset;
}

export default function BuySheet({ open, onOpenChange, asset }: BuySheetProps) {
  const [authenticated, setAuthenticated] = useState(false); // Mock authentication
  const login = () => setAuthenticated(true);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  // Extract price number from string like "5 cUSD"
  const priceNumber = parseFloat(asset.price.split(' ')[0]);
  const totalPrice = (quantity * priceNumber).toFixed(2);

  const handleConfirmPurchase = async () => {
    if (!authenticated) {
      login();
      return;
    }

    setLoading(true);
    
    // Simulate purchase process
    setTimeout(() => {
      console.info('buy:intent', {
        assetId: asset.id,
        qty: quantity,
        totalPrice: `${totalPrice} cUSD`
      });
      
      // Show success message (in a real app, you'd use a toast library)
      alert(`Compra enviada (demo): ${quantity}x ${asset.name} por ${totalPrice} cUSD`);
      
      setLoading(false);
      onOpenChange(false);
    }, 1500);
  };

  const handleQuantityChange = (value: string) => {
    const num = parseInt(value) || 1;
    setQuantity(Math.max(1, Math.min(10, num))); // Limit between 1-10
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="celo-card celo-border max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 celo-heading">
            <ShoppingCart className="w-5 h-5" />
            Comprar NFT
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Asset Info */}
          <Card className="celo-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg celo-heading">{asset.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm celo-text">Precio unitario</span>
                <span className="font-semibold celo-heading">{asset.price}</span>
              </div>
            </CardContent>
          </Card>

          {/* Quantity Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium celo-heading">
              Cantidad
            </label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="celo-border celo-text"
                aria-label="Reducir cantidad"
              >
                <X className="w-4 h-4" />
              </Button>
              
              <Input
                type="number"
                value={quantity}
                onChange={(e) => handleQuantityChange(e.target.value)}
                min="1"
                max="10"
                className="text-center celo-border celo-text"
                aria-label="Cantidad a comprar"
              />
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                disabled={quantity >= 10}
                className="celo-border celo-text"
                aria-label="Aumentar cantidad"
              >
                +
              </Button>
            </div>
          </div>

          {/* Total Price */}
          <div className="p-4 celo-border border rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium celo-heading">Total</span>
              <span className="text-2xl font-display celo-heading">
                {totalPrice} cUSD
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          {!authenticated ? (
            <div className="space-y-3">
              <p className="text-sm celo-text text-center">
                Conecta tu wallet para continuar
              </p>
              <PrivyLogin />
            </div>
          ) : (
            <div className="space-y-3">
              <Button
                onClick={handleConfirmPurchase}
                disabled={loading}
                className="w-full bg-celo-yellow hover:bg-celo-yellowAlt text-celo-black font-semibold py-3 rounded-xl transition-all duration-200"
                aria-label="Confirmar compra"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-celo-black/30 border-t-celo-black rounded-full animate-spin" />
                    Procesando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4" />
                    Confirmar Compra
                  </div>
                )}
              </Button>
              
              <p className="text-xs celo-text opacity-70 text-center">
                Esta es una demostración. En producción se conectaría con el contrato inteligente.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

