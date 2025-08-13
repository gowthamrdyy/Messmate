import {
  measureRenderTime,
  measureMemoryUsage,
  benchmarkOperation,
  testReRenderPerformance,
  PerformanceMonitor
} from '../performanceTests';

// Mock performance API
const mockPerformance = {
  now: jest.fn(() => Date.now()),
  memory: {
    usedJSHeapSize: 1024 * 1024 * 50, // 50MB
    totalJSHeapSize: 1024 * 1024 * 100, // 100MB
    jsHeapSizeLimit: 1024 * 1024 * 200, // 200MB
  }
};

global.performance = mockPerformance;

describe('Performance Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('measureRenderTime', () => {
    it('should measure render time correctly', () => {
      const mockRenderFn = jest.fn();
      const result = measureRenderTime(mockRenderFn, 5);

      expect(mockRenderFn).toHaveBeenCalledTimes(5);
      expect(result).toHaveProperty('average');
      expect(result).toHaveProperty('min');
      expect(result).toHaveProperty('max');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('iterations', 5);
      expect(result).toHaveProperty('times');
      expect(result.times).toHaveLength(5);
    });

    it('should handle empty render function', () => {
      const result = measureRenderTime(() => {}, 1);
      expect(result.average).toBeGreaterThanOrEqual(0);
    });
  });

  describe('measureMemoryUsage', () => {
    it('should return memory metrics when API is available', () => {
      const result = measureMemoryUsage();

      expect(result.available).toBe(true);
      expect(result.used).toBe(1024 * 1024 * 50);
      expect(result.total).toBe(1024 * 1024 * 100);
      expect(result.limit).toBe(1024 * 1024 * 200);
      expect(result.usedMB).toBe(50);
      expect(result.totalMB).toBe(100);
      expect(result.limitMB).toBe(200);
      expect(result.percentage).toBe(25);
    });

    it('should handle missing memory API', () => {
      const originalMemory = performance.memory;
      delete performance.memory;

      const result = measureMemoryUsage();

      expect(result.available).toBe(false);
      expect(result.message).toBe('Memory API not available');

      // Restore
      performance.memory = originalMemory;
    });
  });

  describe('benchmarkOperation', () => {
    it('should benchmark operation correctly', () => {
      const mockOperation = jest.fn();
      const result = benchmarkOperation(mockOperation, 10);

      expect(mockOperation).toHaveBeenCalledTimes(20); // 10 warmup + 10 actual
      expect(result).toHaveProperty('iterations', 10);
      expect(result).toHaveProperty('average');
      expect(result).toHaveProperty('median');
      expect(result).toHaveProperty('min');
      expect(result).toHaveProperty('max');
      expect(result).toHaveProperty('p95');
      expect(result).toHaveProperty('p99');
      expect(result).toHaveProperty('total');
    });

    it('should handle expensive operations', () => {
      const expensiveOperation = () => {
        let sum = 0;
        for (let i = 0; i < 1000; i++) {
          sum += Math.random();
        }
        return sum;
      };

      const result = benchmarkOperation(expensiveOperation, 5);
      expect(result.average).toBeGreaterThan(0);
      expect(result.total).toBeGreaterThan(0);
    });
  });

  describe('testReRenderPerformance', () => {
    it('should test re-render performance with different props', () => {
      const mockRenderComponent = jest.fn();
      const propVariations = [
        { name: 'test1', items: ['a', 'b'] },
        { name: 'test2', items: ['c', 'd', 'e'] },
        { name: 'test3', items: ['f'] }
      ];

      const result = testReRenderPerformance(mockRenderComponent, propVariations);

      expect(result.variations).toBe(3);
      expect(result).toHaveProperty('totalAverage');
      expect(result).toHaveProperty('results');
      expect(result).toHaveProperty('best');
      expect(result).toHaveProperty('worst');
      expect(result.results).toHaveLength(3);
    });

    it('should handle empty prop variations', () => {
      const mockRenderComponent = jest.fn();
      const result = testReRenderPerformance(mockRenderComponent, []);

      expect(result.variations).toBe(0);
      expect(result.totalAverage).toBe(0);
      expect(result.results).toHaveLength(0);
    });
  });

  describe('PerformanceMonitor', () => {
    let monitor;

    beforeEach(() => {
      monitor = new PerformanceMonitor();
    });

    it('should start and stop monitoring', () => {
      expect(monitor.isRunning).toBe(false);
      
      monitor.start();
      expect(monitor.isRunning).toBe(true);
      
      monitor.stop();
      expect(monitor.isRunning).toBe(false);
    });

    it('should record metrics when running', () => {
      monitor.start(100);
      
      // Wait for metrics to be recorded
      return new Promise(resolve => {
        setTimeout(() => {
          monitor.stop();
          const metrics = monitor.getMetrics();
          
          expect(metrics.memory.length).toBeGreaterThan(0);
          expect(metrics.timestamps.length).toBeGreaterThan(0);
          expect(metrics.summary).toBeTruthy();
          
          resolve();
        }, 150);
      });
    });

    it('should calculate summary correctly', () => {
      // Manually add some metrics
      monitor.metrics.memory = [
        { timestamp: 1000, used: 1024 * 1024 * 50, total: 1024 * 1024 * 100, limit: 1024 * 1024 * 200 },
        { timestamp: 2000, used: 1024 * 1024 * 60, total: 1024 * 1024 * 100, limit: 1024 * 1024 * 200 },
        { timestamp: 3000, used: 1024 * 1024 * 40, total: 1024 * 1024 * 100, limit: 1024 * 1024 * 200 }
      ];

      const summary = monitor.calculateSummary();
      
      expect(summary.avgMemoryMB).toBe(50);
      expect(summary.maxMemoryMB).toBe(60);
      expect(summary.minMemoryMB).toBe(40);
      expect(summary.samples).toBe(3);
    });

    it('should clear metrics', () => {
      monitor.metrics.memory = [{ timestamp: 1000, used: 1000 }];
      monitor.metrics.timestamps = [1000];
      
      monitor.clear();
      
      expect(monitor.metrics.memory).toHaveLength(0);
      expect(monitor.metrics.timestamps).toHaveLength(0);
    });

    it('should not start if already running', () => {
      monitor.start();
      const originalIntervalId = monitor.intervalId;
      
      monitor.start();
      
      expect(monitor.intervalId).toBe(originalIntervalId);
    });

    it('should not stop if not running', () => {
      monitor.stop();
      expect(monitor.isRunning).toBe(false);
    });
  });
});
