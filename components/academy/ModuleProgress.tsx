"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, ExternalLink, Wallet, Lock as LockIcon } from "lucide-react";
import { useModuleCompletion, useHasCompletedModule } from "@/lib/hooks/useModuleCompletion";
import { useAuth } from "@/hooks/useAuth";
import { useHasBadge } from "@/lib/hooks/useSimpleBadge";
import { getCourseTokenId } from "@/lib/courseToken";
import { useSmartAccount } from "@/lib/contexts/ZeroDevSmartWalletProvider";
import { useUnifiedModuleCompletion } from "@/lib/contexts/ModuleCompletionContext";

export default function ModuleProgress({
  courseSlug, courseId, moduleIndex
}:{ courseSlug:string; courseId:string; moduleIndex:number }) {
  const { wallet, login } = useAuth();
  const walletAddress = wallet?.address;
  const smartAccount = useSmartAccount();
  
  const tokenId = getCourseTokenId(courseSlug, courseId);
  
  // CHECK BOTH ADDRESSES FOR ENROLLMENT AND COMPLETION
  const walletEnrolled = useHasBadge(walletAddress as `0x${string}` | undefined, tokenId);
  const smartAccountEnrolled = useHasBadge(smartAccount.smartAccountAddress || undefined, tokenId);
  const enrolled = walletEnrolled.data || smartAccountEnrolled.data;
  
  // CHECK BOTH ADDRESSES FOR MODULE COMPLETION
  const walletCompletion = useHasCompletedModule(walletAddress as `0x${string}` | undefined, tokenId, moduleIndex);
  const smartAccountCompletion = useHasCompletedModule(smartAccount.smartAccountAddress || undefined, tokenId, moduleIndex);
  const hasCompleted = walletCompletion.data || smartAccountCompletion.data;
  const isLoading = walletCompletion.isLoading || smartAccountCompletion.isLoading || walletEnrolled.isLoading || smartAccountEnrolled.isLoading;
  
  // USE UNIFIED CONTEXT FOR SHARED STATE
  const {
    isCompleting,
    completionHash,
    completionError,
    completionSuccess,
    completeWithWallet,
  } = useUnifiedModuleCompletion();
  
  console.log(`[MODULE PROGRESS ${moduleIndex}] Dual check:`, {
    walletAddress,
    smartAccountAddress: smartAccount.smartAccountAddress,
    walletEnrolled: walletEnrolled.data,
    smartAccountEnrolled: smartAccountEnrolled.data,
    finalEnrolled: enrolled,
    walletCompleted: walletCompletion.data,
    smartAccountCompleted: smartAccountCompletion.data,
    finalHasCompleted: hasCompleted,
  });

  const [showSuccess, setShowSuccess] = useState(false);

  // Mark module as done in local storage when blockchain confirmation succeeds
  useEffect(() => {
    if (completionSuccess) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [completionSuccess]);

  const handleComplete = async () => {
    if (!walletAddress) {
      login();
      return;
    }
    
    await completeWithWallet();
  };

  // Show loading state while checking enrollment/blockchain
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Verificando...</span>
      </div>
    );
  }

  // Already completed
  if (hasCompleted || completionSuccess) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-emerald-600">
          <CheckCircle2 className="h-4 w-4" />
          <span className="text-sm font-medium">Módulo completado</span>
        </div>
        
        {/* Success Message with Transaction Link */}
        {showSuccess && completionHash && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-800 font-medium mb-1">
              <CheckCircle2 className="w-4 h-4" />
              ¡Badge de Módulo Obtenido!
            </div>
            <a 
              href={`https://alfajores.celoscan.io/tx/${completionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-green-600 hover:text-green-800"
            >
              Ver Transacción <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
        
        {completionHash && !showSuccess && (
          <a 
            href={`https://alfajores.celoscan.io/tx/${completionHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
          >
            Ver Badge en Blockchain <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    );
  }

  // Error state
  if (completionError) {
    return (
      <div className="space-y-2">
        <Button onClick={handleComplete} className="w-full md:w-auto" variant="destructive">
          Reintentar Completar
        </Button>
        <p className="text-xs text-red-600">
          {completionError.message || "Error al completar el módulo"}
        </p>
      </div>
    );
  }

  // Not enrolled gate
  if (!enrolled) {
    return (
      <div className="space-y-2">
        <Button disabled className="w-full md:w-auto" variant="outline">
          <LockIcon />
          Inscríbete para desbloquear
        </Button>
        <p className="text-xs text-muted-foreground">Debes inscribirte en el curso para completar este módulo.</p>
      </div>
    );
  }

  // Not connected
  if (!walletAddress) {
    return (
      <Button onClick={login} className="w-full md:w-auto" variant="outline">
        <Wallet className="w-4 h-4 mr-2" />
        Conectar para Completar
      </Button>
    );
  }

  // Completing
  if (isCompleting) {
    return (
      <Button disabled className="w-full md:w-auto">
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Firmando transacción...
      </Button>
    );
  }

  // Ready to complete
  return (
    <Button onClick={handleComplete} className="w-full md:w-auto">
      Completar Módulo
    </Button>
  );
}
