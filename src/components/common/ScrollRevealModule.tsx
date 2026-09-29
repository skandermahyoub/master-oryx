import React from 'react';
import { motion } from 'motion/react';

interface ScrollRevealModuleProps {
  children: React.ReactNode;
  delay?: number;
}

export const ScrollRevealModule: React.FC<ScrollRevealModuleProps> = ({
  children,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.7,
        ease: [0.21, 0.47, 0.32, 0.98],
        delay: delay,
      }}
    >
      {children}
    </motion.div>
  );
};
