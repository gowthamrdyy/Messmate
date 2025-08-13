import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

// Animation variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 1.02,
  },
};

const reducedMotionVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 0 },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4,
};

const reducedMotionTransition = {
  duration: 0.2,
};

const PageTransition = ({ 
  children, 
  className = '',
  delay = 0,
  stagger = false,
  staggerDelay = 0.1 
}) => {
  const prefersReducedMotion = useReducedMotion();
  
  const variants = prefersReducedMotion ? reducedMotionVariants : pageVariants;
  const transition = prefersReducedMotion ? reducedMotionTransition : pageTransition;

  if (stagger) {
    return (
      <motion.div
        className={className}
        initial="initial"
        animate="in"
        exit="out"
        variants={variants}
        transition={{ ...transition, delay }}
      >
        {Array.isArray(children) ? (
          children.map((child, index) => (
            <motion.div
              key={index}
              variants={variants}
              transition={{ ...transition, delay: delay + (index * staggerDelay) }}
            >
              {child}
            </motion.div>
          ))
        ) : (
          children
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial="initial"
      animate="in"
      exit="out"
      variants={variants}
      transition={{ ...transition, delay }}
    >
      {children}
    </motion.div>
  );
};

// Specific transition components
export const FadeIn = ({ children, delay = 0, className = '' }) => {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ 
        duration: prefersReducedMotion ? 0.1 : 0.3, 
        delay: prefersReducedMotion ? 0 : delay 
      }}
    >
      {children}
    </motion.div>
  );
};

export const SlideUp = ({ children, delay = 0, className = '' }) => {
  const prefersReducedMotion = useReducedMotion();
  
  const variants = prefersReducedMotion 
    ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
    : { 
        initial: { opacity: 0, y: 30 }, 
        animate: { opacity: 1, y: 0 } 
      };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="initial"
      animate="animate"
      transition={{ 
        duration: prefersReducedMotion ? 0.1 : 0.4, 
        delay: prefersReducedMotion ? 0 : delay,
        ease: 'easeOut'
      }}
    >
      {children}
    </motion.div>
  );
};

export const ScaleIn = ({ children, delay = 0, className = '' }) => {
  const prefersReducedMotion = useReducedMotion();
  
  const variants = prefersReducedMotion 
    ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
    : { 
        initial: { opacity: 0, scale: 0.9 }, 
        animate: { opacity: 1, scale: 1 } 
      };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="initial"
      animate="animate"
      transition={{ 
        duration: prefersReducedMotion ? 0.1 : 0.3, 
        delay: prefersReducedMotion ? 0 : delay,
        ease: 'easeOut'
      }}
    >
      {children}
    </motion.div>
  );
};

export const StaggerContainer = ({ children, className = '', staggerDelay = 0.1 }) => {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.div
      className={className}
      initial="initial"
      animate="animate"
      variants={{
        initial: {},
        animate: {
          transition: {
            staggerChildren: prefersReducedMotion ? 0 : staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem = ({ children, className = '' }) => {
  const prefersReducedMotion = useReducedMotion();
  
  const variants = prefersReducedMotion 
    ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
    : { 
        initial: { opacity: 0, y: 20 }, 
        animate: { opacity: 1, y: 0 } 
      };

  return (
    <motion.div
      className={className}
      variants={variants}
      transition={{ duration: prefersReducedMotion ? 0.1 : 0.3 }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;