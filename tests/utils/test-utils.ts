/**
 * 🛠️ TEST UTILITIES AND FIXTURES
 * 
 * Centralized utilities, fixtures, and helper functions used across
 * all test suites to ensure consistency and reduce code duplication.
 */

import { PrismaClient } from '@prisma/client';
import { Page, Browser, chromium } from '@playwright/test';
import { randomBytes } from 'crypto';

// =============================================================================
// DATABASE TEST UTILITIES
// =============================================================================

/**
 * Clean test database instance
 * Ensures each test starts with a fresh database state
 */
export class TestDatabase {
  private static instance: PrismaClient;
  
  static getInstance(): PrismaClient {
    if (!TestDatabase.instance) {
      TestDatabase.instance = new PrismaClient({
        datasourceUrl: process.env.DATABASE_URL_TEST || process.env.DATABASE_URL
      });
    }
    return TestDatabase.instance;
  }

  static async cleanup(): Promise<void> {
    const prisma = TestDatabase.getInstance();
    
    try {
      // Clean up in correct order (respecting foreign keys)
      await prisma.progress.deleteMany();
      await prisma.userCourse.deleteMany();
      await prisma.course.deleteMany();
      await prisma.user.deleteMany();
    } catch (error) {
      console.warn('Database cleanup error (tables might not exist):', error);
    }
  }

  static async disconnect(): Promise<void> {
    if (TestDatabase.instance) {
      await TestDatabase.instance.$disconnect();
    }
  }

