'use client';
import { UpcomingCollection } from '@/app/marketplace/data';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Lock } from 'lucide-react';

interface UpcomingGridProps {
  upcoming: UpcomingCollection[];
  className?: string;
}

export default function UpcomingGrid({ upcoming, className = '' }: UpcomingGridProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display celo-heading">Próximamente</h2>
        <Badge variant="outline" className="celo-border celo-text">
          <Clock className="w-3 h-3 mr-1" />
          En desarrollo
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {upcoming.map((collection, index) => (
          <Card
            key={index}
            className="celo-card celo-border rounded-2xl overflow-hidden shadow-soft opacity-60 cursor-not-allowed"
          >
            <CardContent className="p-0">
              {/* Collection Preview */}
              <div className="aspect-square celo-border border-b bg-gradient-to-br from-celo-gray-200/20 to-celo-gray-300/20 flex items-center justify-center relative">
                <div className="text-center p-6">
                  <div className="w-16 h-16 mx-auto mb-3 celo-border border-2 rounded-full bg-celo-gray-300/30 flex items-center justify-center">
                    <Lock className="w-8 h-8 celo-text opacity-50" />
                  </div>
                  <p className="text-xs celo-text opacity-50">Próximamente</p>
                </div>
                
                {/* Disabled Overlay */}
                <div className="absolute inset-0 bg-celo-gray-200/20 dark:bg-celo-gray-700/20 flex items-center justify-center">
                  <div className="text-center">
                    <Lock className="w-6 h-6 celo-text opacity-50 mx-auto mb-2" />
                    <p className="text-xs celo-text opacity-50 font-medium">No disponible</p>
                  </div>
                </div>
              </div>

              {/* Collection Info */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold celo-text text-lg opacity-60">
                    {collection.name}
                  </h3>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm celo-text opacity-50">Estado</span>
                  <Badge variant="outline" className="celo-border celo-text opacity-50">
                    {collection.eta}
                  </Badge>
                </div>

                <div className="w-full h-10 celo-border border rounded-xl flex items-center justify-center bg-celo-gray-200/20 dark:bg-celo-gray-700/20">
                  <span className="text-sm celo-text opacity-50 font-medium">
                    Próximamente
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {upcoming.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 celo-border border-2 rounded-full bg-celo-gray-300/30 flex items-center justify-center">
            <Clock className="w-8 h-8 celo-text opacity-50" />
          </div>
          <h3 className="text-lg font-display celo-heading mb-2">No hay colecciones próximas</h3>
          <p className="text-sm celo-text opacity-70">
            Las nuevas colecciones aparecerán aquí cuando estén en desarrollo.
          </p>
        </div>
      )}

      {/* Coming Soon Notice */}
      <div className="celo-card celo-border rounded-2xl p-6 bg-gradient-to-r from-celo-yellow/10 to-celo-lime/10">
        <div className="flex items-center gap-3 mb-3">
          <Clock className="w-5 h-5 celo-heading" />
          <h3 className="text-lg font-display celo-heading">Más colecciones en camino</h3>
        </div>
        <p className="text-sm celo-text leading-relaxed">
          Estamos trabajando en nuevas colecciones de NFTs con impacto social. 
          Mantente atento para ser el primero en conocer las próximas lanzamientos.
        </p>
      </div>
    </div>
  );
}
