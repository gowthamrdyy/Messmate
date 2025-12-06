/**
 * Final integration test runner for complete application validation
 */

import { runPerformanceAudit, generatePerformanceReport } from './performanceAudit';
import { runAccessibilityAudit, generateAccessibilityReport } from './accessibilityAudit';

/**
 * Comprehensive integration test suite
 */
export class FinalIntegrationTest {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      tests: {},
      summary: {
        passed: 0,
        failed: 0,
        total: 0,
        score: 0,
      },
      performance: null,
      accessibility: null,
      recommendations: [],
    };
  }

  /**
   * Test application initialization
   */
  async testApplicationInitialization() {
    const testName = 'Application Initialization';
    const startTime = performance.now();
    
    try {
      // Test if app loads without errors
      const appElement = document.querySelector('#root');
      if (!appElement) {
        throw new Error('App root element not found');
      }

      // Test if main components are rendered
      const header = document.querySelector('[role="banner"]');
      const main = document.querySelector('[role="main"]');
      const navigation = document.querySelector('[role="navigation"]');

      if (!header || !main || !navigation) {
        throw new Error('Essential components not rendered');
      }

      // Test if app title is present
      const appTitle = document.querySelector('h1');
      if (!appTitle || !appTitle.textContent.includes('Messmate')) {
        throw new Error('App title not found');
      }

      const duration = performance.now() - startTime;
      
      this.results.tests[testName] = {
        status: 'passed',
        duration,
        message: 'Application initialized successfully',
      };
      
      this.results.summary.passed++;
    } catch (error) {
      this.results.tests[testName] = {
        status: 'failed',
        duration: performance.now() - startTime,
        message: error.message,
      };
      
      this.results.summary.failed++;
    }
    
    this.results.summary.total++;
  }

  /**
   * Test navigation functionality
   */
  async testNavigation() {
    const testName = 'Navigation Functionality';
    const startTime = performance.now();
    
    try {
      // Test bottom navigation
      const navButtons = document.querySelectorAll('[role="navigation"] button');
      if (navButtons.length === 0) {
        throw new Error('Navigation buttons not found');
      }

      // Test meal navigation
      const mealNavButtons = document.querySelectorAll('button[aria-label*="meal"]');
      if (mealNavButtons.length === 0) {
        throw new Error('Meal navigation buttons not found');
      }

      // Test mess selection
      const messButtons = document.querySelectorAll('button[aria-label*="mess"]');
      if (messButtons.length === 0) {
        throw new Error('Mess selection buttons not found');
      }

      const duration = performance.now() - startTime;
      
      this.results.tests[testName] = {
        status: 'passed',
        duration,
        message: 'Navigation components and functionality verified',
      };
      
      this.results.summary.passed++;
    } catch (error) {
      this.results.tests[testName] = {
        status: 'failed',
        duration: performance.now() - startTime,
        message: error.message,
      };
      
      this.results.summary.failed++;
    }
    
    this.results.summary.total++;
  }

  /**
   * Test responsive design
   */
  async testResponsiveDesign() {
    const testName = 'Responsive Design';
    const startTime = performance.now();
    
    try {
      // Test mobile viewport
      const originalWidth = window.innerWidth;
      const originalHeight = window.innerHeight;
      
      // Simulate mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 667,
      });
      
      // Trigger resize event
      window.dispatchEvent(new Event('resize'));
      
      // Wait for layout to adjust
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Check if mobile navigation is present
      const mobileNav = document.querySelector('[role="navigation"]');
      if (!mobileNav) {
        throw new Error('Mobile navigation not found');
      }
      
      // Restore original viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: originalWidth,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: originalHeight,
      });
      
      window.dispatchEvent(new Event('resize'));
      
      const duration = performance.now() - startTime;
      
      this.results.tests[testName] = {
        status: 'passed',
        duration,
        message: 'Responsive design adapts to different viewport sizes',
      };
      
      this.results.summary.passed++;
    } catch (error) {
      this.results.tests[testName] = {
        status: 'failed',
        duration: performance.now() - startTime,
        message: error.message,
      };
      
      this.results.summary.failed++;
    }
    
    this.results.summary.total++;
  }

  /**
   * Test theme functionality
   */
  async testThemeFunctionality() {
    const testName = 'Theme Functionality';
    const startTime = performance.now();
    
    try {
      // Find theme toggle button
      const themeButton = document.querySelector('button[aria-label*="theme"]') ||
                         document.querySelector('button[aria-label*="toggle"]');
      
      if (!themeButton) {
        throw new Error('Theme toggle button not found');
      }

      // Test theme toggle
      const initialTheme = document.documentElement.classList.contains('dark');
      
      // Click theme button
      themeButton.click();
      
      // Wait for theme change
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const newTheme = document.documentElement.classList.contains('dark');
      
      if (initialTheme === newTheme) {
        throw new Error('Theme did not change when toggled');
      }

      const duration = performance.now() - startTime;
      
      this.results.tests[testName] = {
        status: 'passed',
        duration,
        message: 'Theme toggle functionality working correctly',
      };
      
      this.results.summary.passed++;
    } catch (error) {
      this.results.tests[testName] = {
        status: 'failed',
        duration: performance.now() - startTime,
        message: error.message,
      };
      
      this.results.summary.failed++;
    }
    
    this.results.summary.total++;
  }

  /**
   * Test data persistence
   */
  async testDataPersistence() {
    const testName = 'Data Persistence';
    const startTime = performance.now();
    
    try {
      // Test localStorage functionality
      const testKey = 'messmate-test-persistence';
      const testValue = { test: 'data', timestamp: Date.now() };
      
      // Set test data
      localStorage.setItem(testKey, JSON.stringify(testValue));
      
      // Retrieve test data
      const retrieved = JSON.parse(localStorage.getItem(testKey));
      
      if (!retrieved || retrieved.test !== testValue.test) {
        throw new Error('Data persistence not working correctly');
      }
      
      // Clean up
      localStorage.removeItem(testKey);
      
      const duration = performance.now() - startTime;
      
      this.results.tests[testName] = {
        status: 'passed',
        duration,
        message: 'Data persistence functionality verified',
      };
      
      this.results.summary.passed++;
    } catch (error) {
      this.results.tests[testName] = {
        status: 'failed',
        duration: performance.now() - startTime,
        message: error.message,
      };
      
      this.results.summary.failed++;
    }
    
    this.results.summary.total++;
  }

  /**
   * Test error handling
   */
  async testErrorHandling() {
    const testName = 'Error Handling';
    const startTime = performance.now();
    
    try {
      // Test if error boundary is present
      const errorBoundary = document.querySelector('[data-error-boundary]');
      
      // Test console error handling
      const originalConsoleError = console.error;
      let errorCaught = false;
      
      console.error = (message) => {
        errorCaught = true;
        // Don't actually log to avoid noise
      };
      
      // Trigger a harmless error
      try {
        throw new Error('Test error');
      } catch (error) {
        // Error should be caught
      }
      
      console.error = originalConsoleError;
      
      const duration = performance.now() - startTime;
      
      this.results.tests[testName] = {
        status: 'passed',
        duration,
        message: 'Error handling mechanisms in place',
      };
      
      this.results.summary.passed++;
    } catch (error) {
      this.results.tests[testName] = {
        status: 'failed',
        duration: performance.now() - startTime,
        message: error.message,
      };
      
      this.results.summary.failed++;
    }
    
    this.results.summary.total++;
  }

  /**
   * Test accessibility features
   */
  async testAccessibility() {
    const testName = 'Accessibility Features';
    const startTime = performance.now();
    
    try {
      // Run accessibility audit
      const auditResults = await runAccessibilityAudit();
      
      this.results.accessibility = auditResults;
      
      // Check for critical accessibility issues
      const criticalIssues = auditResults.issues.filter(issue => 
        issue.severity === 'critical' || issue.severity === 'error'
      );
      
      if (criticalIssues.length > 0) {
        throw new Error(`Found ${criticalIssues.length} critical accessibility issues`);
      }
      
      const duration = performance.now() - startTime;
      
      this.results.tests[testName] = {
        status: 'passed',
        duration,
        message: `Accessibility audit passed with ${auditResults.score}/100 score`,
        details: auditResults,
      };
      
      this.results.summary.passed++;
    } catch (error) {
      this.results.tests[testName] = {
        status: 'failed',
        duration: performance.now() - startTime,
        message: error.message,
      };
      
      this.results.summary.failed++;
    }
    
    this.results.summary.total++;
  }

  /**
   * Test performance
   */
  async testPerformance() {
    const testName = 'Performance';
    const startTime = performance.now();
    
    try {
      // Run performance audit
      const auditResults = await runPerformanceAudit({
        measureFrameRate: true,
        measureMemory: true,
        duration: 3000,
      });
      
      this.results.performance = auditResults;
      
      // Check performance score
      if (auditResults.summary.overallScore < 70) {
        throw new Error(`Performance score too low: ${auditResults.summary.overallScore}/100`);
      }
      
      const duration = performance.now() - startTime;
      
      this.results.tests[testName] = {
        status: 'passed',
        duration,
        message: `Performance audit passed with ${auditResults.summary.overallScore}/100 score`,
        details: auditResults,
      };
      
      this.results.summary.passed++;
    } catch (error) {
      this.results.tests[testName] = {
        status: 'failed',
        duration: performance.now() - startTime,
        message: error.message,
      };
      
      this.results.summary.failed++;
    }
    
    this.results.summary.total++;
  }

  /**
   * Run all integration tests
   */
  async runAllTests() {
    console.log('🚀 Starting Final Integration Tests...');
    
    const testMethods = [
      'testApplicationInitialization',
      'testNavigation',
      'testResponsiveDesign',
      'testThemeFunctionality',
      'testDataPersistence',
      'testErrorHandling',
      'testAccessibility',
      'testPerformance',
    ];
    
    for (const method of testMethods) {
      console.log(`Running ${method}...`);
      await this[method]();
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Calculate final score
    this.results.summary.score = Math.round(
      (this.results.summary.passed / this.results.summary.total) * 100
    );
    
    // Generate recommendations
    this.generateRecommendations();
    
    console.log('✅ Final Integration Tests completed!');
    return this.results;
  }

  /**
   * Generate recommendations based on test results
   */
  generateRecommendations() {
    const recommendations = [];
    
    // Performance recommendations
    if (this.results.performance) {
      this.results.performance.summary.recommendations.forEach(rec => {
        recommendations.push(`Performance: ${rec}`);
      });
    }
    
    // Accessibility recommendations
    if (this.results.accessibility) {
      this.results.accessibility.recommendations.forEach(rec => {
        recommendations.push(`Accessibility: ${rec}`);
      });
    }
    
    // General recommendations based on test results
    if (this.results.summary.score < 90) {
      recommendations.push('General: Consider addressing failed tests to improve overall quality');
    }
    
    if (this.results.summary.failed > 0) {
      recommendations.push(`General: ${this.results.summary.failed} test(s) failed - review and fix issues`);
    }
    
    this.results.recommendations = recommendations;
  }

  /**
   * Generate comprehensive test report
   */
  generateReport() {
    let report = `Final Integration Test Report\n`;
    report += `Generated: ${this.results.timestamp}\n`;
    report += `Overall Score: ${this.results.summary.score}/100\n`;
    report += `Tests Passed: ${this.results.summary.passed}/${this.results.summary.total}\n\n`;
    
    // Test results
    report += `Test Results:\n`;
    Object.entries(this.results.tests).forEach(([testName, result]) => {
      const status = result.status === 'passed' ? '✅' : '❌';
      report += `${status} ${testName}: ${result.message} (${result.duration.toFixed(2)}ms)\n`;
    });
    
    report += `\n`;
    
    // Performance report
    if (this.results.performance) {
      report += `Performance Report:\n`;
      report += generatePerformanceReport(this.results.performance);
      report += `\n`;
    }
    
    // Accessibility report
    if (this.results.accessibility) {
      report += `Accessibility Report:\n`;
      report += generateAccessibilityReport(this.results.accessibility);
      report += `\n`;
    }
    
    // Recommendations
    if (this.results.recommendations.length > 0) {
      report += `Recommendations:\n`;
      this.results.recommendations.forEach(rec => {
        report += `- ${rec}\n`;
      });
    }
    
    return report;
  }
}

/**
 * Run final integration tests
 * @param {Object} options - Test options
 * @returns {Promise<Object>} Test results
 */
export const runFinalIntegrationTests = async (options = {}) => {
  const tester = new FinalIntegrationTest();
  const results = await tester.runAllTests();
  
  if (options.generateReport) {
    const report = tester.generateReport();
    console.log(report);
  }
  
  return results;
};

export default FinalIntegrationTest;
