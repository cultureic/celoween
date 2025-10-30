'use client';
import dynamic from 'next/dynamic';
import Section from '@/components/Section';

// Dynamic imports with loading states
const HeroStrip = dynamic(() => import('@/components/HeroStrip'), { 
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded" />
});

const FeatureCard = dynamic(() => import('@/components/FeatureCard'), { 
  loading: () => <div className="h-32 bg-gray-100 animate-pulse rounded" />
});

const CeloPosters = dynamic(() => import('@/components/CeloPosters'), { 
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded" />
});

export default function HomePageClient() {
  return (
    <div className="space-y-16 sm:space-y-20 lg:space-y-24 pb-16 sm:pb-20 lg:pb-24">
      <HeroStrip />
      <Section title="Lo que hacemos" subtitle="Programas para builders y comunidad en México">
        <div className="grid gap-4 sm:gap-6 grid-cols-2 grid-rows-2">
          <FeatureCard title="Pagos & MiniApps" description="Construye experiencias móviles y pagos estables." icon="pm" />
          <FeatureCard title="Programas de Desarrollo" description="Cohorts, mentores y becas para acelerar tu dApp." icon="ok" />
          <FeatureCard title="Comunidad & Grants" description="Eventos, grants y apoyo para comunidades en LATAM." icon="knpo" />
          <FeatureCard title="Herramientas Open Source" description="Plantillas, SDKs y repos abiertos para builders." icon="ipkm" />
        </div>
      </Section>
      <Section title="Innovaciones de Celo como Layer 2">
        <CeloPosters />
      </Section>
    </div>
  );
}
