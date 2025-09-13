import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, X, AlertTriangle } from 'lucide-react';

const PerformanceMonitor = ({ 
  enabled = process.env.NODE_ENV === 'development',
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [metrics, setMetrics] = useState({
    fps: 0,
    memory: null,
    renderTime: 0,
    componentCount: 0,
  });
  const isDev = typeof window !== 'undefined' && window.location.hostname === 'localhost';
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const measurePerformance = () => {
      const now = performance.now();
      frameCountRef.current++;

      if (now - lastTimeRef.current >= 1000) {
        const fps = Math.round((frameCountRef.current * 1000) / (now - lastTimeRef.current));
        const memory = performance.memory ? {
          used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
          total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
          limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024),
        } : null;

        setMetrics(prev => ({
          ...prev,
          fps,
          memory,
        }));

        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }

      animationFrameRef.current = requestAnimationFrame(measurePerformance);
    };

    animationFrameRef.current = requestAnimationFrame(measurePerformance);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyPress = (e) => {
      if (e.key === 'p' && e.ctrlKey) {
        e.preventDefault();
        setIsVisible(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [enabled]);

  if (!enabled || !isDev) return null;

  const getPerformanceColor = (fps) => {
    if (fps >= 55) return 'text-green-500';
    if (fps >= 45) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getMemoryColor = (used, total) => {
    const percentage = (used / total) * 100;
    if (percentage < 70) return 'text-green-500';
    if (percentage < 90) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className={`fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 min-w-64 ${className}`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-blue-500" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Performance Monitor
              </h3>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">FPS:</span>
              <span className={`font-mono font-semibold ${getPerformanceColor(metrics.fps)}`}>
                {metrics.fps}
              </span>
            </div>

            {metrics.memory && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Memory:</span>
                  <span className={`font-mono font-semibold ${getMemoryColor(metrics.memory.used, metrics.memory.total)}`}>
                    {metrics.memory.used}MB / {metrics.memory.total}MB
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                  <div
                    className={`h-1 rounded-full transition-all duration-300 ${
                      getMemoryColor(metrics.memory.used, metrics.memory.total).replace('text-', 'bg-')
                    }`}
                    style={{
                      width: `${(metrics.memory.used / metrics.memory.total) * 100}%`
                    }}
                  />
                </div>
              </>
            )}

            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Render Time:</span>
              <span className="font-mono font-semibold text-gray-900 dark:text-white">
                {metrics.renderTime}ms
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Components:</span>
              <span className="font-mono font-semibold text-gray-900 dark:text-white">
                {metrics.componentCount}
              </span>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Press <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">Ctrl+P</kbd> to toggle
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PerformanceMonitor;
