import React from 'react';
import { motion } from 'framer-motion';

export default function BlurText({
  text = '',
  delay = 0.05,
  className = '',
  animateBy = 'words' // 'words' | 'letters'
}) {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');

  return (
    <span className={`inline-block ${className}`}>
      {elements.map((element, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0.3, filter: 'blur(3px)', y: 6 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{
            duration: 0.35,
            delay: index * delay,
            ease: [0.2, 0.65, 0.3, 0.9]
          }}
          className="inline-block"
        >
          {element}
          {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
        </motion.span>
      ))}
    </span>
  );
}

