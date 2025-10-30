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
import { useZeroDevEnrollment } from '@/lib/hooks/useZeroDevEnrollment';
import { useSmartAccount } from '@/lib/contexts/ZeroDevSmartWalletProvider';
import { usePrivy } from '@privy-io/react-auth';

interface ZeroDevEnrollmentButtonProps {
  courseSlug: string;
  courseId: string;
  courseTitle: string;
  className?: string;
}

export function ZeroDevEnrollmentButton({
  courseSlug,
  courseId,
  courseTitle,
  className = '',
}: ZeroDevEnrollmentButtonProps) {
  const { login, authenticated, ready } = usePrivy();
  const {
    smartAccountAddress,
    isInitializing,
    canSponsorTransaction,
    error: smartAccountError,
  } = useSmartAccount();
  
  const {
    enrollWithZeroDev,
    enrollmentHash,
    enrollmentSuccess,
    isEnrolling,
    error: enrollmentError,
    resetStates,
  } = useZeroDevEnrollment({ courseSlug, courseId });

  const [showDetails, setShowDetails] = useState(false);

  // Reset states when component mounts
  useEffect(() => {
    resetStates();
  }, [resetStates]);

  // Show login button if not authenticated
  if (!ready || !authenticated) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-green-500" />
            Inscripción Gratuita (ZeroDev)
          </CardTitle>
          <CardDescription>
            Inscríbete gratis sin pagar gas - patrocinado por ZeroDev
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Zap className="h-6 w-6 text-yellow-500" />
              <div>
                <p className="font-medium text-green-900">
                  ⚡ Transacciones Patrocinadas con ZeroDev
                </p>
                <p className="text-sm text-green-700">
                  Usa Account Abstraction - nosotros pagamos el gas
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
  if (isInitializing || !canSponsorTransaction) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-green-500" />
            Inscripción Gratuita (ZeroDev)
          </CardTitle>
          <CardDescription>
            Configurando smart account con ZeroDev para transacciones gratuitas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
              <p className="text-sm font-medium text-gray-700">
                Creando smart account con ZeroDev...
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Configurando Account Abstraction (ERC-4337)
              </p>
            </div>
          </div>
          
          {smartAccountError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Error configurando smart account: {smartAccountError}
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
            ¡Inscripción Exitosa con ZeroDev!
          </CardTitle>
          <CardDescription>
            Te has inscrito exitosamente al curso &quot;{courseTitle}&quot;
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Tu NFT de inscripción ha sido minteado usando ZeroDev Account Abstraction. 
              ¡Sin costo de gas para ti!
            </AlertDescription>
          </Alert>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Transacción Patrocinada (ZeroDev)
                </p>
                <p className="text-xs text-gray-500">
                  Hash: {enrollmentHash.slice(0, 10)}...{enrollmentHash.slice(-8)}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Smart Account: {smartAccountAddress?.slice(0, 6)}...{smartAccountAddress?.slice(-4)}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                  Gas Gratis
                </Badge>
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
          Inscripción Gratuita (ZeroDev)
        </CardTitle>
        <CardDescription>
          Inscríbete al curso &quot;{courseTitle}&quot; sin pagar gas usando Account Abstraction
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* ZeroDev Smart Account Info */}
        <div className="bg-gradient-to-r from-green-50 to-purple-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="h-6 w-6 text-yellow-500" />
              <div>
                <p className="font-medium text-green-900">
                  ⚡ ZeroDev Account Abstraction
                </p>
                <p className="text-sm text-green-700">
                  ERC-4337 Smart Account con gas patrocinado
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Listo
            </Badge>
          </div>
        </div>

        {/* Smart Account Address */}
        {smartAccountAddress && (
          <div className="text-xs text-gray-500">
            <p>Smart Account: {smartAccountAddress.slice(0, 6)}...{smartAccountAddress.slice(-4)}</p>
            <p className="text-blue-600">Powered by ZeroDev (Kernel v3.1 + EntryPoint v0.7)</p>
          </div>
        )}

        {/* Enrollment Button */}
        <Button
          onClick={enrollWithZeroDev}
          disabled={isEnrolling || !canSponsorTransaction}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold"
          size="lg"
        >
          {isEnrolling ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Inscribiendo con ZeroDev...
            </>
          ) : (
            <>
              <Gift className="mr-2 h-4 w-4" />
              Inscribirse Gratis (ZeroDev)
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
            {showDetails ? 'Ocultar detalles' : '¿Qué es ZeroDev?'}
          </button>
          
          {showDetails && (
            <div className="mt-3 space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Account Abstraction (ERC-4337) - sin gas</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Kernel v3.1 Smart Account con EntryPoint v0.7</span>
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