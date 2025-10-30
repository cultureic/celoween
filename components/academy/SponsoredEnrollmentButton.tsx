'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Loader2, 
  Wallet, 
  CheckCircle, 
  AlertCircle, 
  Zap,
  Gift,
  ExternalLink 
} from 'lucide-react';
import { useSponsoredEnrollment } from '@/lib/hooks/useSponsoredEnrollment';
import { useSmartAccount } from '@/lib/contexts/ZeroDevSmartWalletProvider';
import { usePrivy } from '@privy-io/react-auth';

interface SponsoredEnrollmentButtonProps {
  courseSlug: string;
  courseId: string;
  courseTitle: string;
  className?: string;
}

export function SponsoredEnrollmentButton({
  courseSlug,
  courseId,
  courseTitle,
  className = '',
}: SponsoredEnrollmentButtonProps) {
  const { login, logout, authenticated, ready } = usePrivy();
  const {
    isSmartAccountReady,
    smartAccountAddress,
    canSponsorTransaction,
    isCreatingSmartAccount,
    error: smartAccountError,
  } = useSmartAccount();
  
  const {
    isEnrolling,
    enrollmentHash,
    enrollmentError,
    enrollmentSuccess,
    enrollWithSponsorship,
    resetEnrollment,
  } = useSponsoredEnrollment({ courseSlug, courseId });

  const [showDetails, setShowDetails] = useState(false);

  // Reset enrollment state when component mounts
  useEffect(() => {
    resetEnrollment();
  }, [resetEnrollment]);

  // Show login button if not authenticated
  if (!ready || !authenticated) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-green-500" />
            Inscripción Gratuita
          </CardTitle>
          <CardDescription>
            Inscríbete gratis sin pagar gas - patrocinado por Celo Academy
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Zap className="h-6 w-6 text-yellow-500" />
              <div>
                <p className="font-medium text-green-900">
                  ⚡ Transacciones Patrocinadas
                </p>
                <p className="text-sm text-green-700">
                  No necesitas CELO para gas - nosotros pagamos por ti
                </p>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={login}
            className="w-full bg-celo-yellow hover:bg-celo-yellow/90 text-black font-bold"
            size="lg"
          >
            <Wallet className="mr-2 h-4 w-4" />
            Conectar Wallet para Inscribirse
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Show smart account setup
  if (!isSmartAccountReady) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-green-500" />
            Inscripción Gratuita
          </CardTitle>
          <CardDescription>
            Configurando tu cuenta inteligente para transacciones gratuitas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
              <p className="text-sm font-medium text-gray-700">
                {isCreatingSmartAccount ? 'Creando cuenta inteligente...' : 'Preparando inscripción gratuita...'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Esto solo toma unos segundos
              </p>
            </div>
          </div>
          
          {smartAccountError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Error configurando cuenta: {smartAccountError}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    );
  }

  // Show enrollment success
  if (enrollmentSuccess && enrollmentHash) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            ¡Inscripción Exitosa!
          </CardTitle>
          <CardDescription>
            Te has inscrito exitosamente al curso &quot;{courseTitle}&quot;
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Tu NFT de inscripción ha sido minteado exitosamente. ¡Ahora puedes acceder a todo el contenido del curso!
            </AlertDescription>
          </Alert>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Transacción en Blockchain
                </p>
                <p className="text-xs text-gray-500">
                  Hash: {enrollmentHash.slice(0, 10)}...{enrollmentHash.slice(-8)}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(
                  `https://celoscan.io/tx/${enrollmentHash}`, 
                  '_blank'
                )}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Ver
              </Button>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-green-600 font-medium">
              🎉 ¡Felicidades! Ya puedes comenzar a aprender
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show enrollment button
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-green-500" />
          Inscripción Gratuita
        </CardTitle>
        <CardDescription>
          Inscríbete al curso &quot;{courseTitle}&quot; sin pagar gas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Smart Account Info */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="h-6 w-6 text-yellow-500" />
              <div>
                <p className="font-medium text-green-900">
                  ⚡ Transacciones Patrocinadas
                </p>
                <p className="text-sm text-green-700">
                  Gas gratuito patrocinado por Celo Academy
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {canSponsorTransaction ? 'Disponible' : 'Configurando'}
            </Badge>
          </div>
        </div>

        {/* Smart Account Address */}
        {smartAccountAddress && (
          <div className="text-xs text-gray-500">
            <p>Cuenta inteligente: {smartAccountAddress.slice(0, 6)}...{smartAccountAddress.slice(-4)}</p>
          </div>
        )}

        {/* Enrollment Button */}
        <Button
          onClick={enrollWithSponsorship}
          disabled={isEnrolling || !canSponsorTransaction}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold"
          size="lg"
        >
          {isEnrolling ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Inscribiendo sin Gas...
            </>
          ) : (
            <>
              <Gift className="mr-2 h-4 w-4" />
              Inscribirse Gratis (Sin Gas)
            </>
          )}
        </Button>

        {/* Error Display */}
        {enrollmentError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Error en la inscripción: {enrollmentError}
            </AlertDescription>
          </Alert>
        )}

        {/* Benefits List */}
        <div className="pt-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            {showDetails ? 'Ocultar detalles' : '¿Por qué es gratis?'}
          </button>
          
          {showDetails && (
            <div className="mt-3 space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Sin costos de gas - patrocinado por Celo Academy</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>NFT de inscripción verificable en blockchain</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Acceso completo a todo el contenido del curso</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Certificado NFT al completar el curso</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}