/**
 * 🏥 HEALTH CHECK ENDPOINT
 * 
 * Provides system health status for monitoring and smoke tests.
 * This endpoint is used by:
 * - CI/CD pipeline smoke tests
 * - Monitoring systems (uptime checkers)
 * - Load balancers (health checks)
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const checks: Record<string, any> = {
    timestamp: new Date().toISOString(),
    status: 'ok',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    checks: {}
  };

  try {
    // ==========================================================================
    // DATABASE CONNECTIVITY CHECK
    // ==========================================================================
    try {
      const dbStartTime = Date.now();
      await prisma.$queryRaw`SELECT 1 as health_check`;
      const dbResponseTime = Date.now() - dbStartTime;
      
      checks.checks.database = {
        status: 'ok',
        responseTime: `${dbResponseTime}ms`,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      checks.status = 'degraded';
      checks.checks.database = {
        status: 'error',
        error: error instanceof Error ? error.message : 'Database connection failed',
        timestamp: new Date().toISOString()
      };
    }

    // ==========================================================================
    // MEMORY USAGE CHECK
    // ==========================================================================
    try {
      const memUsage = process.memoryUsage();
      const memUsageMB = {
        rss: Math.round(memUsage.rss / 1024 / 1024 * 100) / 100,
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024 * 100) / 100,
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024 * 100) / 100,
        external: Math.round(memUsage.external / 1024 / 1024 * 100) / 100
      };

      checks.checks.memory = {
        status: 'ok',
        usage: memUsageMB,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      checks.checks.memory = {
        status: 'error',
        error: 'Memory check failed',
        timestamp: new Date().toISOString()
      };
    }

    // ==========================================================================
    // UPTIME CHECK
    // ==========================================================================
    checks.checks.uptime = {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    };

    // ==========================================================================
    // OVERALL RESPONSE TIME
    // ==========================================================================
    const totalResponseTime = Date.now() - startTime;
    checks.responseTime = `${totalResponseTime}ms`;

    // ==========================================================================
    // DETERMINE OVERALL STATUS
    // ==========================================================================
    const hasErrors = Object.values(checks.checks).some((check: any) => check.status === 'error');
    if (hasErrors) {
      checks.status = 'error';
      return NextResponse.json(checks, { status: 503 });
    }

    const hasDegraded = Object.values(checks.checks).some((check: any) => check.status === 'degraded');
    if (hasDegraded) {
      checks.status = 'degraded';
      return NextResponse.json(checks, { status: 200 });
    }

    return NextResponse.json(checks, { status: 200 });

  } catch (error) {
    // ==========================================================================
    // CRITICAL ERROR - SYSTEM UNHEALTHY
    // ==========================================================================
    const errorResponse = {
      timestamp: new Date().toISOString(),
      status: 'error',
      error: error instanceof Error ? error.message : 'Health check failed',
      responseTime: `${Date.now() - startTime}ms`
    };

    return NextResponse.json(errorResponse, { status: 503 });
  } finally {
    // Clean up database connection
    try {
      await prisma.$disconnect();
    } catch (error) {
      // Log but don't throw - we're already handling the response
      console.error('Failed to disconnect from database in health check:', error);
    }
  }
}

// =============================================================================
// ADDITIONAL HEALTH ENDPOINTS
// =============================================================================

export async function HEAD(request: NextRequest) {
  // Simple HEAD request for basic uptime checks
  try {
    return new NextResponse(null, { status: 200 });
  } catch (error) {
    return new NextResponse(null, { status: 503 });
  }
}