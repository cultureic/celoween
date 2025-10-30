'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Wallet, Shield, BookOpen, Sparkles } from 'lucide-react';
import Link from 'next/link';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading, login } = useAuth();
  
  const redirect = searchParams.get('redirect') || '/';
  const error = searchParams.get('error');

  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirect as any);
    }
  }, [isAuthenticated, router, redirect]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-celo-yellow/20 to-blue-100/20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-celo-yellow border-t-transparent rounded-full animate-spin" />
          <p className="text-celo-black dark:text-celo-yellow">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-celo-yellow/20 to-blue-100/20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 text-green-500">
            <Shield className="w-full h-full" />
          </div>
          <p className="text-celo-black dark:text-celo-yellow">Redirigiendo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Hero */}
      <div className="lg:flex-1 bg-gradient-to-br from-celo-yellow via-yellow-400 to-amber-300 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-black rounded-full blur-xl" />
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-white rounded-full blur-2xl" />
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-black rounded-full blur-lg" />
        </div>
        
        <div className="relative z-10 flex flex-col justify-center h-full p-8 lg:p-12 xl:p-16">
          <div className="max-w-lg">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-10 h-10 text-black" />
              <h1 className="text-2xl lg:text-3xl font-bold text-black">
                Celo Academy
              </h1>
            </div>
            
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-black mb-4 leading-tight">
              Aprende y construye en Celo
            </h2>
            
            <p className="text-lg text-black/80 mb-8">
              Accede a cursos exclusivos, recursos de desarrollo y conecta con la comunidad 
              de builders más activa del ecosistema Celo.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-3 text-black">
                <Sparkles className="w-5 h-5" />
                <span className="font-medium">Contenido exclusivo</span>
              </div>
              <div className="flex items-center gap-3 text-black">
                <Shield className="w-5 h-5" />
                <span className="font-medium">Acceso seguro</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="lg:flex-1 flex items-center justify-center p-8 lg:p-12 xl:p-16 bg-white dark:bg-gray-900">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Iniciar Sesión
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Conecta tu wallet para acceder al dashboard
            </p>
            {error === 'admin_required' && (
              <div className="mt-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-200">
                Acceso restringido: solo administradores pueden entrar al panel de administración.
              </div>
            )}
          </div>

          {/* Login Button */}
          <button
            onClick={login}
            className="w-full group relative overflow-hidden flex items-center justify-center gap-3 px-6 py-4 bg-celo-yellow hover:bg-yellow-400 text-black rounded-2xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Wallet className="w-6 h-6" />
            <span>Conectar con Privy</span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-300/0 via-white/20 to-yellow-300/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
          </button>

          <div className="mt-6 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">
                  ¿Necesitas ayuda?
                </span>
              </div>
            </div>
            
            <div className="mt-6 flex flex-col sm:flex-row gap-4 text-sm">
              <Link 
                href="/academy" 
                className="text-celo-yellow hover:text-yellow-600 transition-colors"
              >
                Ver cursos públicos
              </Link>
              <Link 
                href="/" 
                className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Volver al inicio
              </Link>
            </div>
          </div>

          {/* Features List */}
          <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
              Con tu cuenta podrás:
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-celo-yellow rounded-full" />
                Guardar tu progreso en los cursos
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-celo-yellow rounded-full" />
                Obtener certificados NFT
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-celo-yellow rounded-full" />
                Acceder a contenido exclusivo
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-celo-yellow rounded-full" />
                Participar en la comunidad
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-celo-yellow border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}