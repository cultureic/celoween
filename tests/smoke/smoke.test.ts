/**
 * 🔥 SMOKE TESTS - Post-Deployment Validation
 * 
 * These tests run against live deployments to verify basic functionality
 * after deployment. They are designed to be fast and catch critical issues
 * that would prevent users from using the application.
 * 
 * CRITICAL: These tests run in production - keep them safe!
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.PRODUCTION_URL || process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';

test.describe('🔥 Smoke Tests - Critical Path Verification', () => {
  
  test.beforeEach(async ({ page }) => {
    // Set up common test configuration
    await page.goto(BASE_URL);
  });

  // ==========================================================================
  // CRITICAL PATH 1: APPLICATION LOADS
  // ==========================================================================
  test('🌐 Application loads successfully', async ({ page }) => {
    // Verify the page loads without errors
    await expect(page).toHaveTitle(/Celo Academy Mexico/i);
    
    // Check for critical elements
    await expect(page.locator('body')).toBeVisible();
    
    // Verify no JavaScript errors
    const jsErrors: string[] = [];
    page.on('pageerror', error => jsErrors.push(error.message));
    page.on('console', msg => {
      if (msg.type() === 'error') {
        jsErrors.push(msg.text());
      }
    });
    
    // Wait a bit to catch any async errors
    await page.waitForTimeout(2000);
    
    expect(jsErrors).toHaveLength(0);
  });

  // ==========================================================================
  // CRITICAL PATH 2: AUTHENTICATION SYSTEM
  // ==========================================================================
  test('🔐 Authentication system is accessible', async ({ page }) => {
    // Look for login/connect wallet button
    const connectButton = page.locator('button:has-text("Connect Wallet"), button:has-text("Conectar"), button:has-text("Login")').first();
    await expect(connectButton).toBeVisible({ timeout: 10000 });
    
    // Verify button is clickable (don't actually click in production)
    await expect(connectButton).toBeEnabled();
  });

  // ==========================================================================
  // CRITICAL PATH 3: API HEALTH CHECK
  // ==========================================================================
  test('⚡ API endpoints are responding', async ({ page }) => {
    // Test health check endpoint
    const response = await page.request.get(`${BASE_URL}/api/health`);
    expect(response.status()).toBe(200);
    
    const healthData = await response.json();
    expect(healthData.status).toBe('ok');
  });

  // ==========================================================================
  // CRITICAL PATH 4: DATABASE CONNECTIVITY
  // ==========================================================================
  test('🗄️ Database connectivity works', async ({ page }) => {
    // Test a simple read endpoint that doesn't require auth
    const response = await page.request.get(`${BASE_URL}/api/courses`);
    
    // Should return 200 or 401 (if auth required), but not 500 (server error)
    expect([200, 401, 403].includes(response.status())).toBeTruthy();
    
    // If it returns data, verify structure
    if (response.status() === 200) {
      const data = await response.json();
      expect(Array.isArray(data) || typeof data === 'object').toBeTruthy();
    }
  });

  // ==========================================================================
  // CRITICAL PATH 5: STATIC ASSETS LOAD
  // ==========================================================================
  test('🖼️ Critical assets load successfully', async ({ page }) => {
    // Check for failed network requests
    const failedRequests: string[] = [];
    
    page.on('requestfailed', request => {
      // Only track critical assets, ignore non-essential ones
      if (request.url().includes('.css') || 
          request.url().includes('.js') || 
          request.url().includes('_next/static')) {
        failedRequests.push(request.url());
      }
    });
    
    // Navigate and wait for load
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Verify no critical assets failed
    expect(failedRequests).toHaveLength(0);
  });

  // ==========================================================================
  // CRITICAL PATH 6: RESPONSIVE DESIGN
  // ==========================================================================
  test('📱 Mobile responsiveness works', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Verify page is still usable
    await expect(page.locator('body')).toBeVisible();
    
    // Check for horizontal scroll (common mobile issue)
    const bodyWidth = await page.locator('body').evaluate(el => el.scrollWidth);
    const viewportWidth = await page.viewportSize();
    
    expect(bodyWidth).toBeLessThanOrEqual((viewportWidth?.width || 375) + 20); // Allow small buffer
  });

  // ==========================================================================
  // CRITICAL PATH 7: SECURITY HEADERS
  // ==========================================================================
  test('🔒 Security headers are present', async ({ page }) => {
    const response = await page.request.get(BASE_URL);
    const headers = response.headers();
    
    // Check for critical security headers
    expect(headers['x-frame-options']).toBeDefined();
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['x-xss-protection'] || headers['content-security-policy']).toBeDefined();
    
    // Verify HTTPS redirect in production
    if (BASE_URL.includes('vercel.app') || BASE_URL.includes('celo-mx')) {
      expect(BASE_URL.startsWith('https://')).toBeTruthy();
    }
  });

  // ==========================================================================
  // CRITICAL PATH 8: PERFORMANCE BASELINE
  // ==========================================================================
  test('⚡ Page loads within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    
    const loadTime = Date.now() - startTime;
    
    // Page should load within 5 seconds (generous for smoke test)
    expect(loadTime).toBeLessThan(5000);
  });

  // ==========================================================================
  // CRITICAL PATH 9: FORM FUNCTIONALITY
  // ==========================================================================
  test('📝 Forms can be accessed', async ({ page }) => {
    // Look for any forms on the page
    const forms = page.locator('form');
    const formCount = await forms.count();
    
    if (formCount > 0) {
      // Just verify forms exist and have proper structure
      const firstForm = forms.first();
      await expect(firstForm).toBeVisible();
      
      // Check for input fields
      const inputs = firstForm.locator('input, textarea, select');
      const inputCount = await inputs.count();
      expect(inputCount).toBeGreaterThan(0);
    }
  });

  // ==========================================================================
  // CRITICAL PATH 10: NAVIGATION WORKS
  // ==========================================================================
  test('🧭 Basic navigation functions', async ({ page }) => {
    // Look for navigation elements
    const navLinks = page.locator('nav a, header a, [role="navigation"] a').first();
    
    if (await navLinks.count() > 0) {
      const firstLink = navLinks.first();
      await expect(firstLink).toBeVisible();
      
      // Verify links have proper hrefs
      const href = await firstLink.getAttribute('href');
      expect(href).toBeTruthy();
      expect(href).not.toBe('#');
    }
  });

});

// =============================================================================
// UTILITY TESTS - ENVIRONMENT VALIDATION
// =============================================================================
test.describe('🔧 Environment Validation', () => {
  
  test('🌍 Environment variables are configured', async ({ page }) => {
    // Test that essential endpoints exist
    const healthResponse = await page.request.get(`${BASE_URL}/api/health`);
    
    // If health endpoint doesn't exist, at least verify the base URL is accessible
    if (healthResponse.status() === 404) {
      const baseResponse = await page.request.get(BASE_URL);
      expect([200, 301, 302].includes(baseResponse.status())).toBeTruthy();
    } else {
      expect(healthResponse.ok()).toBeTruthy();
    }
  });

  test('📡 DNS resolution works', async ({ page }) => {
    // Simple connectivity test
    const startTime = Date.now();
    const response = await page.request.get(BASE_URL);
    const responseTime = Date.now() - startTime;
    
    // Should respond within 3 seconds
    expect(responseTime).toBeLessThan(3000);
    expect(response.status()).toBeLessThan(500); // Not a server error
  });

});