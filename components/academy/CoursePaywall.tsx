"use client";

import { Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

interface CoursePaywallProps {
  courseTitle: string;
  courseSlug: string;
  reason: "WALLET_NOT_CONNECTED" | "NOT_ENROLLED" | "LOADING";
  isWalletConnected?: boolean;
  onEnroll?: () => void;
  isEnrolling?: boolean;
}

export function CoursePaywall({
  courseTitle,
  courseSlug,
  reason,
  isWalletConnected = false,
  onEnroll,
  isEnrolling = false,
}: CoursePaywallProps) {
  const { login } = useAuth();
  
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Locked Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-celo-yellow/20 dark:bg-celo-yellow/10 rounded-full blur-xl" />
            <div className="relative bg-celo-bg border-2 border-celo-border rounded-full p-6">
              <Lock className="w-12 h-12 text-celo-yellow" />
            </div>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-celo-bg border border-celo-border rounded-2xl p-8 shadow-lg">
          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-display font-bold text-celo-fg text-center mb-4">
            Contenido Bloqueado
          </h2>

          {/* Description based on reason */}
          {reason === "WALLET_NOT_CONNECTED" && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                    Conecta tu Wallet
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Para acceder al contenido del curso &quot;{courseTitle}&quot;, necesitas conectar tu wallet y reclamar tu badge de inscripción NFT.
                  </p>
                </div>
              </div>

              <div className="flex justify-center pt-2">
                <Button
                  size="lg"
                  onClick={login}
                  className="bg-celo-yellow hover:bg-celo-yellow/90 text-black font-bold"
                >
                  Conectar Wallet
                </Button>
              </div>
            </div>
          )}

          {reason === "NOT_ENROLLED" && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100 mb-1">
                    Inscripción Requerida
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Para acceder a las lecciones de &quot;{courseTitle}&quot;, debes inscribirte al curso y reclamar tu badge NFT de inscripción.
                  </p>
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-3 py-4">
                <p className="text-sm font-medium text-celo-fg mb-3">
                  Al inscribirte recibirás:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm text-celo-muted">
                      Badge NFT de inscripción verificable on-chain
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm text-celo-muted">
                      Acceso completo a todos los módulos y lecciones
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm text-celo-muted">
                      Certificado on-chain al completar el curso
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm text-celo-muted">
                      Seguimiento de progreso personalizado
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <Link href={`/academy/${courseSlug}`}>
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-celo-yellow hover:bg-celo-yellow/90 text-black font-bold"
                  >
                    Ver Detalles del Curso
                  </Button>
                </Link>
                {onEnroll && (
                  <Button
                    size="lg"
                    onClick={onEnroll}
                    disabled={isEnrolling}
                    className="w-full sm:w-auto"
                    variant="outline"
                  >
                    {isEnrolling ? "Inscribiendo..." : "Inscribirme Ahora"}
                  </Button>
                )}
              </div>
            </div>
          )}

          {reason === "LOADING" && (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="w-8 h-8 border-4 border-celo-yellow border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-celo-muted">
                Verificando tu inscripción...
              </p>
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-celo-muted">
            Los badges NFT son gratuitos y solo pagas el gas de la transacción en Celo (~$0.001 USD)
          </p>
        </div>
      </div>
    </div>
  );
}