  static async seed(): Promise<{
    users: any[];
    courses: any[];
    progress: any[];
  }> {
    const prisma = TestDatabase.getInstance();
    
    try {
      // Create test users
      const users = await Promise.all([
        prisma.user.create({
          data: {
            id: 'test-user-1',
            walletAddress: '0x1234567890123456789012345678901234567890',
            email: 'test1@example.com',
            name: 'Test User 1',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        }),
        prisma.user.create({
          data: {
            id: 'test-user-2', 
            walletAddress: '0x0987654321098765432109876543210987654321',
            email: 'test2@example.com',
            name: 'Test User 2',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        })
      ]);

      // Create test courses
      const courses = await Promise.all([
        prisma.course.create({
          data: {
            id: 'test-course-1',
            title: 'Introduction to Celo',
            description: 'Learn the basics of Celo blockchain',
            slug: 'intro-to-celo',
            difficulty: 'BEGINNER',
            estimatedTime: 60,
            isPublished: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        }),
        prisma.course.create({
          data: {
            id: 'test-course-2',
            title: 'Advanced DeFi Development',
            description: 'Build complex DeFi applications',
            slug: 'advanced-defi',
            difficulty: 'ADVANCED',
            estimatedTime: 240,
            isPublished: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        })
      ]);

      // Create test progress
      const progress = await Promise.all([
        prisma.progress.create({
          data: {
            id: 'test-progress-1',
            userId: users[0].id,
            courseId: courses[0].id,
            completedLessons: ['lesson-1'],
            completionPercentage: 25,
            lastAccessedAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
          }
        })
      ]);

      return { users, courses, progress };
    } catch (error) {
      console.warn('Database seeding error (schema might not match):', error);
      return { users: [], courses: [], progress: [] };
    }
  }
}

// =============================================================================
// AUTHENTICATION TEST UTILITIES  
// =============================================================================

export class AuthTestUtils {
  
  /**
   * Generate a mock JWT token for testing
   */
  static generateMockJWT(userId: string = 'test-user'): string {
    // This is a mock token - in real tests you'd use your actual JWT library
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const payload = Buffer.from(JSON.stringify({
      sub: userId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600 // 1 hour
    })).toString('base64url');
    const signature = 'mock-signature';
    
    return `${header}.${payload}.${signature}`;
  }

  /**
   * Set up authenticated session for Playwright tests
   */
  static async setupAuthenticatedSession(page: Page, userId: string = 'test-user'): Promise<void> {
    // Mock the authentication state
    await page.addInitScript((mockUserId) => {
      // Mock localStorage auth state
      localStorage.setItem('auth-token', `mock-token-${mockUserId}`);
      
      // Mock Privy auth state
      (window as any).__PRIVY_AUTH_STATE__ = {
        user: {
          id: mockUserId,
          wallet: { address: '0x1234567890123456789012345678901234567890' }
        },
        authenticated: true
      };
    }, userId);
  }

  /**
   * Clean up auth state after tests
   */
  static async cleanupAuth(page: Page): Promise<void> {
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
      delete (window as any).__PRIVY_AUTH_STATE__;
    });
  }
}

// =============================================================================
// MOCK DATA GENERATORS
// =============================================================================

export class MockDataGenerator {
  
  static generateUser(overrides: Partial<any> = {}): any {
    const id = `user-${randomBytes(4).toString('hex')}`;
    return {
      id,
      walletAddress: `0x${randomBytes(20).toString('hex')}`,
      email: `${id}@example.com`,
      name: `Test User ${id}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides
    };
  }

  static generateCourse(overrides: Partial<any> = {}): any {
    const id = `course-${randomBytes(4).toString('hex')}`;
    return {
      id,
      title: `Test Course ${id}`,
      description: `Description for ${id}`,
      slug: `test-course-${id}`,
      difficulty: 'BEGINNER',
      estimatedTime: 120,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides
    };
  }

  static generateProgress(userId: string, courseId: string, overrides: Partial<any> = {}): any {
    const id = `progress-${randomBytes(4).toString('hex')}`;
    return {
      id,
      userId,
      courseId,
      completedLessons: ['lesson-1'],
      completionPercentage: 50,
      lastAccessedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides
    };
  }

  /**
   * Generate realistic test data for forms
   */
  static generateFormData(type: 'user' | 'course' | 'progress'): any {
    switch (type) {
      case 'user':
        return {
          email: `test-${Date.now()}@example.com`,
          name: 'Test User',
          walletAddress: `0x${randomBytes(20).toString('hex')}`
        };
      
      case 'course':
        return {
          title: 'Test Course Title',
          description: 'This is a test course description with sufficient detail.',
          difficulty: 'BEGINNER',
          estimatedTime: 120
        };
      
      case 'progress':
        return {
          completedLessons: ['lesson-1', 'lesson-2'],
          completionPercentage: 75,
          timeSpent: 3600
        };
      
      default:
        return {};
    }
  }
}

// =============================================================================
// PAGE OBJECT UTILITIES
// =============================================================================

export class PageObjectUtils {
  
  /**
   * Wait for page to be fully loaded with all critical elements
   */
  static async waitForPageLoad(page: Page): Promise<void> {
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('body', { state: 'visible' });
    
    // Wait for any loading indicators to disappear
    try {
      await page.waitForSelector('[data-testid="loading"]', { state: 'hidden', timeout: 5000 });
    } catch (error) {
      // Loading indicator might not exist, that's OK
    }
  }

  /**
   * Fill form with error handling and validation
   */
  static async fillForm(page: Page, formData: Record<string, string>): Promise<void> {
    for (const [field, value] of Object.entries(formData)) {
      const selector = `[name="${field}"], [data-testid="${field}"], #${field}`;
      
      try {
        await page.fill(selector, value);
        
        // Trigger validation if needed
        await page.dispatchEvent(selector, 'blur');
      } catch (error) {
        console.warn(`Failed to fill field ${field}:`, error);
      }
    }
  }

  /**
   * Check for validation errors on the page
   */
  static async getValidationErrors(page: Page): Promise<string[]> {
    const errorSelectors = [
      '[data-testid*="error"]',
      '.error-message',
      '[role="alert"]',
      '.invalid-feedback'
    ];

    const errors: string[] = [];
    
    for (const selector of errorSelectors) {
      try {
        const errorElements = await page.locator(selector).all();
        for (const element of errorElements) {
          const text = await element.textContent();
          if (text && text.trim()) {
            errors.push(text.trim());
          }
        }
      } catch (error) {
        // Selector might not exist, continue
      }
    }
    
    return errors;
  }
}

// =============================================================================
// API TEST UTILITIES
// =============================================================================

export class APITestUtils {
  
  /**
   * Make authenticated API request
   */
  static async makeAuthenticatedRequest(
    page: Page, 
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: any,
    userId: string = 'test-user'
  ): Promise<any> {
    const token = AuthTestUtils.generateMockJWT(userId);
    
    const options: any = {
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
    
    if (data && (method === 'POST' || method === 'PUT')) {
      options.data = JSON.stringify(data);
    }
    
    const response = await page.request.fetch(endpoint, options);
    
    return {
      status: response.status(),
      ok: response.ok(),
      data: response.ok() ? await response.json() : null,
      headers: response.headers()
    };
  }

  /**
   * Validate API response structure
   */
  static validateApiResponse(response: any, expectedFields: string[]): boolean {
    if (!response.data) return false;
    
    return expectedFields.every(field => {
      const value = field.split('.').reduce((obj, key) => obj?.[key], response.data);
      return value !== undefined;
    });
  }

  /**
   * Generate test API payloads
   */
  static generateApiPayload(type: string, overrides: any = {}): any {
    const payloads: Record<string, any> = {
      createUser: {
        email: `test-${Date.now()}@example.com`,
        name: 'Test User',
        walletAddress: `0x${randomBytes(20).toString('hex')}`,
        ...overrides
      },
      updateProgress: {
        courseId: 'test-course-1',
        completedLessons: ['lesson-1'],
        completionPercentage: 50,
        timeSpent: 1800,
        ...overrides
      },
      createCourse: {
        title: 'Test Course',
        description: 'Test course description',
        difficulty: 'BEGINNER',
        estimatedTime: 120,
        ...overrides
      }
    };
    
    return payloads[type] || {};
  }
}

// =============================================================================
// PERFORMANCE TEST UTILITIES
// =============================================================================

export class PerformanceTestUtils {
  
  /**
   * Measure page load performance
   */
  static async measurePageLoad(page: Page, url: string): Promise<{
    loadTime: number;
    domContentLoaded: number;
    firstContentfulPaint: number;
  }> {
    const startTime = Date.now();
    
    await page.goto(url);
    await page.waitForLoadState('domcontentloaded');
    
    const loadTime = Date.now() - startTime;
    
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        firstContentfulPaint: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0
      };
    });
    
    return {
      loadTime,
      ...metrics
    };
  }

