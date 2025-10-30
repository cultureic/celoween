import { Course } from "@/components/academy/types";
export const COURSE_LEVELS = ["Principiante","Intermedio","Avanzado"] as const;
export const COURSE_CATEGORIES = ["Reputación","Fundamentos","Celo","Desarrollo","Aplicaciones","Avanzado"] as const;

export function getCourseBySlug(slug: string) { 
  return COURSES.find(c => c.slug === slug); 
}

export const COURSES: Course[] = [
  // NIVEL 0
  {
    id: "nivel-0-reputacion",
    slug: "reputacion-on-chain-e-incentivos",
    title: "Reputación On-Chain y Programas de Incentivo",
    subtitle: "Construye tu reputación on-chain y accede a oportunidades de financiamiento retroactivo en el ecosistema Celo.",
    level: "Principiante",
    category: "Reputación",
    tags: ["Financiamiento","Reputación","Karma GAP","Proof of Ship","Grants"],
    durationHours: 8,
    lessonsCount: 40,
    rating: 4.8,
    ratingCount: 210,
    learners: 1800,
    coverUrl: "{{COVER_URL_REP}}",
    promoVideoUrl: "https://www.youtube.com/watch?v=QOCO1G8cJyI",
    instructor: {
      name: "Celo México",
      title: "Equipo Instructor",
      avatarUrl: "{{INSTRUCTOR_AVATAR_URL}}",
      bio: "Formación práctica para crear reputación verificable desde el inicio."
    },
    priceUSD: 0,
    isFree: true,
    prerequisites: ["Conocimientos básicos de wallets y direcciones"],
    outcomes: [
      "Construir reputación on-chain usando Karma GAP y Proof of Ship.",
      "Identificar y aplicar a oportunidades de financiamiento retroactivo.",
      "Desarrollar estrategias para maximizar el potencial de financiamiento en Celo."
    ],
    modules: [
      {
        index: 1,
        title: "Fundamentos de reputación on-chain",
        summary: "Construye tu reputación on-chain y descubre oportunidades de financiamiento en el ecosistema Celo.",
        submodules: [
          {
            index: 1,
            title: "Fundamentos de reputación on-chain y programas de incentivos",
            summary: "Construye tu reputación on-chain y descubre oportunidades de financiamiento en el ecosistema Celo.",
            content: `## Financia tu Proyecto

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

- **Prezenti Grants:** Apoyos desde $25,000 cUSD para projectos construyendo en Celo. 
- **Celo Support Streams:** Envía tu aplicación de Support Stream y gana presupuestos de incentivos CELO quincenales
- **CPG Retroactive Funding:** Financiamiento retroactivo para proyectos de CPG.

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

Mantente al día con las últimas oportunidades de financiamiento uniéndote a nuestro boletín informativo.`,
            items: []
          }
        ]
      },
      {
        index: 2,
        title: "Construye tu perfil de Karma GAP",
        summary: "Aprende a crear y configurar tu perfil de proyecto para participar en Proof of Ship.",
        submodules: [
          {
            index: 1,
            title: "Guía completa de Proof of Ship",
            summary: "Instrucciones paso a paso para enviar tu proyecto al programa Proof of Ship de Celo.",
            content: `## Celo - Proof of Ship

Instrucciones para enviar tu proyecto al programa Celo - Proof of Ship.

Proof-of-Ship es un concurso mensual que recompensa a los desarrolladores por construir activamente en Celo. Las métricas de impacto en tu perfil de proyecto de Karma GAP se utilizan para calcular automáticamente las recompensas de desarrolladores, que puedes reclamar cada mes aquí.

Antes de crear un perfil de proyecto, asegúrate de tener:

- Una wallet compatible con la red Celo, como Rabby, Rainbow, MetaMask

- Tokens CELO en tu wallet para pagar las tarifas de gas durante las transacciones onchain. Aprende más sobre las tarifas de gas aquí

Sigue los pasos a continuación para enviar tu proyecto al programa Proof of Ship.

## Paso 1: Agregar tu perfil de proyecto

Agrega tu proyecto al Programa Celo Proof of Ship en Karma GAP. Puedes seguir las instrucciones aquí. Este es tu perfil de proyecto onchain que creas una vez y puedes usarlo para aplicar a rondas futuras. También puedes dirigir a cualquiera para que aprenda sobre tu proyecto, recibir endosos y donaciones.

Si participaste en una temporada anterior, es posible que ya tengas un perfil de proyecto. Puedes saltar al Paso 2. Contacta a nuestro equipo si tienes problemas para acceder a tu perfil aquí: https://t.me/karmahq

El título de tu proyecto debería ser solo el nombre del proyecto. No debería incluir "Proof of Ship" porque este es un perfil que puedes usar en el futuro para otras oportunidades de financiamiento.

### Paso 1.1: Agregar tu información de contacto

En el flujo de creación de proyecto y el flujo de actualización de proyecto, puedes actualizar tu información de contacto. Asegúrate de agregar tu información de contacto. Así es como los organizadores te contactarán para futuras comunicaciones sobre actualizaciones importantes.

### Paso 1.2: Actualizar tu perfil público

Ve a Mi Perfil y actualiza tu perfil. Esta es información de perfil público que se almacena onchain. Puedes ir a tu perfil desde "Mi Perfil" haciendo clic en tu avatar en el encabezado como se muestra a continuación.

## Paso 2: Enviar tu proyecto para Proof of Ship

Para enviar tu proyecto para proof of ship, sigue los pasos a continuación:

Navega a la pestaña de grants en tu proyecto y haz clic en Add Funding y selecciona "Join Funding Program".

Selecciona Celo community del dropdown y elige el programa Proof of Ship al que estás aplicando. También selecciona las pistas en las que estás interesado en participar.

Para Start Date, elige la fecha de hoy (la fecha en que estás aplicando) y agrega una descripción opcional.

Agrega hitos explicando lo que planeas lograr. Puedes agregar tantos hitos como quieras.

Haz clic en create y se ejecutará una transacción onchain para enviar tu entrada al programa Proof of Ship.

### Paso 2.1: Actualizar pistas

Si ya has aplicado al programa y quieres editar las pistas, haz clic en edit y actualiza las pistas.

## Paso 3: Enviar tu repositorio de github, direcciones de contratos, dirección de pago y id de perfil divvi

Haz clic en configuración del proyecto y agrega tus repos de Github, direcciones de contratos e id de perfil divvi.

## Paso 4: Enviar actualizaciones de hitos

A medida que completes tu trabajo, envía hitos y márcalos como completados.

## Paso 5: Envío final del proyecto

Al final del mes, marca el grant como completo y envía un enlace a todos los assets ej: logo, capturas de pantalla, etc.:

Agrega un enlace a un Video explicando tu trabajo (máximo 4 min) y enlace a tu Presentación (no más de 10 slides) en el perfil del proyecto.`,
            items: []
          }
        ]
      },
      {
        index: 3,
        title: "Proof-of-Ship - Programa de Construcción",
        summary: "Construye en Celo, demuestra tu impacto y desbloquea recompensas mensuales.",
        submodules: [
          {
            index: 1,
            title: "Guía completa de Proof-of-Ship",
            summary: "Todo lo que necesitas saber sobre el programa mensual de construcción en Celo.",
            content: `## Proof-of-Ship ❇️

**¿Construyendo en Celo? Demuestra tu impacto, crece tu reputación on-chain y desbloquea financiamiento y recompensas. [REGÍSTRATE](https://celo-devs.beehiiv.com/subscribe) para el Proof-of-Ship de este mes!**

## ¿Qué es Proof-of-Ship?

**Proof-of-Ship es un programa mensual para que los desarrolladores crezcan su reputación on-chain y ganen recompensas en el ecosistema Celo.**

Cada mes, los desarrolladores demuestran su impacto, muestran progreso y ganan recompensas. Tu reputación on-chain desbloquea acceso a grants, financiamiento retroactivo, airdrops y otras oportunidades de financiamiento.

Comienza a crecer tu reputación on-chain. **Regístrate para Proof of Ship [AQUÍ.](https://celo-devs.beehiiv.com/subscribe)**

## ¿Por qué unirse?
- **Construye tu Reputación On-Chain:** La actividad de tu proyecto se convierte en una credencial pública on-chain utilizada para desbloquear grants, financiamiento retroactivo, airdrops y más en todo el ecosistema Celo.
- **Gana Recompensas Mensuales:** Cada mes, los Agentes de IA distribuyen un pool de premios de $5,000 a los participantes basado en métricas impulsadas por impacto.
- **Haz que Vean tu Proyecto:** Tu proyecto aparece en el Showcase Mensual de Desarrolladores y se comparte con socios del ecosistema Celo, financiadores y canales de marketing.

## Cómo funciona:

1. **Crea tu Proyecto en [KarmaGAP](https://gap.karmahq.xyz/community/celo?programId=886_42161).**
   - Sigue [esta guía paso a paso](https://docs.gap.karmahq.xyz/how-to-guides/integrations/celo-proof-of-ship) para configurar tu perfil de proyecto.
2. **Envía tus Métricas de Impacto.**
   - Actualiza tu perfil de proyecto en KarmaGAP con datos de impacto. *Los datos de impacto opcionales incluyen hitos del proyecto, direcciones de contratos, repositorio GitHub, handle de Farcaster, Pitch Deck, Video Demo.*
3. **Selecciona una Pista de Socio (Opcional).**
   - Si estás interesado en obtener recompensas extra, agrega la 'etiqueta' de pista de socio específica a tu perfil de proyecto.
     - Ejemplo: Agregar protocolo Divvi para hasta $5k pro-rata a proyectos generando transacciones. Ver más detalles en la sección de Pistas abajo.
4. **Gana Recompensas y Construye Reputación.**
   - Cada mes, los Agentes de IA distribuyen $5,000 cUSD a desarrolladores basado en datos de impacto.
   - Los proyectos que califican para pistas de socios obtienen recompensas extra.
5. **Desbloquea Oportunidades Futuras.**
   - Tu reputación on-chain te califica para grants, financiamiento retroactivo, airdrops y otros [programas del ecosistema](https://www.celopg.eco/).

## Fechas Importantes PoS #8

- **1 Sep hasta 29 Sep:** Configura tu perfil y envía tu proyecto.
- **1 Oct hasta 3 Oct:** Votación comunitaria.
- **03 Oct:** Showcase en Vivo de Desarrolladores presentando los 20 proyectos principales.
- **06 Oct:** Ganadores anunciados y recompensas CELO enviadas.

## Pistas - Proof of Ship #8

Agrega etiquetas a tu proyecto Proof of Ship para ser elegible para las pistas.

### Self - 5000 cUSD

**Pool de Premios:** 5,000 cUSD

**Desafío:** Integra Self Protocol para habilitar verificación de identidad que preserva la privacidad en tu dApp.

Self permite a los usuarios probar atributos clave de identidad (como edad, nacionalidad o unicidad) sin revelar datos personales. Construye con Self para mejorar la confianza, seguridad o cumplimiento en tu aplicación.

**Estructura de Incentivos:**

- **$250 por integración**
- Si más de 20 proyectos aplican, las 20 implementaciones principales serán seleccionadas basado en calidad de integración, relevancia y funcionalidad.

**Requisitos:**

- **Necesita funcionar en mainnet:** (si estás usando mockpassport, prueba si funciona con tu mock passport en testnet, pero habilítalo en mainnet)

**Recursos:**

- [Docs](https://docs.self.xyz/)
- [Website](https://self.xyz/)
- [Quickstart](https://docs.self.xyz/use-self/quickstart)

### Thirdweb - $5000 en créditos thirdweb

- Cada proyecto que se registre para Proof of Ship #8 recibirá dos meses de acceso gratuito a un plan starter con thirdweb. Solo ingresa el código CELO-STARTER-2M
- Los proyectos que puedan mostrar transacciones y conteos de usuarios obtendrán acceso a un plan de crecimiento con thirdweb para Septiembre. Contacta a GigaHierz si eres elegible e interesado.
- Los 5 proyectos principales recibirán 6 meses de acceso gratuito al plan de crecimiento thirdweb
- **Recursos:**
  - [Payments API](https://portal.thirdweb.com/payments)
  - [Workshop](https://www.youtube.com/watch?v=o9IqVLTOkwg&t=58s)

### Good Dollar - $45000

- Aplica al [Programa de Desarrolladores de @GoodDollar](https://www.notion.so/Proof-of-Ship-17cd5cb803de8060ba10d22a72b549f8?pvs=21) - ¡ronda 2 el mes pasado! $45000 se está distribuyendo a proyectos integrando SDKs de G$ o el token G$.
  - Los votos se aceleran cada mes = streams del mes pasado x3.
  - Más tiempo = más votos → Aplica ASAP
  - Más votos = más financiamiento 🏆
  - Página del programa Good Builders: [https://www.notion.so/gooddollar/GoodBuilders-Program-Round-2-goes-streaming-200f258232f0802b960ad1dab7ad5fd2?source=copy_link](https://www.notion.so/200f258232f0802b960ad1dab7ad5fd2?pvs=21)
- **Verifica el estado del programa:**
  - [Flow State con proyectos en curso](https://flowstate.network/gooddollar)
  - Únete o vuelve a ver DEMO DAYS para ver cómo van los proyectos en curso:
    - [ver canal de Youtube](https://ubi.gd/Youtubechannel)
    - [ver el calendario del programa](https://luma.com/GoodBuildersCalendar?k=c)
  - Para preguntas y feedback antes de aplicar o durante el programa = Únete a las [horas de oficina los martes](https://luma.com/GoodBuildersCalendar?k=c)
- **Recursos:**
  - [Programa de Desarrolladores](http://ubi.gd/GoodBuilders)
  - [Reclama SDKs gratuitos de G$](https://docs.gooddollar.org/for-developers/apis-and-sdks/ubi)
  - [SDKs de Identidad](https://docs.gooddollar.org/for-developers/apis-and-sdks/sybil-resistance)
  - [Integraciones del Token G$](https://docs.gooddollar.org/for-developers/gooddapp-developer-guides/how-to-integrate-the-gusd-token)
  - [streaming](https://docs.gooddollar.org/for-developers/gooddapp-developer-guides/use-gusd-streaming)

- **Pista bonus:**

  Si planeas integrar el G$ Identity SDK en tu app, explora la [plataforma Engagement Rewards](https://engagement-rewards.vercel.app/?utm_source=chatgpt.com). Te permite recompensar e incentivar el onboarding de usuarios G$ en lista blanca.

### MiniApp

**Recursos**:

- [Farcaster MiniApp Docs](https://miniapps.farcaster.xyz/)
- [Construye una MiniApp Viral](https://docs.neynar.com/docs/mini-app-virality-guide)
- [Configura tu Farcaster MiniApp con Celo MCP](https://www.youtube.com/watch?v=Wt7TMbH4RUQ&t=753s)
- [Template Celo Farcaster](https://github.com/builders-garden/farcaster-miniapp-starter-celo)

## ¿Quién puede participar?

Cualquiera que contribuya a **cualquier proyecto en Celo** puede unirse a Proof-of-Ship y obtener recompensas. Ya sea que estés construyendo algo nuevo o mejorando un proyecto existente, **¡eres elegible para participar!**

- **Proyectos Existentes de Celo:** ¡Sigue construyendo! Muestra que sigues creciendo tu proyecto y obtén recompensas.
- **Proyectos Nuevos:** Construye en Celo (testnet Alfajores está bien) y demuestra que estás desarrollando activamente tu proyecto.
- **Herramientas e Infraestructura:** Apoya a los desarrolladores de Celo con nuevas herramientas, frameworks o actualizaciones de infraestructura.
- **Contribuidores Individuales:** Contribuye a tu propio proyecto o cualquier proyecto open-source de Celo y muestra tu impacto. ¿Buscando un proyecto? Preséntate en nuestro [grupo de Telegram.](https://t.me/proofofship)

## Ideas

Aunque cualquier proyecto en Celo es elegible, altamente alentamos proyectos que encajen en las siguientes pistas:

- **MiniApps MiniPay:** construye una mini app móvil en Minipay que resuelva un desafío local y práctico. [Ver quickstart aquí.](https://docs.celo.org/developer/build-on-minipay/overview)
- **MiniApps Farcaster:** construye una mini app móvil en Minipay que resuelva un desafío local y práctico.
  - [Workshop](https://www.youtube.com/watch?v=bwTrGAfZhSQ)
  - [MiniApp docs](https://miniapps.farcaster.xyz/)
  - [Guía sobre cómo construir una MiniApp viral en Farcaster](https://paragraph.com/@builders-garden/viral-farcaster-mini-apps)
  - [Starterkit](https://github.com/builders-garden/farcaster-miniapp-starter-celo)
- **Apps e Agentes Impulsados por IA:** construye Agentes de IA que interactúen con smart contracts en Celo. [Ver tutoriales aquí.](https://docs.celo.org/developer/build-with-ai/overview)
- **DeFi y Pagos con Stablecoins:** usa stablecoins de Mento (cUSD, cEUR, cCOP) en tu app.
- **Infra y Herramientas de Dev:** Mejora herramientas de desarrollador (como [Celo Composer](https://github.com/celo-org/celo-composer) o [Composer Kit](https://github.com/celo-org/composer-kit)) o crea proyectos y tutoriales que aprovechen herramientas de desarrollador existentes (como [Thirdweb](https://thirdweb.com/celo))

## Reglas

1. Proof of Ship es un concurso mensual que comienza el primer día del mes y termina el último día. La evaluación ocurre en la última semana del mes, así que asegúrate de enviar a tiempo y revisa el horario y tu email para todas las actualizaciones.
2. Este es un concurso virtual; puedes participar desde cualquier lugar.
3. Puedes enviar tantas veces como quieras. Sin embargo, tu último envío será considerado el envío final.
4. Se espera que tengas ideas nuevas e innovadoras o desarrolles componentes nuevos e innovadores para un proyecto tuyo. Si no vemos actualizaciones significativas a tu codebase, tu envío no será elegible.
5. ¡Los proyectos deben ser open source! Por favor asegúrate de que tu código fuente sea público para que podamos revisar tu envío.
6. Tu código es la propiedad intelectual de tu equipo.

Al participar en el hackathon, aceptas el [acuerdo de participación](https://docs.google.com/document/d/1ZetS2ATLF8NuaKDhoQ65WCskrXt89lia4WcFSfoGoec/edit?usp=sharing) de la Fundación Celo.

## Términos y Condiciones

1. Cometeré frecuentemente a GitHub para que los jueces vean mi progreso
2. Haré open-source mi envío

¿Alguna pregunta? ¡Contacta en [Telegram!](http://t.me/proofofship) y síguenos en [X](https://x.com/CeloDevs)`,
            items: []
          }
        ]
      }
    ],
    createdAt: "2025-08-01T00:00:00Z"
  },

  // NIVEL 1
  {
    id: "nivel-1-fundamentos",
    slug: "fundamentos-web3-y-blockchain",
    title: "Fundamentos de Web3 y Blockchain",
    subtitle: "Evolución de la Web y Blockchain y su relevancia para construir una web descentralizada.",
    level: "Principiante",
    category: "Fundamentos",
    tags: ["Web3","Blockchain","Criptografía","EVM"],
    durationHours: 9,
    lessonsCount: 36,
    rating: 4.7,
    ratingCount: 185,
    learners: 1500,
    coverUrl: "{{COVER_URL_FUND}}",
    promoVideoUrl: "{{PROMO_URL_FUND}}",
    instructor: {
      name: "Celo México",
      title: "Equipo Instructor",
      avatarUrl: "{{INSTRUCTOR_AVATAR_URL}}",
      bio: "Fundamentos claros para acelerar tu curva de aprendizaje."
    },
    priceUSD: 0,
    isFree: true,
    prerequisites: ["Nociones de programación (JS/TS) deseable"],
    outcomes: [
      "Diferenciar arquitectura Web2 vs Web3.",
      "Comprender cuentas, firmas y gas en EVM.",
      "Conocer modelos básicos de seguridad."
    ],
    modules: [
      {
        index: 1,
        title: "De Web2 a Web3",
        summary: "Historia, cambios de arquitectura y nuevos modelos.",
        submodules: [
          {
            index: 1,
            title: "Evolución de la Web",
            summary: "Modelos cliente-servidor vs descentralizados.",
            items: [
              { type: "video", title: "Web1 → Web2 → Web3", durationMin: 12, resourceUrl: "https://www.youtube.com/watch?v=QOCO1G8cJyI" },
              { type: "reading", title: "Comparativa de arquitecturas", downloadablePlaceholder: "{{PDF_URL_N1_M1_S1_2}}" },
              { type: "quiz", title: "Conceptos clave de arquitectura" }
            ]
          },
          {
            index: 2,
            title: "Criptografía y consenso",
            summary: "Hashes, firmas y redes de consenso.",
            items: [
              { type: "reading", title: "Hashes, firmas y ECDSA", downloadablePlaceholder: "{{PDF_URL_N1_M1_S2_1}}" },
              { type: "lab", title: "Firma y verificación local", notes: "Script en {{GITHUB_REPO_N1_M1_S2_2}}" },
              { type: "discussion", title: "Trade-offs de consenso", notes: "Comparativa breve." }
            ]
          }
        ]
      },
      {
        index: 2,
        title: "Modelo EVM",
        summary: "Cuentas, gas, transacciones y logs.",
        submodules: [
          {
            index: 1,
            title: "Cuentas y gas",
            summary: "EOA vs contratos, gas y estimación.",
            items: [
              { type: "video", title: "Cuentas y costos", durationMin: 10, resourceUrl: "https://www.youtube.com/watch?v=QOCO1G8cJyI" },
              { type: "lab", title: "Simula una tx y estima gas", notes: "Usa un RPC público." },
              { type: "reading", title: "Logs y eventos", downloadablePlaceholder: "{{PDF_URL_N1_M2_S1_3}}" }
            ]
          },
          {
            index: 2,
            title: "Seguridad básica",
            summary: "Amenazas y prácticas mínimas.",
            items: [
              { type: "reading", title: "Checklist de seguridad", downloadablePlaceholder: "{{PDF_URL_N1_M2_S2_1}}" },
              { type: "assignment", title: "Modelo de amenazas de tu dApp", downloadablePlaceholder: "{{DOC_URL_N1_M2_S2_2}}" },
              { type: "quiz", title: "Repaso de seguridad" }
            ]
          }
        ]
      },
      {
        index: 3,
        title: "Herramientas del desarrollador",
        summary: "Stack local y flujo de trabajo moderno.",
        submodules: [
          {
            index: 1,
            title: "Entorno",
            summary: "Node, paquetes y linters.",
            items: [
              { type: "reading", title: "Guía de entorno", downloadablePlaceholder: "{{PDF_URL_N1_M3_S1_1}}" },
              { type: "lab", title: "Setup de proyecto base", notes: "Usa plantillas del repo." },
              { type: "quiz", title: "Verificación de entorno" }
            ]
          },
          {
            index: 2,
            title: "Buenas prácticas",
            summary: "Convenciones y testing básico.",
            items: [
              { type: "video", title: "Convenciones y testing", durationMin: 9, resourceUrlPlaceholder: "{{VIDEO_URL_N1_M3_S2_1}}" },
              { type: "assignment", title: "Pruebas mínimas de un contrato", downloadablePlaceholder: "{{DOC_URL_N1_M3_S2_2}}" },
              { type: "discussion", title: "Criterios de calidad", notes: "Foro." }
            ]
          }
        ]
      }
    ],
    createdAt: "2025-08-02T00:00:00Z"
  },

  // NIVEL 2
  {
    id: "nivel-2-intro-celo",
    slug: "introduccion-a-celo",
    title: "Introducción a Celo",
    subtitle: "Conoce el ecosistema de Celo, sus stablecoins, su infraestructura y cómo empezar a construir en su red.",
    level: "Principiante",
    category: "Celo",
    tags: ["Celo","Stablecoins","Ecosistema"],
    durationHours: 8,
    lessonsCount: 30,
    rating: 4.8,
    ratingCount: 190,
    learners: 1700,
    coverUrl: "{{COVER_URL_INTRO}}",
    promoVideoUrl: "{{PROMO_URL_INTRO}}",
    instructor: {
      name: "Celo México",
      title: "Equipo Instructor",
      avatarUrl: "{{INSTRUCTOR_AVATAR_URL}}",
      bio: "Puerta de entrada a construir en Celo."
    },
    priceUSD: 0,
    isFree: true,
    prerequisites: ["Fundamentos de Web3 y Blockchain"],
    outcomes: [
      "Entender Celo como L2 (arquitectura y propuesta de valor).",
      "Configurar RPCs y herramientas clave.",
      "Realizar tu primer despliegue a testnet."
    ],
    modules: [
      {
        index: 1,
        title: "Panorama de Celo L2",
        summary: "Arquitectura, DA y relación con Ethereum.",
        submodules: [
          {
            index: 1,
            title: "Arquitectura y redes",
            summary: "Redes, RPCs y endpoints.",
            items: [
              { type: "video", title: "Celo como L2", durationMin: 9, resourceUrlPlaceholder: "{{VIDEO_URL_N2_M1_S1_1}}" },
              { type: "reading", title: "Guía de RPCs", downloadablePlaceholder: "{{PDF_URL_N2_M1_S1_2}}" },
              { type: "quiz", title: "Arquitectura básica de Celo" }
            ]
          },
          {
            index: 2,
            title: "Ecosistema y casos",
            summary: "Stablecoins, wallets y adopción.",
            items: [
              { type: "reading", title: "Stablecoins en Celo", downloadablePlaceholder: "{{PDF_URL_N2_M1_S2_1}}" },
              { type: "discussion", title: "Casos de uso en LATAM", notes: "Hilo guiado." },
              { type: "lab", title: "Explora dApps del ecosistema", notes: "Checklist mínimo." }
            ]
          }
        ]
      },
      {
        index: 2,
        title: "Tu primer despliegue",
        summary: "Scaffold, contrato simple y verificación.",
        submodules: [
          {
            index: 1,
            title: "Scaffold y contrato",
            summary: "Plantilla y Hola Mundo.",
            items: [
              { type: "lab", title: "Crea el proyecto base", notes: "Usa plantilla {{GITHUB_REPO_N2_M2_S1_1}}." },
              { type: "assignment", title: "Contrato Hola Mundo", downloadablePlaceholder: "{{DOC_URL_N2_M2_S1_2}}" },
              { type: "quiz", title: "Conceptos de despliegue" }
            ]
          },
          {
            index: 2,
            title: "Verificación y lectura",
            summary: "Lee estado y eventos.",
            items: [
              { type: "video", title: "Lecturas on-chain", durationMin: 8, resourceUrlPlaceholder: "{{VIDEO_URL_N2_M2_S2_1}}" },
              { type: "lab", title: "Lectura desde frontend", notes: "Componente listo." },
              { type: "reading", title: "Eventos y logs", downloadablePlaceholder: "{{PDF_URL_N2_M2_S2_3}}" }
            ]
          }
        ]
      },
      {
        index: 3,
        title: "Wallets y pagos",
        summary: "Integración inspirada en MiniPay/Valora (mock).",
        submodules: [
          {
            index: 1,
            title: "Flujos de pago",
            summary: "UX móvil y recibos.",
            items: [
              { type: "video", title: "Patrones de pago", durationMin: 9, resourceUrlPlaceholder: "{{VIDEO_URL_N2_M3_S1_1}}" },
              { type: "lab", title: "Botón 'Pagar con stablecoin' (mock)", notes: "Genera hash de confirmación." },
              { type: "assignment", title: "Recibo on-chain", downloadablePlaceholder: "{{DOC_URL_N2_M3_S1_3}}" }
            ]
          },
          {
            index: 2,
            title: "Deep links y UX",
            summary: "Diseño centrado en móvil.",
            items: [
              { type: "reading", title: "Buenas prácticas de UX", downloadablePlaceholder: "{{PDF_URL_N2_M3_S2_1}}" },
              { type: "discussion", title: "Casos con fricción baja", notes: "Foro." },
              { type: "quiz", title: "Repaso de UX/móvil" }
            ]
          }
        ]
      }
    ],
    createdAt: "2025-08-03T00:00:00Z"
  },

  // NIVEL 3
  {
    id: "nivel-3-desarrollo",
    slug: "desarrollo-en-celo",
    title: "Desarrollo en Celo",
    subtitle: "Servidores MCP, tooling y flujo de desarrollo para crear dApps sobre Celo.",
    level: "Intermedio",
    category: "Desarrollo",
    tags: ["MCP","Composer","SDK","Tooling"],
    durationHours: 10,
    lessonsCount: 36,
    rating: 4.8,
    ratingCount: 160,
    learners: 1200,
    coverUrl: "{{COVER_URL_DEV}}",
    promoVideoUrl: "{{PROMO_URL_DEV}}",
    instructor: {
      name: "Celo México",
      title: "Equipo Instructor",
      avatarUrl: "{{INSTRUCTOR_AVATAR_URL}}",
      bio: "Del scaffold a la dApp funcional con buenas prácticas."
    },
    priceUSD: 0,
    isFree: true,
    prerequisites: ["Introducción a Celo","React/TypeScript"],
    outcomes: [
      "Levantar y usar servidores MCP.",
      "Trabajar con Composer/SDK para lectura/escritura on-chain.",
      "Aplicar testing y verificación básica."
    ],
    modules: [
      {
        index: 1,
        title: "Entorno y MCP",
        summary: "Instalación, configuración y flujo con MCP.",
        submodules: [
          {
            index: 1,
            title: "Setup MCP",
            summary: "Integración en el proyecto.",
            items: [
              { type: "video", title: "¿Qué es MCP?", durationMin: 8, resourceUrlPlaceholder: "{{VIDEO_URL_N3_M1_S1_1}}" },
              { type: "lab", title: "Levanta un servidor MCP local", notes: "Guía en {{GITHUB_REPO_N3_M1_S1_2}}" },
              { type: "reading", title: "Comandos útiles", downloadablePlaceholder: "{{PDF_URL_N3_M1_S1_3}}" }
            ]
          },
          {
            index: 2,
            title: "Integración",
            summary: "MCP + componentes del proyecto.",
            items: [
              { type: "assignment", title: "Conecta MCP a tu scaffold", downloadablePlaceholder: "{{DOC_URL_N3_M1_S2_1}}" },
              { type: "discussion", title: "Casos de uso", notes: "Foro con ejemplos." },
              { type: "quiz", title: "Repaso MCP" }
            ]
          }
        ]
      },
      {
        index: 2,
        title: "Composer y SDK",
        summary: "UI, hooks y llamadas on-chain.",
        submodules: [
          {
            index: 1,
            title: "Componentes UI",
            summary: "Connect, Balance, Send.",
            items: [
              { type: "video", title: "UI Kit de Composer", durationMin: 9, resourceUrlPlaceholder: "{{VIDEO_URL_N3_M2_S1_1}}" },
              { type: "lab", title: "Arma un flujo de envío", notes: "Mock de tx + toast." },
              { type: "reading", title: "Hooks/SDK", downloadablePlaceholder: "{{PDF_URL_N3_M2_S1_3}}" }
            ]
          },
          {
            index: 2,
            title: "Lectura y escritura",
            summary: "Patrones de llamadas.",
            items: [
              { type: "assignment", title: "Lectura de un contrato", downloadablePlaceholder: "{{DOC_URL_N3_M2_S2_1}}" },
              { type: "lab", title: "Escritura con confirmación", notes: "Maneja estados." },
              { type: "quiz", title: "Errores comunes" }
            ]
          }
        ]
      },
      {
        index: 3,
        title: "Testing y observabilidad",
        summary: "Pruebas, logs y monitoreo básico.",
        submodules: [
          {
            index: 1,
            title: "Testing",
            summary: "Unidades y e2e mínimos.",
            items: [
              { type: "reading", title: "Guía de testing", downloadablePlaceholder: "{{PDF_URL_N3_M3_S1_1}}" },
              { type: "lab", title: "Pruebas de contrato y UI", notes: "Scripts base." },
              { type: "quiz", title: "Cobertura mínima" }
            ]
          },
          {
            index: 2,
            title: "Observabilidad",
            summary: "Logs, métricas y alertas.",
            items: [
              { type: "video", title: "Panel de métricas", durationMin: 8, resourceUrlPlaceholder: "{{VIDEO_URL_N3_M3_S2_1}}" },
              { type: "assignment", title: "Tablero simple de KPIs", downloadablePlaceholder: "{{SHEET_URL_N3_M3_S2_2}}" },
              { type: "discussion", title: "Alertas útiles", notes: "Foro." }
            ]
          }
        ]
      }
    ],
    createdAt: "2025-08-04T00:00:00Z"
  },

  // NIVEL 4
  {
    id: "nivel-4-aplicaciones-reales",
    slug: "crea-aplicaciones-reales",
    title: "Crea Aplicaciones Reales",
    subtitle: "Construye dApps completas con plantillas y ejemplos para Latinoamérica, con enfoque en impacto.",
    level: "Intermedio",
    category: "Aplicaciones",
    tags: ["dApps","Plantillas","Impacto","LatAm"],
    durationHours: 12,
    lessonsCount: 38,
    rating: 4.9,
    ratingCount: 150,
    learners: 1100,
    coverUrl: "{{COVER_URL_APPS}}",
    promoVideoUrl: "{{PROMO_URL_APPS}}",
    instructor: {
      name: "Celo México",
      title: "Equipo Instructor",
      avatarUrl: "{{INSTRUCTOR_AVATAR_URL}}",
      bio: "Casos prácticos con métricas y entregables reales."
    },
    priceUSD: 0,
    isFree: true,
    prerequisites: ["Desarrollo en Celo"],
    outcomes: [
      "Seleccionar un caso aplicable (remesas, marketplace, educación).",
      "Desplegar un MVP en testnet con métricas básicas.",
      "Preparar un piloto con usuarios."
    ],
    modules: [
      {
        index: 1,
        title: "Diseño del caso y KPIs",
        summary: "De hipótesis a indicadores accionables.",
        submodules: [
          {
            index: 1,
            title: "Selección del caso",
            summary: "Remesas, marketplace o educación.",
            items: [
              { type: "video", title: "Criterios de selección", durationMin: 9, resourceUrlPlaceholder: "{{VIDEO_URL_N4_M1_S1_1}}" },
              { type: "assignment", title: "Matriz de decisión", downloadablePlaceholder: "{{SHEET_URL_N4_M1_S1_2}}" },
              { type: "discussion", title: "Riesgos y alcance", notes: "Foro." }
            ]
          },
          {
            index: 2,
            title: "KPIs y telemetría",
            summary: "Métricas mínimas para un MVP.",
            items: [
              { type: "reading", title: "Guía de KPIs", downloadablePlaceholder: "{{PDF_URL_N4_M1_S2_1}}" },
              { type: "lab", title: "Eventos y logs de uso", notes: "Implementa dos métricas." },
              { type: "quiz", title: "Repaso de KPIs" }
            ]
          }
        ]
      },
      {
        index: 2,
        title: "Implementación del MVP",
        summary: "Arquitectura, contratos y front.",
        submodules: [
          {
            index: 1,
            title: "Arquitectura mínima",
            summary: "Contratos + UI + pagos.",
            items: [
              { type: "lab", title: "Plantilla de contrato base", notes: "Clona {{GITHUB_REPO_N4_M2_S1_1}}." },
              { type: "assignment", title: "Endpoints y esquema", downloadablePlaceholder: "{{DOC_URL_N4_M2_S1_2}}" },
              { type: "reading", title: "Checklist de seguridad", downloadablePlaceholder: "{{PDF_URL_N4_M2_S1_3}}" }
            ]
          },
          {
            index: 2,
            title: "Flujos de usuario",
            summary: "De onboarding a recibo.",
            items: [
              { type: "video", title: "UX de flujos críticos", durationMin: 10, resourceUrlPlaceholder: "{{VIDEO_URL_N4_M2_S2_1}}" },
              { type: "lab", title: "Checkout en stablecoin (mock)", notes: "Genera hash/ID de pedido." },
              { type: "quiz", title: "Friction & drop-off" }
            ]
          }
        ]
      },
      {
        index: 3,
        title: "Lanzamiento y demo",
        summary: "Pruebas, demo y plan de piloto.",
        submodules: [
          {
            index: 1,
            title: "QA y pruebas",
            summary: "Plan de pruebas mínimas.",
            items: [
              { type: "reading", title: "Plan de QA", downloadablePlaceholder: "{{PDF_URL_N4_M3_S1_1}}" },
              { type: "lab", title: "Pruebas de extremo a extremo", notes: "Graba evidencias." },
              { type: "quiz", title: "Checklist de salida" }
            ]
          },
          {
            index: 2,
            title: "Demo y piloto",
            summary: "Pitch + métricas de seguimiento.",
            items: [
              { type: "project", title: "Demo grabada", resourceUrlPlaceholder: "{{VIDEO_URL_N4_M3_S2_1}}" },
              { type: "assignment", title: "Plan de piloto y captación", downloadablePlaceholder: "{{DOC_URL_N4_M3_S2_2}}" },
              { type: "discussion", title: "Retrospectiva", notes: "Foro." }
            ]
          }
        ]
      }
    ],
    createdAt: "2025-08-05T00:00:00Z"
  },

  // NIVEL 5
  {
    id: "nivel-5-avanzado",
    slug: "avanzado-y-escalabilidad",
    title: "Avanzado + Escalabilidad",
    subtitle: "Explora Self, MiniPay, DeFi, agentes de IA, Account Abstraction, MCP y miniapps de Farcaster con IDEs modernos.",
    level: "Avanzado",
    category: "Avanzado",
    tags: ["Self","MiniPay","DeFi","AA","IA","Farcaster","MCP"],
    durationHours: 12,
    lessonsCount: 40,
    rating: 4.9,
    ratingCount: 140,
    learners: 950,
    coverUrl: "{{COVER_URL_ADV}}",
    promoVideoUrl: "{{PROMO_URL_ADV}}",
    instructor: {
      name: "Celo México",
      title: "Equipo Instructor",
      avatarUrl: "{{INSTRUCTOR_AVATAR_URL}}",
      bio: "Técnicas modernas para escalar productos sobre Celo."
    },
    priceUSD: 0,
    isFree: true,
    prerequisites: ["Crea Aplicaciones Reales"],
    outcomes: [
      "Integrar Account Abstraction en flujos críticos.",
      "Prototipar miniapps de Farcaster.",
      "Explorar integraciones con wallets (MiniPay), Self y patrones DeFi."
    ],
    modules: [
      {
        index: 1,
        title: "Account Abstraction y UX",
        summary: "AA para reducir fricción y mejorar seguridad.",
        submodules: [
          {
            index: 1,
            title: "Conceptos y patrones",
            summary: "Bundlers, paymasters y sesiones.",
            items: [
              { type: "video", title: "AA en la práctica", durationMin: 10, resourceUrlPlaceholder: "{{VIDEO_URL_N5_M1_S1_1}}" },
              { type: "reading", title: "Guía de AA", downloadablePlaceholder: "{{PDF_URL_N5_M1_S1_2}}" },
              { type: "lab", title: "Flujo con patrocinio de gas (mock)", notes: "Simula patrocinios." }
            ]
          },
          {
            index: 2,
            title: "Seguridad y UX avanzada",
            summary: "Recuperación social, límites y aprobación.",
            items: [
              { type: "assignment", title: "Diseña recuperación social", downloadablePlaceholder: "{{DOC_URL_N5_M1_S2_1}}" },
              { type: "quiz", title: "Riesgos y mitigaciones" },
              { type: "discussion", title: "Casos reales", notes: "Foro." }
            ]
          }
        ]
      },
      {
        index: 2,
        title: "DeFi y wallets",
        summary: "Stablecoins, swaps y flujos con MiniPay.",
        submodules: [
          {
            index: 1,
            title: "Patrones DeFi",
            summary: "Rutas básicas y riesgos.",
            items: [
              { type: "reading", title: "Introducción a DeFi en Celo", downloadablePlaceholder: "{{PDF_URL_N5_M2_S1_1}}" },
              { type: "lab", title: "Swap simulado + recibo", notes: "Mock de firma/confirmación." },
              { type: "quiz", title: "Riesgo/retorno" }
            ]
          },
          {
            index: 2,
            title: "Wallet flows",
            summary: "Integración inspirada en MiniPay.",
            items: [
              { type: "video", title: "Deep links y UX móvil", durationMin: 9, resourceUrlPlaceholder: "{{VIDEO_URL_N5_M2_S2_1}}" },
              { type: "assignment", title: "Diseña un flujo de pago seguro", downloadablePlaceholder: "{{DOC_URL_N5_M2_S2_2}}" },
              { type: "discussion", title: "Compatibilidad y fallback", notes: "Foro." }
            ]
          }
        ]
      },
      {
        index: 3,
        title: "Miniapps y agentes de IA",
        summary: "Prototipos en Farcaster y agentes asistidos.",
        submodules: [
          {
            index: 1,
            title: "Miniapps Farcaster",
            summary: "Arquitectura y APIs relevantes.",
            items: [
              { type: "reading", title: "Guía de miniapps", downloadablePlaceholder: "{{PDF_URL_N5_M3_S1_1}}" },
              { type: "lab", title: "Prototipo de miniapp (mock)", notes: "UI con estado local." },
              { type: "quiz", title: "Conceptos clave" }
            ]
          },
          {
            index: 2,
            title: "Agentes asistidos",
            summary: "MCP + agentes para soporte.",
            items: [
              { type: "video", title: "Agentes y MCP", durationMin: 8, resourceUrlPlaceholder: "{{VIDEO_URL_N5_M3_S2_1}}" },
              { type: "project", title: "Agente asistente para tu dApp", notes: "Documento de diseño." },
              { type: "discussion", title: "Limitaciones y roadmap", notes: "Foro." }
            ]
          }
        ]
      }
    ],
    createdAt: "2025-08-06T00:00:00Z"
  }
];

