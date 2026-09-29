import React from 'react';
import { motion } from 'framer-motion';

interface ModuleRevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export const ModuleReveal: React.FC<ModuleRevealProps> = ({ children, delay = 0, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 45 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.65, delay, ease: [0.25, 1, 0.5, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
