# 🇲🇽 CELO Mexico Academy

> Plataforma educativa descentralizada para desarrolladores blockchain en México

[![Production Status](https://img.shields.io/badge/status-production-green)](./docs/deployment/PRODUCTION_STATUS.md)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## 📚 Documentation Menu

### 🚀 Deployment
- [Production Status](./docs/deployment/PRODUCTION_STATUS.md) - Current production state and metrics
- [Deployment Guide](./docs/deployment/DEPLOYMENT_GUIDE.md) - Complete deployment instructions
- [Deployment Summary](./docs/deployment/DEPLOYMENT_SUMMARY.md) - Quick deployment overview

### 🔧 Technical
- [Course Paywall System](./docs/technical/COURSE_PAYWALL.md) - NFT-based access control implementation
- [Dynamic NFT Solution](./docs/technical/DYNAMIC_NFT_SOLUTION.md) - Token ID generation architecture

### 📖 Reference
- [Project Rules](./docs/reference/PROJECT_RULES.md) - **⚠️ READ BEFORE CODING** - Critical rules and conventions
- [Feature Request Template](./docs/reference/FEATURE_REQUEST_TEMPLATE.md) - How to request new features
- [Docs Cleanup Plan](./docs/reference/DOCS_CLEANUP_PLAN.md) - Documentation organization roadmap

### 📜 Scripts
- [Scripts Guide](./scripts/README.md) - Deployment and monitoring scripts

---

CELO Mexico Academy es una plataforma educativa descentralizada que combina cursos de desarrollo blockchain con NFT badges y certificaciones on-chain.

## ✨ Características Principales

### 🎓 Academia
- **Cursos Estructurados** con módulos y lecciones
- **NFT Badges** por inscripción y completación
- **Certificados On-Chain** verificables en blockchain
- **Seguimiento de Progreso** personalizado
- **Sistema de Instructores** con perfiles dedicados

### 🔐 Tecnología
- **Next.js 15** con App Router y RSC
- **TypeScript** con strict mode
- **Tailwind CSS** para estilos responsivos
- **Privy** para autenticación de wallets
- **Wagmi + Viem** para interacción Web3
- **Prisma + PostgreSQL** para base de datos
- **Smart Contracts** en Celo Alfajores testnet

## 📁 Estructura del Proyecto

```
├── app/                       # Next.js 15 App Router
│   ├── academy/              # Rutas de la academia
│   │   ├── [slug]/          # Páginas dinámicas de cursos
│   │   └── page.tsx         # Catálogo de cursos
│   ├── admin/                # Panel de administración
│   │   ├── courses/         # CRUD de cursos
│   │   ├── instructors/     # Gestión de instructores
│   │   └── page.tsx         # Dashboard admin
│   ├── api/                  # API Routes
│   │   ├── admin/           # APIs administrativas
│   │   ├── health/          # Health checks
│   │   ├── metadata/        # NFT metadata endpoints
│   │   └── progress/        # Seguimiento de progreso
│   └── page.tsx              # Página principal
├── components/               # Componentes React
│   ├── academy/             # Componentes de cursos
│   ├── admin/               # Componentes admin
│   ├── theme/               # Sistema de temas
│   └── ui/                  # Componentes base
├── lib/                      # Utilidades y configuración
│   ├── hooks/               # Custom React hooks
│   ├── prisma.ts            # Cliente Prisma
│   └── wagmi.ts             # Configuración Web3
├── prisma/                   # Base de datos
│   └── schema.prisma        # Esquema de la BD
├── scripts/                  # Scripts de deployment
│   ├── deploy-and-monitor.sh
│   └── monitor-deployment.sh
└── public/                   # Assets estáticos
```

## 🚀 Quick Start

### Prerrequisitos

- **Node.js** 20.0.0 o superior (recomendado: 20.19.4)
- **npm** o **pnpm**
- **Git**
- **PostgreSQL** (o cuenta de Supabase)

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/CeloMexico/celomxwebsite.git
   cd celomxwebsite
   ```

2. **Instalar dependencias**
   ```bash
   pnpm install
   # o
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env.local
   ```
   
   Editar `.env.local` con tus configuraciones:
   ```env
   # Privy
   NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
   
   # Database
   DATABASE_URL="file:./dev.db"
   
   # Otros servicios...
   ```

4. **Configurar base de datos**
   ```bash
   pnpm prisma generate
   pnpm prisma db push
   ```

5. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   # o
   pnpm dev
   ```

   El sitio estará disponible en [http://localhost:3000](http://localhost:3000)

6. **Verificar la instalación**
   ```bash
   # Health check
   curl http://localhost:3000/api/health
   
   # Database check
   npx prisma studio
   ```

## 🎨 Assets Externos

Este proyecto utiliza assets externos para optimizar el tamaño del repositorio:

- **Videos**: Alojados en Cloudinary
- **Imágenes**: Alojadas en PostImg
- **Fuentes**: Solo las esenciales en `public/fonts/`

## 📱 Páginas Principales

- **Home** (`/`): Página principal con hero, características y posters
- **Academy** (`/academy`): Cursos y programas de desarrollo
- **Marketplace** (`/marketplace`): NFTs y colecciones
- **Dashboard** (`/dashboard`): Panel de administración
- **Ramps** (`/ramps`): On-ramp de criptomonedas

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo
npm run build            # Build para producción
npm run start            # Servidor de producción

# Calidad de Código
npm run lint             # ESLint
npm run type-check       # TypeScript check
npm run format           # Prettier

# Base de Datos
npm run db:studio        # Prisma Studio (GUI)
npm run db:push          # Sincronizar esquema
npm run db:migrate       # Crear migración
npm run db:seed          # Poblar datos

# Deployment
./scripts/deploy-and-monitor.sh -m "message"  # Deploy + monitor
./scripts/monitor-deployment.sh                # Monitor only
```

## 🛠️ Stack Tecnológico

### Frontend
- **Framework**: Next.js 15 (App Router, RSC)
- **Lenguaje**: TypeScript 5.0
- **Estilos**: Tailwind CSS 3.4
- **UI Components**: Radix UI, shadcn/ui
- **Animaciones**: Framer Motion

### Backend
- **Base de Datos**: PostgreSQL (Supabase)
- **ORM**: Prisma 5.0
- **API**: Next.js API Routes
- **Autenticación**: Privy (Wallet Auth)

### Web3
- **Blockchain**: Celo Alfajores Testnet
- **Smart Contracts**: Solidity (SimpleBadge ERC1155)
- **Web3 Library**: Wagmi + Viem
- **Wallet Connect**: WalletConnect v2

### DevOps
- **Hosting**: Vercel
- **CI/CD**: GitHub Actions + Vercel
- **Monitoring**: Custom scripts
- **Database**: Supabase (PostgreSQL)

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la documentación
2. Busca en los issues existentes
3. Crea un nuevo issue con detalles del problema

## 📚 Documentación

### Guías Principales
- [📊 Production Status](./docs/deployment/PRODUCTION_STATUS.md) - Estado actual de producción
- [🚀 Deployment Guide](./docs/deployment/DEPLOYMENT_GUIDE.md) - Guía completa de deployment
- [🎯 NFT Solution](./docs/technical/DYNAMIC_NFT_SOLUTION.md) - Arquitectura de NFT badges
- [⚙️ Scripts Guide](./scripts/README.md) - Uso de scripts de deployment
- [📖 Project Rules](./docs/reference/PROJECT_RULES.md) - Reglas y convenciones del proyecto

### APIs y Endpoints
- `/api/health` - Health check general
- `/api/health/db` - Verificación de base de datos
- `/api/health/env` - Variables de entorno
- `/api/metadata/milestone/{tokenId}` - Metadata de NFTs
- `/api/courses` - Listado de cursos
- `/api/progress` - Seguimiento de progreso

## 🎯 Funcionalidades

### Para Estudiantes
- ✅ Explorar catálogo de cursos
- ✅ Conectar wallet (MetaMask, WalletConnect)
- ✅ Inscribirse a cursos (claim NFT badge)
- ✅ Completar lecciones y módulos
- ✅ Obtener certificados on-chain
- ✅ Ver progreso personal

### Para Administradores
- ✅ Panel de administración completo
- ✅ CRUD de cursos, módulos y lecciones
- ✅ Gestión de instructores
- ✅ Mint de badges administrativos
- ✅ Estadísticas y métricas

## 🔐 Seguridad

- ✅ Autenticación basada en wallets (Privy)
- ✅ Protección de rutas administrativas
- ✅ Validación de tokens JWT
- ✅ Conexiones SSL a base de datos
- ✅ Variables de entorno encriptadas
- ✅ Validación de direcciones on-chain

## 📊 Estado de Producción

**Status**: 🟢 **EN PRODUCCIÓN**

- **Deployment**: Vercel
- **Uptime**: 99.9%
- **Database**: PostgreSQL (Supabase)
- **Smart Contract**: Deployed on Alfajores

Ver [PRODUCTION_STATUS.md](./docs/deployment/PRODUCTION_STATUS.md) para más detalles.

---

## 🤝 Contribución

¿Quieres contribuir? ¡Genial! Sigue estos pasos:

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: Amazing feature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Estándares de Código
- TypeScript estricto (no `any`)
- ESLint + Prettier configurados
- Commits convencionales (feat:, fix:, docs:, etc.)
- Tests para nuevas funcionalidades

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

---

## 📞 Soporte

### Canales de Soporte
- 📧 Email: contact@celomexico.org
- 💬 Discord: [Celo Mexico Community](https://discord.gg/celo)
- 🐦 Twitter: [@CeloMexico](https://twitter.com/CeloMexico)
- 📱 Telegram: [t.me/CeloMexico](https://t.me/CeloMexico)

### Reportar Issues
1. Revisa los [issues existentes](https://github.com/CeloMX/celo-mx/issues)
2. Crea un nuevo issue con:
   - Descripción clara del problema
   - Pasos para reproducir
   - Capturas de pantalla (si aplica)
   - Información del entorno

---

## 🙏 Agradecimientos

- [Celo Foundation](https://celo.org) por el soporte
- [Privy](https://privy.io) por la solución de autenticación
- [Vercel](https://vercel.com) por el hosting
- [Supabase](https://supabase.com) por la base de datos
- Comunidad de desarrolladores de Celo México

---

<div align="center">
  <strong>CELO Mexico Academy</strong><br>
  Construyendo el futuro de las finanzas descentralizadas en México 🇲🇽
  <br><br>
  <a href="https://celomexico.org">Website</a> ·
  <a href="./docs/deployment/PRODUCTION_STATUS.md">Status</a> ·
  <a href="./docs/deployment/DEPLOYMENT_GUIDE.md">Docs</a> ·
  <a href="./docs/reference/PROJECT_RULES.md">Rules</a>
</div>
