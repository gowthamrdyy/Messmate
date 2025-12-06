/**
 * Performance audit utility for final optimization
 */

/**
 * Measure component render performance
 * @param {Function} renderFn - Function that renders the component
 * @param {number} iterations - Number of iterations to run
 * @returns {Object} Performance metrics
 */
export const measureComponentPerformance = (renderFn, iterations = 100) => {
  const times = [];
  const memoryUsage = [];
  
  // Warm up
  for (let i = 0; i < 10; i++) {
    renderFn();
  }
  
  // Measure performance
  for (let i = 0; i < iterations; i++) {
    const startTime = performance.now();
    const startMemory = performance.memory?.usedJSHeapSize || 0;
    
    renderFn();
    
    const endTime = performance.now();
    const endMemory = performance.memory?.usedJSHeapSize || 0;
    
    times.push(endTime - startTime);
    memoryUsage.push(endMemory - startMemory);
  }
  
  const avgTime = times.reduce((sum, time) => sum + time, 0) / times.length;
  const avgMemory = memoryUsage.reduce((sum, mem) => sum + mem, 0) / memoryUsage.length;
  
  return {
    renderTime: {
      average: avgTime,
      min: Math.min(...times),
      max: Math.max(...times),
      p95: times.sort((a, b) => a - b)[Math.floor(times.length * 0.95)],
      p99: times.sort((a, b) => a - b)[Math.floor(times.length * 0.99)],
    },
    memoryUsage: {
      average: avgMemory,
      min: Math.min(...memoryUsage),
      max: Math.max(...memoryUsage),
    },
    iterations,
  };
};

/**
 * Measure bundle size impact
 * @param {Object} bundleStats - Bundle statistics
 * @returns {Object} Bundle analysis
 */
export const analyzeBundleSize = (bundleStats) => {
  const analysis = {
    totalSize: 0,
    totalGzipped: 0,
    chunks: [],
    largestChunks: [],
    optimizationOpportunities: [],
  };
  
  if (bundleStats && bundleStats.chunks) {
    bundleStats.chunks.forEach(chunk => {
      const size = chunk.size || 0;
      const gzipped = chunk.gzipped || 0;
      
      analysis.totalSize += size;
      analysis.totalGzipped += gzipped;
      
      analysis.chunks.push({
        name: chunk.name,
        size: size,
        gzipped: gzipped,
        percentage: 0,
      });
    });
    
    // Calculate percentages
    analysis.chunks.forEach(chunk => {
      chunk.percentage = (chunk.size / analysis.totalSize) * 100;
    });
    
    // Sort by size
    analysis.chunks.sort((a, b) => b.size - a.size);
    analysis.largestChunks = analysis.chunks.slice(0, 5);
    
    // Identify optimization opportunities
    analysis.chunks.forEach(chunk => {
      if (chunk.size > 500 * 1024) { // 500KB
        analysis.optimizationOpportunities.push({
          chunk: chunk.name,
          issue: 'Large chunk size',
          recommendation: 'Consider code splitting or lazy loading',
          size: chunk.size,
        });
      }
    });
  }
  
  return analysis;
};

/**
 * Measure runtime performance metrics
 * @returns {Object} Runtime performance data
 */
export const measureRuntimePerformance = () => {
  const metrics = {
    timestamp: Date.now(),
    memory: null,
    timing: null,
    performance: null,
  };
  
  // Memory usage
  if (performance.memory) {
    metrics.memory = {
      used: performance.memory.usedJSHeapSize,
      total: performance.memory.totalJSHeapSize,
      limit: performance.memory.jsHeapSizeLimit,
      usedMB: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
      totalMB: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
      limitMB: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024),
      percentage: Math.round((performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100),
    };
  }
  
  // Navigation timing
  if (performance.timing) {
    const timing = performance.timing;
    metrics.timing = {
      domContentLoaded: timing.domContentLoadedEventEnd - timing.domContentLoadedEventStart,
      loadComplete: timing.loadEventEnd - timing.loadEventStart,
      domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
      fullLoad: timing.loadEventEnd - timing.navigationStart,
    };
  }
  
  // Performance marks
  if (performance.getEntriesByType) {
    const marks = performance.getEntriesByType('mark');
    const measures = performance.getEntriesByType('measure');
    
    metrics.performance = {
      marks: marks.map(mark => ({
        name: mark.name,
        startTime: mark.startTime,
        duration: mark.duration,
      })),
      measures: measures.map(measure => ({
        name: measure.name,
        startTime: measure.startTime,
        duration: measure.duration,
      })),
    };
  }
  
  return metrics;
};

