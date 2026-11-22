import React from 'react';
import { motion } from 'framer-motion';

export default function AnimatedList({
  children,
  className = '',
  staggerDelay = 0.08
}) {
  const items = React.Children.toArray(children);

  return (
    <div className={className}>
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: index * staggerDelay,
            ease: 'easeOut'
          }}
        >
          {item}
        </motion.div>
      ))}
    </div>
  );
}

