"use client";

import { useState, useEffect } from "react";
import { Heart, Share2, Check, Clock, Award, Smartphone, Wallet, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Course } from "@/components/academy/types";
import { useAuth } from "@/hooks/useAuth";

interface EnrollmentState {
  hasBadge: boolean;
  hasClaimed: boolean;
  isLoading: boolean;
  isEnrolling: boolean;
  isConfirmingEnrollment: boolean;
  enrollmentSuccess: boolean;
  enrollmentError: Error | null;
  enrollmentHash?: string;
  isWalletConnected: boolean;
}

interface EnrollPanelProps {
  course: Course;
  onEnroll: (course: Course) => void;
  enrollmentState?: EnrollmentState;
}

export function EnrollPanel({ course, onEnroll, enrollmentState }: EnrollPanelProps) {
  const { login } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Show success message when enrollment is successful
  useEffect(() => {
    if (enrollmentState?.enrollmentSuccess) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [enrollmentState?.enrollmentSuccess]);

  const handleEnroll = () => {
    // If wallet is not connected, trigger login instead
    if (enrollmentState && !enrollmentState.isWalletConnected) {
      login();
      return;
    }
    onEnroll(course);
  };

  const getEnrollButtonContent = () => {
    if (!enrollmentState) {
      return course.isFree ? 'Inscribirse Gratis' : 'Inscribirse Ahora';
    }

    const { 
      hasBadge, 
      isLoading, 
      isEnrolling, 
      isConfirmingEnrollment, 
      enrollmentSuccess,
      isWalletConnected 
    } = enrollmentState;

    if (isLoading) {
      return (
        <>
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
          Verificando...
        </>
      );
    }

    if (hasBadge || enrollmentSuccess) {
      return (
        <>
          <Check className="w-4 h-4 mr-2" />
          Ya Inscrito
        </>
      );
    }

    if (isEnrolling) {
      return (
        <>
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
          Firmando Transacción...
        </>
      );
    }

    if (isConfirmingEnrollment) {
      return (
        <>
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
          Confirmando en Blockchain...
        </>
      );
    }

    if (!isWalletConnected) {
      return (
        <>
          <Wallet className="w-4 h-4 mr-2" />
          Conectar Wallet
        </>
      );
    }

    return course.isFree ? 'Inscribirse Gratis' : 'Inscribirse Ahora';
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // You could add a toast notification here
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: course.title,
        text: course.subtitle,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    }
  };

  return (
    <div className="space-y-6">
      {/* Pricing and Enroll */}
      <Card className="sticky top-6">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              {course.isFree ? (
                <div className="text-3xl font-bold text-green-600">Gratis</div>
              ) : (
                <div className="text-3xl font-bold">${course.priceUSD}</div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleWishlist}
              className={`p-2 ${isWishlisted ? 'text-red-500' : 'text-muted-foreground'}`}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Success Message */}
          {showSuccess && enrollmentState?.enrollmentHash && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-800 font-medium mb-2">
                <Check className="w-4 h-4" />
                ¡Inscripción Exitosa!
              </div>
              <p className="text-sm text-green-700 mb-2">
                Has obtenido tu badge de inscripción en la blockchain.
              </p>
              <a 
                href={`https://celoscan.io/tx/${enrollmentState.enrollmentHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-green-600 hover:text-green-800"
              >
                Ver Transacción <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {/* Error Message */}
          {enrollmentState?.enrollmentError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-red-800 font-medium text-sm">
                Error en la inscripción: {enrollmentState.enrollmentError.message}
              </div>
            </div>
          )}

          <Button 
            onClick={handleEnroll}
            className="w-full text-lg py-6"
            size="lg"
            disabled={
              enrollmentState?.isEnrolling || 
              enrollmentState?.isConfirmingEnrollment || 
              enrollmentState?.hasBadge ||
              enrollmentState?.enrollmentSuccess
            }
            variant={
              enrollmentState?.hasBadge || enrollmentState?.enrollmentSuccess 
                ? "secondary" 
                : "default"
            }
          >
            {getEnrollButtonContent()}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleShare}
            className="w-full flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Compartir Curso
          </Button>
        </CardContent>
      </Card>

      {/* What's Included */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lo que está incluido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-green-100 text-green-600 rounded-full">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <div className="font-medium">Aprendizaje a tu ritmo</div>
                <div className="text-sm text-muted-foreground">Aprende a tu propia velocidad</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="font-medium">Acceso de por vida</div>
                <div className="text-sm text-muted-foreground">Accede al material del curso para siempre</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-600 rounded-full">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <div className="font-medium">Certificado de finalización</div>
                <div className="text-sm text-muted-foreground">Obtén un certificado al terminar</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-orange-100 text-orange-600 rounded-full">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <div className="font-medium">Móvil y escritorio</div>
                <div className="text-sm text-muted-foreground">Aprende en cualquier dispositivo</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Stats */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Duración</span>
              <span className="font-medium">{course.durationHours} horas</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Lecciones</span>
              <span className="font-medium">{course.lessonsCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Nivel</span>
              <Badge variant="outline">{course.level}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Estudiantes</span>
              <span className="font-medium">{course.learners.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