/**
 * Monitor frame rate and smoothness
 * @param {number} duration - Duration to monitor in milliseconds
 * @returns {Promise<Object>} Frame rate metrics
 */
export const monitorFrameRate = (duration = 5000) => {
  return new Promise((resolve) => {
    const startTime = performance.now();
    let frameCount = 0;
    const frameTimes = [];
    let lastFrameTime = startTime;
    
    const measureFrame = (currentTime) => {
      frameCount++;
      const frameTime = currentTime - lastFrameTime;
      frameTimes.push(frameTime);
      lastFrameTime = currentTime;
      
      if (currentTime - startTime < duration) {
        requestAnimationFrame(measureFrame);
      } else {
        const avgFrameTime = frameTimes.reduce((sum, time) => sum + time, 0) / frameTimes.length;
        const fps = 1000 / avgFrameTime;
        
        resolve({
          fps: Math.round(fps),
          avgFrameTime: Math.round(avgFrameTime),
          frameCount,
          duration: currentTime - startTime,
          frameTimes,
          smoothness: fps >= 55 ? 'excellent' : fps >= 45 ? 'good' : fps >= 30 ? 'acceptable' : 'poor',
        });
      }
    };
    
    requestAnimationFrame(measureFrame);
  });
};

/**
 * Measure interaction responsiveness
 * @param {Function} interactionFn - Function to test
 * @param {number} iterations - Number of iterations
 * @returns {Object} Responsiveness metrics
 */
export const measureInteractionResponsiveness = (interactionFn, iterations = 50) => {
  const responseTimes = [];
  const longTasks = [];
  
  for (let i = 0; i < iterations; i++) {
    const startTime = performance.now();
    
    interactionFn();
    
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    
    responseTimes.push(responseTime);
    
    if (responseTime > 16.67) { // Longer than one frame at 60fps
      longTasks.push({
        iteration: i,
        duration: responseTime,
        timestamp: startTime,
      });
    }
  }
  
  const avgResponseTime = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
  
  return {
    averageResponseTime: avgResponseTime,
    minResponseTime: Math.min(...responseTimes),
    maxResponseTime: Math.max(...responseTimes),
    p95ResponseTime: responseTimes.sort((a, b) => a - b)[Math.floor(responseTimes.length * 0.95)],
    longTasks,
    longTaskPercentage: (longTasks.length / iterations) * 100,
    responsiveness: avgResponseTime < 16.67 ? 'excellent' : avgResponseTime < 50 ? 'good' : avgResponseTime < 100 ? 'acceptable' : 'poor',
  };
};

/**
 * Analyze component re-render patterns
 * @param {Array} renderLogs - Array of render logs
 * @returns {Object} Re-render analysis
 */
export const analyzeReRenderPatterns = (renderLogs) => {
  const analysis = {
    totalRenders: renderLogs.length,
    components: {},
    unnecessaryRenders: 0,
    optimizationOpportunities: [],
  };
  
  renderLogs.forEach(log => {
    const { component, props, timestamp, reason } = log;
    
    if (!analysis.components[component]) {
      analysis.components[component] = {
        renders: 0,
        avgTimeBetweenRenders: 0,
        lastRender: null,
        propChanges: [],
      };
    }
    
    const componentData = analysis.components[component];
    componentData.renders++;
    
    if (componentData.lastRender) {
      const timeBetween = timestamp - componentData.lastRender;
      componentData.avgTimeBetweenRenders = 
        (componentData.avgTimeBetweenRenders * (componentData.renders - 1) + timeBetween) / componentData.renders;
    }
    
    componentData.lastRender = timestamp;
    componentData.propChanges.push({ props, reason, timestamp });
    
    // Identify unnecessary re-renders
    if (reason === 'parent_render' && componentData.renders > 10) {
      analysis.unnecessaryRenders++;
      analysis.optimizationOpportunities.push({
        component,
        issue: 'Frequent re-renders due to parent updates',
        recommendation: 'Consider React.memo or useMemo',
        renderCount: componentData.renders,
      });
    }
  });
  
  return analysis;
};

/**
 * Comprehensive performance audit
 * @param {Object} options - Audit options
 * @returns {Object} Complete audit results
 */
