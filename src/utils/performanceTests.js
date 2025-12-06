/**
 * Performance testing utilities for the Messmate application
 */

/**
 * Measure component render time
 * @param {Function} renderFn - Function that renders the component
 * @param {number} iterations - Number of iterations to run
 * @returns {Object} Performance metrics
 */
export const measureRenderTime = (renderFn, iterations = 100) => {
  const times = [];
  
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    renderFn();
    const end = performance.now();
    times.push(end - start);
  }
  
  const avgTime = times.reduce((sum, time) => sum + time, 0) / times.length;
  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);
  
  return {
    average: avgTime,
    min: minTime,
    max: maxTime,
    total: times.reduce((sum, time) => sum + time, 0),
    iterations,
    times
  };
};

/**
 * Measure memory usage
 * @returns {Object} Memory metrics
 */
export const measureMemoryUsage = () => {
  if (!performance.memory) {
    return {
      available: false,
      message: 'Memory API not available'
    };
  }
  
  return {
    available: true,
    used: performance.memory.usedJSHeapSize,
    total: performance.memory.totalJSHeapSize,
    limit: performance.memory.jsHeapSizeLimit,
    usedMB: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
    totalMB: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
    limitMB: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024),
    percentage: Math.round((performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100)
  };
};

/**
 * Measure bundle size impact
 * @param {Function} importFn - Dynamic import function
 * @returns {Promise<Object>} Bundle size metrics
 */
export const measureBundleSize = async (importFn) => {
  const start = performance.now();
  const startMemory = performance.memory?.usedJSHeapSize || 0;
  
  try {
    const module = await importFn();
    const end = performance.now();
    const endMemory = performance.memory?.usedJSHeapSize || 0;
    
    return {
      success: true,
      loadTime: end - start,
      memoryIncrease: endMemory - startMemory,
      memoryIncreaseMB: Math.round((endMemory - startMemory) / 1024 / 1024),
      module
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      loadTime: performance.now() - start
    };
  }
};

/**
 * Performance benchmark for expensive operations
 * @param {Function} operation - Operation to benchmark
 * @param {number} iterations - Number of iterations
 * @returns {Object} Benchmark results
 */
export const benchmarkOperation = (operation, iterations = 1000) => {
  const results = [];
  
  // Warm up
  for (let i = 0; i < 10; i++) {
    operation();
  }
  
  // Actual benchmark
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    operation();
    const end = performance.now();
    results.push(end - start);
  }
  
  const sorted = results.sort((a, b) => a - b);
  const avg = results.reduce((sum, time) => sum + time, 0) / results.length;
  const median = sorted[Math.floor(sorted.length / 2)];
  const p95 = sorted[Math.floor(sorted.length * 0.95)];
  const p99 = sorted[Math.floor(sorted.length * 0.99)];
  
  return {
    iterations,
    average: avg,
    median,
    min: sorted[0],
    max: sorted[sorted.length - 1],
    p95,
    p99,
    total: results.reduce((sum, time) => sum + time, 0)
  };
};

/**
 * Test component re-render performance
 * @param {Function} renderComponent - Function that renders the component
 * @param {Array} propVariations - Array of different prop combinations
 * @returns {Object} Re-render performance metrics
 */
export const testReRenderPerformance = (renderComponent, propVariations) => {
  const results = [];
  
  propVariations.forEach((props, index) => {
    const result = measureRenderTime(() => renderComponent(props), 50);
    results.push({
      variation: index,
      props,
      ...result
    });
  });
  
  const totalAvg = results.reduce((sum, result) => sum + result.average, 0) / results.length;
  
  return {
    variations: results.length,
    totalAverage: totalAvg,
    results,
    best: results.reduce((best, current) => 
      current.average < best.average ? current : best
    ),
    worst: results.reduce((worst, current) => 
      current.average > worst.average ? current : worst
    )
  };
};

/**
 * Performance monitoring class for continuous measurement
 */
export class PerformanceMonitor {
  constructor() {
    this.metrics = {
      fps: [],
      memory: [],
      renderTimes: [],
      timestamps: []
    };
    this.isRunning = false;
    this.intervalId = null;
  }
  
  start(intervalMs = 1000) {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.intervalId = setInterval(() => {
      this.recordMetrics();
    }, intervalMs);
  }
  
  stop() {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
  
  recordMetrics() {
    const timestamp = Date.now();
    
    // Record memory usage
    if (performance.memory) {
      this.metrics.memory.push({
        timestamp,
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
      });
    }
    
    this.metrics.timestamps.push(timestamp);
  }
  
  getMetrics() {
    return {
      ...this.metrics,
      summary: this.calculateSummary()
    };
  }
  
  calculateSummary() {
    if (this.metrics.memory.length === 0) return null;
    
    const memoryUsage = this.metrics.memory.map(m => m.used);
    const avgMemory = memoryUsage.reduce((sum, used) => sum + used, 0) / memoryUsage.length;
    const maxMemory = Math.max(...memoryUsage);
    const minMemory = Math.min(...memoryUsage);
    
    return {
      avgMemoryMB: Math.round(avgMemory / 1024 / 1024),
      maxMemoryMB: Math.round(maxMemory / 1024 / 1024),
      minMemoryMB: Math.round(minMemory / 1024 / 1024),
      samples: this.metrics.memory.length
    };
  }
  
  clear() {
    this.metrics = {
      fps: [],
      memory: [],
      renderTimes: [],
      timestamps: []
    };
  }
}

export default {
  measureRenderTime,
  measureMemoryUsage,
  measureBundleSize,
  benchmarkOperation,
  testReRenderPerformance,
  PerformanceMonitor
};
