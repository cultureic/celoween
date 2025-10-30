import Section from '@/components/Section';
import RampLauncher from '@/components/RampLauncher';

export default function RampsPage() {
  return (
    <div className="space-y-16 pb-24">
      <Section title="Ramps" subtitle="Fiat ↔ cripto con Transak">
        <div className="max-w-xl">
          <p className="mb-6 text-sm opacity-80">
            Explicación de cómo comprar/vender CELO y stablecoins usando proveedores de rampa. Las claves se leen del entorno.
          </p>
          <RampLauncher />
        </div>
      </Section>
    </div>
  );
}