export const runPerformanceAudit = async (options = {}) => {
  const {
    measureFrameRate = true,
    measureMemory = true,
    analyzeBundle = true,
    duration = 5000,
  } = options;
  
  const audit = {
    timestamp: new Date().toISOString(),
    summary: {
      overallScore: 0,
      issues: [],
      recommendations: [],
    },
    metrics: {},
  };
  
  // Runtime performance
  if (measureMemory) {
    audit.metrics.runtime = measureRuntimePerformance();
  }
  
  // Frame rate monitoring
  if (measureFrameRate) {
    audit.metrics.frameRate = await monitorFrameRate(duration);
  }
  
  // Bundle analysis (if available)
  if (analyzeBundle && window.__BUNDLE_STATS__) {
    audit.metrics.bundle = analyzeBundleSize(window.__BUNDLE_STATS__);
  }
  
  // Calculate overall score
  let score = 100;
  const issues = [];
  const recommendations = [];
  
  // Frame rate scoring
  if (audit.metrics.frameRate) {
    if (audit.metrics.frameRate.fps < 30) {
      score -= 30;
      issues.push('Low frame rate affecting user experience');
      recommendations.push('Optimize animations and reduce JavaScript execution time');
    } else if (audit.metrics.frameRate.fps < 55) {
      score -= 15;
      issues.push('Suboptimal frame rate');
      recommendations.push('Consider reducing animation complexity');
    }
  }
  
  // Memory usage scoring
  if (audit.metrics.runtime?.memory) {
    const memoryUsage = audit.metrics.runtime.memory.percentage;
    if (memoryUsage > 90) {
      score -= 25;
      issues.push('High memory usage');
      recommendations.push('Investigate memory leaks and optimize data structures');
    } else if (memoryUsage > 70) {
      score -= 10;
      issues.push('Elevated memory usage');
      recommendations.push('Monitor memory usage and consider optimizations');
    }
  }
  
  // Bundle size scoring
  if (audit.metrics.bundle) {
    const totalSize = audit.metrics.bundle.totalSize;
    if (totalSize > 2 * 1024 * 1024) { // 2MB
      score -= 20;
      issues.push('Large bundle size');
      recommendations.push('Implement code splitting and lazy loading');
    } else if (totalSize > 1024 * 1024) { // 1MB
      score -= 10;
      issues.push('Moderate bundle size');
      recommendations.push('Consider bundle optimization');
    }
  }
  
  audit.summary.overallScore = Math.max(0, score);
  audit.summary.issues = issues;
  audit.summary.recommendations = recommendations;
  
  return audit;
};

/**
 * Generate performance report
 * @param {Object} auditResults - Results from runPerformanceAudit
 * @returns {string} Formatted report
 */
export const generatePerformanceReport = (auditResults) => {
  const { summary, metrics } = auditResults;
  
  let report = `Performance Audit Report\n`;
  report += `Generated: ${auditResults.timestamp}\n`;
  report += `Overall Score: ${summary.overallScore}/100\n\n`;
  
  if (summary.issues.length > 0) {
    report += `Issues Found:\n`;
    summary.issues.forEach(issue => {
      report += `- ${issue}\n`;
    });
    report += `\n`;
  }
  
  if (summary.recommendations.length > 0) {
    report += `Recommendations:\n`;
    summary.recommendations.forEach(rec => {
      report += `- ${rec}\n`;
    });
    report += `\n`;
  }
  
  if (metrics.frameRate) {
    report += `Frame Rate:\n`;
    report += `- FPS: ${metrics.frameRate.fps}\n`;
    report += `- Average Frame Time: ${metrics.frameRate.avgFrameTime}ms\n`;
    report += `- Smoothness: ${metrics.frameRate.smoothness}\n\n`;
  }
  
  if (metrics.runtime?.memory) {
    report += `Memory Usage:\n`;
    report += `- Used: ${metrics.runtime.memory.usedMB}MB\n`;
    report += `- Total: ${metrics.runtime.memory.totalMB}MB\n`;
    report += `- Limit: ${metrics.runtime.memory.limitMB}MB\n`;
    report += `- Usage: ${metrics.runtime.memory.percentage}%\n\n`;
  }
  
  if (metrics.bundle) {
    report += `Bundle Analysis:\n`;
    report += `- Total Size: ${Math.round(metrics.bundle.totalSize / 1024)}KB\n`;
    report += `- Gzipped: ${Math.round(metrics.bundle.totalGzipped / 1024)}KB\n`;
    report += `- Chunks: ${metrics.bundle.chunks.length}\n\n`;
    
    if (metrics.bundle.largestChunks.length > 0) {
      report += `Largest Chunks:\n`;
      metrics.bundle.largestChunks.forEach(chunk => {
        report += `- ${chunk.name}: ${Math.round(chunk.size / 1024)}KB (${chunk.percentage.toFixed(1)}%)\n`;
      });
      report += `\n`;
    }
  }
  
  return report;
};

export default {
  measureComponentPerformance,
  analyzeBundleSize,
  measureRuntimePerformance,
  monitorFrameRate,
  measureInteractionResponsiveness,
  analyzeReRenderPatterns,
  runPerformanceAudit,
  generatePerformanceReport,
};
