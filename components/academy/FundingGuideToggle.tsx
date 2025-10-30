"use client";

import { ToggleContent } from "@/components/ui/toggle-content";

const fundingContent = `## Financia tu Proyecto

Descubre oportunidades de financiamiento en el ecosistema Celo.

El ecosistema Celo ofrece una variedad de mecanismos de financiamiento, con un fuerte enfoque en el financiamiento retroactivo, recompensando contribuciones impactantes después de que se hayan realizado. También hay disponibles grants y modelos de ingresos sostenibles para apoyar proyectos en diferentes etapas.

Explora estas oportunidades para maximizar tu potencial de financiamiento.

## Construye tu Reputación On-Chain

Establecer una reputación on-chain sólida aumenta tus posibilidades de asegurar financiamiento retroactivo.

Aquí te explicamos cómo puedes comenzar:

**Crea un perfil de proyecto en Karma GAP:** Construye credibilidad mostrando tus contribuciones y actividad.

**Aplica para recompensas mensuales con Proof of Ship:** Demuestra progreso consistente para obtener recompensas retroactivas automatizadas.

## Aplica para Oportunidades de Grants

Hay varias oportunidades de grants para desarrolladores en el ecosistema Celo, con financiamiento disponible en diferentes etapas de tu proyecto. Para maximizar tus posibilidades de recibir recompensas, incluye tu perfil de proyecto de Karma GAP al aplicar.

- **Prezenti Grants**
- **Celo Support Streams:** Envía tu aplicación de Support Stream y gana presupuestos de incentivos CELO quincenales
- **CPG Retroactive Funding**

## Oportunidades de Financiamiento Lideradas por el Ecosistema

Expande tus fuentes de financiamiento con iniciativas de socios del ecosistema.

- **Proof of Impact:** Automatiza divisiones de ingresos de tarifas de gas para financiar tu app
- **Builder Rewards - Celo PG x Talent Protocol - 10,000 CELO/mes**
- **Commons Builder Income:** Aplica para CBI y gana recompensas diarias
- **GoodBuilders Program:** Una iniciativa de un año que ofrece $220k en recompensas por construir con G$
- **Glo Dollar Liquidity Flywheel:** Alrededor de $40,000 serán donados a Celo Public Goods, gracias a una tenencia de $1M de Glo Dollar (USDGLO) de Mento. Los proyectos que aumenten la liquidez de Glo Dollar recibirán más financiamiento

## Aceleradores/Incubadoras

- **Celo Camp:** El acelerador insignia del ecosistema que ayuda a elevar proyectos al siguiente nivel
- **Celo Africa DAO Incubator:** Apoya proyectos preparándolos para uso y adopción

## Fondos

- **Verda Ventures:** ¿Construyendo para MiniPay y recaudando fondos? Contacta a team@verda.ventures con un pitch deck y demo del producto

Si quieres agregar otro programa de financiamiento liderado por el ecosistema, edita esta página para incluirlo.

## Mantente Actualizado sobre Financiamiento

Mantente al día con las últimas oportunidades de financiamiento uniéndote a nuestro boletín informativo.`;

interface FundingGuideToggleProps {
  className?: string;
}

export function FundingGuideToggle({ className = "" }: FundingGuideToggleProps) {
  return (
    <ToggleContent
      title="📋 Guía Completa de Financiamiento en Celo"
      content={fundingContent}
      defaultOpen={false}
      className={className}
    />
  );
}
