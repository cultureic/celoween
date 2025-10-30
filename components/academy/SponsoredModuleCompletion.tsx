'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  Zap,
  Trophy,
  ExternalLink,
  Star,
} from 'lucide-react';
import { useSmartAccount } from '@/lib/contexts/ZeroDevSmartWalletProvider';
import { usePrivy } from '@privy-io/react-auth';
import { useUnifiedModuleCompletion } from '@/lib/contexts/ModuleCompletionContext';

interface SponsoredModuleCompletionProps {
  courseSlug: string;
  courseId: string;
  moduleIndex: number;
  moduleTitle: string;
  isCompleted?: boolean;
  isEnrolled?: boolean;
  className?: string;
}

export function SponsoredModuleCompletion({
  courseSlug,
  courseId,
  moduleIndex,
  moduleTitle,
  isCompleted = false,
  isEnrolled = false,
  className = '',
}: SponsoredModuleCompletionProps) {
  const { authenticated, ready } = usePrivy();
  const {
    isSmartAccountReady,
    smartAccountAddress,
    canSponsorTransaction,
    error: smartAccountError,
  } = useSmartAccount();
  
  // USE UNIFIED CONTEXT FOR SHARED STATE
  const {
    isCompleting,
    completionHash,
    completionError,
    completionSuccess,
    completeWithSponsorship,
    resetCompletion,
  } = useUnifiedModuleCompletion();

  const [showTransactionDetails, setShowTransactionDetails] = useState(false);

  // Don't show if not enrolled or not authenticated
  if (!ready || !authenticated || !isEnrolled) {
    return null;
  }

  // Don't show if smart account isn't ready
  if (!isSmartAccountReady || !canSponsorTransaction) {
    return (
      <div className={`text-center py-4 ${className}`}>
        <div className="text-sm text-gray-500">
          Preparando completar módulo sin gas...
        </div>
        {smartAccountError && (
          <div className="text-xs text-red-500 mt-1">
            Error: {smartAccountError}
          </div>
        )}
      </div>
    );
  }

  // Show completion success
  if (completionSuccess && completionHash) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            ¡Módulo Completado!
          </CardTitle>
          <CardDescription>
            Has completado exitosamente: {moduleTitle}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-green-200 bg-green-50">
            <Star className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="text-green-800">
              Tu progreso ha sido registrado en la blockchain. ¡Sigue así!
            </AlertDescription>
          </Alert>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Transacción Patrocinada
                </p>
                <p className="text-xs text-gray-500">
                  Hash: {completionHash.slice(0, 10)}...{completionHash.slice(-8)}
                </p>
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                  Sin Gas
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(
                    `https://alfajores.celoscan.io/tx/${completionHash}`, 
                    '_blank'
                  )}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Ver
                </Button>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                resetCompletion();
                setShowTransactionDetails(false);
              }}
              className="text-blue-600 hover:text-blue-800"
            >
              Continuar con el siguiente módulo
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show completion button if not completed
  if (!isCompleted) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Trophy className="h-4 w-4 text-yellow-500" />
            Completar Módulo
          </CardTitle>
          <CardDescription className="text-sm">
            Registra tu progreso en la blockchain sin pagar gas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Sponsored Transaction Info */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              <div className="text-xs">
                <p className="font-medium text-blue-900">
                  Transacción Patrocinada
                </p>
                <p className="text-blue-700">
                  Sin costo de gas - patrocinado por Celo Academy
                </p>
              </div>
            </div>
          </div>

          {/* Smart Account Address */}
          {smartAccountAddress && (
            <div className="text-xs text-gray-500">
              <p>Desde: {smartAccountAddress.slice(0, 6)}...{smartAccountAddress.slice(-4)}</p>
            </div>
          )}

          {/* Complete Button */}
          <Button
            onClick={() => completeWithSponsorship()}
            disabled={isCompleting || !canSponsorTransaction}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
            size="default"
          >
            {isCompleting ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                Completando sin Gas...
              </>
            ) : (
              <>
                <Trophy className="mr-2 h-3 w-3" />
                Marcar como Completado (Gratis)
              </>
            )}
          </Button>

          {/* Error Display */}
          {completionError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Error completando módulo: {completionError?.message || 'Error desconocido'}
              </AlertDescription>
            </Alert>
          )}

          {/* Benefits */}
          <div className="text-xs text-gray-600">
            <p>✨ Tu progreso se guarda permanentemente en Celo blockchain</p>
            <p>🆓 Sin costo de gas - completamente gratuito</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show already completed state
  return (
    <div className={`text-center py-2 ${className}`}>
      <div className="inline-flex items-center gap-2 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
        <CheckCircle className="h-4 w-4" />
        <span className="font-medium">Módulo Completado</span>
        <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
          En Blockchain
        </Badge>
      </div>
    </div>
  );
}