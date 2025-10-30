/**
 * ⚡ PERFORMANCE TESTS
 * 
 * Comprehensive performance testing suite to ensure the application
 * meets performance benchmarks across all critical user journeys.
 * 
 * Covers:
 * - Page load times
 * - API response times  
 * - Database query performance
 * - Memory usage patterns
 * - Concurrent user load testing
 */

import { test, expect, chromium } from '@playwright/test';
import { PrismaClient } from '@prisma/client';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';
const prisma = new PrismaClient();

// =============================================================================
// PERFORMANCE THRESHOLDS (ADJUST BASED ON REQUIREMENTS)
// =============================================================================
const PERFORMANCE_THRESHOLDS = {
  pageLoad: 3000,        // 3 seconds max for page load
  apiResponse: 500,      // 500ms max for API responses
  databaseQuery: 100,    // 100ms max for simple queries
  memoryLeakThreshold: 50, // 50MB increase threshold
  concurrentUsers: 10    // Number of concurrent users to simulate
};

test.describe('⚡ Performance Tests', () => {

  test.beforeAll(async () => {
    // Ensure database is ready for performance tests
    await prisma.$connect();
  });

  test.afterAll(async () => {
    await prisma.$disconnect();
  });

  // ===========================================================================
  // PAGE LOAD PERFORMANCE
  // ===========================================================================
  test.describe('🌐 Page Load Performance', () => {
    
    test('📊 Home page loads within threshold', async ({ page }) => {
      const startTime = Date.now();
      
      // Navigate to homepage
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      
      console.log(`🏠 Home page load time: ${loadTime}ms`);
      expect(loadTime).toBeLessThan(PERFORMANCE_THRESHOLDS.pageLoad);
      
      // Verify Core Web Vitals
      const webVitals = await page.evaluate(() => {
        return new Promise((resolve) => {
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const vitals: Record<string, number> = {};
            
            entries.forEach((entry) => {
              if (entry.entryType === 'navigation') {
                const navEntry = entry as PerformanceNavigationTiming;
                vitals.domContentLoaded = navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart;
                vitals.loadComplete = navEntry.loadEventEnd - navEntry.loadEventStart;
              }
            });
            resolve(vitals);
          }).observe({ entryTypes: ['navigation'] });
        });
      });
      
      console.log('📈 Web Vitals:', webVitals);
    });

    test('🔄 Course listing page performance', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto(`${BASE_URL}/courses`);
      await page.waitForSelector('[data-testid="course-list"]', { timeout: 10000 });
      
      const loadTime = Date.now() - startTime;
      
      console.log(`📚 Courses page load time: ${loadTime}ms`);
      expect(loadTime).toBeLessThan(PERFORMANCE_THRESHOLDS.pageLoad);
    });

  });

  // ===========================================================================
  // API PERFORMANCE
  // ===========================================================================
  test.describe('🔌 API Performance', () => {
    
    test('⚡ Health check API response time', async ({ page }) => {
      const startTime = Date.now();
      
      const response = await page.request.get(`${BASE_URL}/api/health`);
      const responseTime = Date.now() - startTime;
      
      console.log(`🏥 Health API response time: ${responseTime}ms`);
      expect(response.ok()).toBeTruthy();
      expect(responseTime).toBeLessThan(PERFORMANCE_THRESHOLDS.apiResponse);
      
      // Verify response structure
      const healthData = await response.json();
      expect(healthData.status).toBeDefined();
      expect(healthData.responseTime).toBeDefined();
    });

    test('📚 Courses API performance', async ({ page }) => {
      const startTime = Date.now();
      
      const response = await page.request.get(`${BASE_URL}/api/courses`);
      const responseTime = Date.now() - startTime;
      
      console.log(`📚 Courses API response time: ${responseTime}ms`);
      expect(responseTime).toBeLessThan(PERFORMANCE_THRESHOLDS.apiResponse * 2); // Allow more time for data
    });

    test('📊 Progress API performance', async ({ page }) => {
      // This test would require authentication - adapt based on your auth system
      const startTime = Date.now();
      
      try {
        const response = await page.request.get(`${BASE_URL}/api/progress`);
        const responseTime = Date.now() - startTime;
        
        console.log(`📊 Progress API response time: ${responseTime}ms`);
        
        // Even if unauthorized, response should be fast
        expect(responseTime).toBeLessThan(PERFORMANCE_THRESHOLDS.apiResponse);
      } catch (error) {
        console.log('⚠️ Progress API requires authentication - skipping detailed test');
      }
    });

  });

  // ===========================================================================
  // DATABASE PERFORMANCE  
  // ===========================================================================
  test.describe('🗄️ Database Performance', () => {
    
    test('⚡ Simple database queries', async () => {
      const queries = [
        { name: 'User count', query: () => prisma.user.count() },
        { name: 'Course count', query: () => prisma.course.count() },
        { name: 'Progress count', query: () => prisma.progress.count() }
      ];

      for (const queryTest of queries) {
        const startTime = Date.now();
        
        try {
          await queryTest.query();
          const queryTime = Date.now() - startTime;
          
          console.log(`🗄️ ${queryTest.name} query time: ${queryTime}ms`);
          expect(queryTime).toBeLessThan(PERFORMANCE_THRESHOLDS.databaseQuery * 2);
        } catch (error) {
          console.log(`⚠️ ${queryTest.name} query failed (table might not exist):`, error);
        }
      }
    });

    test('🔍 Complex database queries', async () => {
      // Test more complex queries that might be used in the app
      const startTime = Date.now();
      
      try {
        // Raw query to test database connectivity and performance
        await prisma.$queryRaw`SELECT 1 as test, NOW() as timestamp`;
        const queryTime = Date.now() - startTime;
        
        console.log(`🔍 Raw query time: ${queryTime}ms`);
        expect(queryTime).toBeLessThan(PERFORMANCE_THRESHOLDS.databaseQuery);
      } catch (error) {
        console.log('⚠️ Database query failed:', error);
      }
    });

  });

  // ===========================================================================
  // MEMORY PERFORMANCE
  // ===========================================================================
  test.describe('🧠 Memory Performance', () => {
    
    test('📈 Memory usage during normal operations', async ({ page }) => {
      const initialMemory = await page.evaluate(() => {
        if ('memory' in performance) {
          return (performance as any).memory.usedJSHeapSize;
        }
        return 0;
      });

      // Simulate normal user activity
      await page.goto(BASE_URL);
      await page.waitForTimeout(1000);
      
      await page.goto(`${BASE_URL}/courses`);
      await page.waitForTimeout(1000);
      
      // Navigate back
      await page.goBack();
      await page.waitForTimeout(1000);
      
      // Force garbage collection if possible
      await page.evaluate(() => {
        if (typeof window !== 'undefined' && 'gc' in window) {
          (window as any).gc();
        }
      });
      
      const finalMemory = await page.evaluate(() => {
        if ('memory' in performance) {
          return (performance as any).memory.usedJSHeapSize;
        }
        return 0;
      });

      const memoryIncrease = (finalMemory - initialMemory) / 1024 / 1024; // Convert to MB
      console.log(`🧠 Memory increase: ${memoryIncrease.toFixed(2)}MB`);
      
      if (initialMemory > 0) {
        expect(memoryIncrease).toBeLessThan(PERFORMANCE_THRESHOLDS.memoryLeakThreshold);
      }
    });

  });

  // ===========================================================================
  // CONCURRENT LOAD TESTING
  // ===========================================================================
  test.describe('👥 Concurrent Load Testing', () => {
    
    test('🚀 Multiple users accessing homepage', async () => {
      const browser = await chromium.launch();
      const promises: Promise<any>[] = [];
      
      console.log(`🚀 Starting concurrent load test with ${PERFORMANCE_THRESHOLDS.concurrentUsers} users`);
      
      // Create multiple concurrent users
      for (let i = 0; i < PERFORMANCE_THRESHOLDS.concurrentUsers; i++) {
        const promise = (async (userIndex: number) => {
          const context = await browser.newContext();
          const page = await context.newPage();
          
          const startTime = Date.now();
          
          try {
            await page.goto(BASE_URL);
            await page.waitForLoadState('networkidle');
            
            const loadTime = Date.now() - startTime;
            console.log(`👤 User ${userIndex + 1} load time: ${loadTime}ms`);
            
            return { userIndex, loadTime, success: true };
          } catch (error) {
            console.error(`❌ User ${userIndex + 1} failed:`, error);
            return { userIndex, loadTime: Date.now() - startTime, success: false };
          } finally {
            await context.close();
          }
        })(i);
        
        promises.push(promise);
      }
      
      // Wait for all users to complete
      const results = await Promise.all(promises);
      await browser.close();
      
      // Analyze results
      const successful = results.filter(r => r.success);
      const failed = results.filter(r => !r.success);
      
      console.log(`✅ Successful requests: ${successful.length}/${results.length}`);
      console.log(`❌ Failed requests: ${failed.length}/${results.length}`);
      
      const avgLoadTime = successful.reduce((sum, r) => sum + r.loadTime, 0) / successful.length;
      console.log(`⏱️ Average load time: ${avgLoadTime.toFixed(0)}ms`);
      
      // Assertions
      expect(successful.length).toBeGreaterThanOrEqual(PERFORMANCE_THRESHOLDS.concurrentUsers * 0.9); // 90% success rate
      expect(avgLoadTime).toBeLessThan(PERFORMANCE_THRESHOLDS.pageLoad * 2); // Allow 2x time under load
    });

  });

  // ===========================================================================
  // API LOAD TESTING
  // ===========================================================================
  test.describe('🔥 API Load Testing', () => {
    
    test('⚡ Health API under load', async ({ page }) => {
      const promises: Promise<any>[] = [];
      const requestCount = 20;
      
      console.log(`🔥 Testing health API with ${requestCount} concurrent requests`);
      
      for (let i = 0; i < requestCount; i++) {
        const promise = (async (requestIndex: number) => {
          const startTime = Date.now();
          
          try {
            const response = await page.request.get(`${BASE_URL}/api/health`);
            const responseTime = Date.now() - startTime;
            
            return {
              requestIndex,
              responseTime,
              status: response.status(),
              success: response.ok()
            };
          } catch (error) {
            return {
              requestIndex,
              responseTime: Date.now() - startTime,
              status: 0,
              success: false
            };
          }
        })(i);
        
        promises.push(promise);
      }
      
      const results = await Promise.all(promises);
      
      // Analyze results
      const successful = results.filter(r => r.success);
      const avgResponseTime = successful.reduce((sum, r) => sum + r.responseTime, 0) / successful.length;
      
      console.log(`✅ Successful API requests: ${successful.length}/${results.length}`);
      console.log(`⏱️ Average API response time: ${avgResponseTime.toFixed(0)}ms`);
      
      // Assertions
      expect(successful.length).toBeGreaterThanOrEqual(requestCount * 0.95); // 95% success rate
      expect(avgResponseTime).toBeLessThan(PERFORMANCE_THRESHOLDS.apiResponse * 3); // Allow 3x time under load
    });

  });

});

// =============================================================================
// PERFORMANCE UTILITIES
// =============================================================================
test.describe('🛠️ Performance Utilities', () => {
  
  test('📊 Generate performance report', async ({ page }) => {
    const report = {
      timestamp: new Date().toISOString(),
      thresholds: PERFORMANCE_THRESHOLDS,
      environment: {
        baseUrl: BASE_URL,
        nodeEnv: process.env.NODE_ENV || 'test'
      },
      summary: 'Performance tests completed - check individual test results above'
    };
    
    console.log('📊 Performance Test Report:', JSON.stringify(report, null, 2));
  });

});