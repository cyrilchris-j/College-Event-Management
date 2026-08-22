import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface MagnetButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  magnetStrength?: number;
  className?: string;
}

export function MagnetButton({
  children,
  magnetStrength = 0.3,
  className = '',
  ...props
}: MagnetButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const x = (e.clientX - centerX) * magnetStrength;
    const y = (e.clientY - centerY) * magnetStrength;

    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 15, mass: 0.1 }}
      className={className}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
}