  /**
   * Monitor memory usage during test execution
   */
  static async measureMemoryUsage(page: Page): Promise<{
    initial: number;
    final: number;
    increase: number;
  }> {
    const initial = await page.evaluate(() => {
      return 'memory' in performance ? (performance as any).memory.usedJSHeapSize : 0;
    });
    
    return {
      initial,
      final: initial, // Will be updated by caller
      increase: 0
    };
  }

  /**
   * Simulate concurrent users
   */
  static async simulateLoad(
    url: string, 
    userCount: number, 
    duration: number = 30000
  ): Promise<{
    totalRequests: number;
    successfulRequests: number;
    averageResponseTime: number;
    errors: string[];
  }> {
    const browser = await chromium.launch();
    const results: any[] = [];
    const errors: string[] = [];
    
    const promises = Array.from({ length: userCount }, async (_, index) => {
      const context = await browser.newContext();
      const page = await context.newPage();
      
      const startTime = Date.now();
      let requestCount = 0;
      let successCount = 0;
      
      // Keep making requests for the duration
      while (Date.now() - startTime < duration) {
        try {
          const reqStart = Date.now();
          await page.goto(url);
          await page.waitForLoadState('domcontentloaded');
          
          requestCount++;
          successCount++;
          results.push({
            user: index,
            responseTime: Date.now() - reqStart,
            success: true
          });
        } catch (error) {
          requestCount++;
          errors.push(`User ${index}: ${error}`);
          results.push({
            user: index,
            responseTime: Date.now() - startTime,
            success: false
          });
        }
        
        // Small delay between requests
        await page.waitForTimeout(100);
      }
      
      await context.close();
      return { requestCount, successCount };
    });
    
    await Promise.all(promises);
    await browser.close();
    
    const successful = results.filter(r => r.success);
    const averageResponseTime = successful.reduce((sum, r) => sum + r.responseTime, 0) / successful.length;
    
    return {
      totalRequests: results.length,
      successfulRequests: successful.length,
      averageResponseTime: Math.round(averageResponseTime),
      errors
    };
  }
}

// =============================================================================
// CLEANUP UTILITIES
// =============================================================================

export class TestCleanup {
  private static cleanupTasks: Array<() => Promise<void>> = [];
  
  static addCleanupTask(task: () => Promise<void>): void {
    TestCleanup.cleanupTasks.push(task);
  }
  
  static async runCleanup(): Promise<void> {
    for (const task of TestCleanup.cleanupTasks) {
      try {
        await task();
      } catch (error) {
        console.warn('Cleanup task failed:', error);
      }
    }
    TestCleanup.cleanupTasks = [];
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

export {
  TestDatabase,
  AuthTestUtils,
  MockDataGenerator,
  PageObjectUtils,
  APITestUtils,
  PerformanceTestUtils,
  TestCleanup
};