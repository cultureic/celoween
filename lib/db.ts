import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

// Setup SSL certificate for Prisma if needed
let sslConfig: any = {}
if (process.env.NODE_ENV === 'production' && process.env.DATABASE_SSL_CERT) {
  // In production (Vercel), use SSL cert from environment variable
  try {
    // Write SSL cert to temporary file
    const certPath = '/tmp/ca-certificate.crt'
    fs.writeFileSync(certPath, process.env.DATABASE_SSL_CERT)
    
    sslConfig = {
      datasources: {
        db: {
          url: process.env.DATABASE_URL + `&sslcert=${certPath}`
        }
      }
    }
  } catch (error) {
    console.warn('Failed to set up SSL certificate:', error)
  }
}

const globalForPrisma = global as unknown as { prisma?: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['warn','error'],
    ...sslConfig
  })
  
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

