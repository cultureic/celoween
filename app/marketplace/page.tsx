'use client';
import { useState, useRef } from 'react';
import { featuredCollection, featuredAssets, upcoming } from './data';
import CollectionHero from '@/components/marketplace/CollectionHero';
import AssetGrid from '@/components/marketplace/AssetGrid';
import UpcomingGrid from '@/components/marketplace/UpcomingGrid';
import BalanceWidget from '@/components/BalanceWidget';
import { Button } from '@/components/ui/button';
import { ArrowDown, ShoppingBag } from 'lucide-react';

export default function MarketplacePage() {
  const [activeSection, setActiveSection] = useState<'hero' | 'assets' | 'upcoming'>('hero');
  const assetsRef = useRef<HTMLDivElement>(null);
  const upcomingRef = useRef<HTMLDivElement>(null);

  const scrollToAssets = () => {
    assetsRef.current?.scrollIntoView({ behavior: 'smooth' });
    setActiveSection('assets');
  };

  const scrollToUpcoming = () => {
    upcomingRef.current?.scrollIntoView({ behavior: 'smooth' });
    setActiveSection('upcoming');
  };

  return (
    <div className="min-h-screen celo-bg celo-text">
      {/* Page Header */}
      <div className="border-b celo-border">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl lg:text-5xl font-display celo-heading mb-2">
                Marketplace
              </h1>
              <p className="text-lg celo-text opacity-80">
                Descubre y compra NFTs con impacto social en Celo
              </p>
            </div>
            <div className="hidden lg:flex items-center gap-2">
              <ShoppingBag className="w-8 h-8 celo-heading" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 space-y-16">
        {/* Collection Hero Section */}
        <section className="space-y-8">
          <CollectionHero 
            collection={featuredCollection} 
            onViewAssets={scrollToAssets}
          />
        </section>

        {/* Balance & On-Ramp Section */}
        <section className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <BalanceWidget />
          </div>
          <div className="lg:col-span-2">
            <div className="celo-card celo-border rounded-2xl p-6">
              <h3 className="text-xl font-display celo-heading mb-4">
                ¿Cómo funciona?
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 celo-border border rounded-full bg-celo-yellow/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold celo-heading">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold celo-heading mb-1">Conecta tu wallet</h4>
                    <p className="text-sm celo-text opacity-80">
                      Usa Privy para conectar tu wallet de forma segura
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 celo-border border rounded-full bg-celo-yellow/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold celo-heading">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold celo-heading mb-1">Compra cUSD</h4>
                    <p className="text-sm celo-text opacity-80">
                      Usa el on-ramp para comprar cUSD con tu tarjeta
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 celo-border border rounded-full bg-celo-yellow/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold celo-heading">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold celo-heading mb-1">Compra NFTs</h4>
                    <p className="text-sm celo-text opacity-80">
                      Selecciona y compra los NFTs que más te gusten
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Assets Grid Section */}
        <section ref={assetsRef} className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-display celo-heading mb-2">
                Colección Destacada
              </h2>
              <p className="celo-text opacity-80">
                Explora los NFTs disponibles de {featuredCollection.name}
              </p>
            </div>
            <Button
              onClick={scrollToUpcoming}
              variant="outline"
              className="celo-border celo-text hover:bg-celo-yellow/10"
              aria-label="Ver colecciones próximas"
            >
              Próximamente
              <ArrowDown className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <AssetGrid assets={featuredAssets} />
        </section>

        {/* Upcoming Collections Section */}
        <section ref={upcomingRef} className="space-y-8">
          <UpcomingGrid upcoming={upcoming} />
        </section>

        {/* Footer CTA */}
        <section className="celo-card celo-border rounded-2xl p-8 text-center bg-gradient-to-r from-celo-yellow/10 to-celo-lime/10">
          <h3 className="text-2xl font-display celo-heading mb-4">
            ¿Listo para empezar?
          </h3>
          <p className="text-lg celo-text opacity-80 mb-6 max-w-2xl mx-auto">
            Únete a la revolución de los NFTs con impacto social. 
            Cada compra contribuye a proyectos reales que mejoran vidas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={scrollToAssets}
              className="bg-celo-yellow hover:bg-celo-yellowAlt text-celo-black font-semibold px-8 py-3 rounded-xl"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Explorar NFTs
            </Button>
            <Button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              variant="outline"
              className="celo-border celo-text hover:bg-celo-yellow/10 px-8 py-3 rounded-xl"
            >
              Volver arriba
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}