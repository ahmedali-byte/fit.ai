// FitLife AI - Reusable Glassmorphism Card
'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowOnHover?: boolean;
  onClick?: () => void;
  delay?: number;
}

export default function GlassCard({
  children,
  className = '',
  glowOnHover = false,
  onClick,
  delay = 0
}: GlassCardProps) {
  const cardClasses = `glass-panel rounded-2xl p-6 transition-all duration-300 relative overflow-hidden ${
    onClick ? 'cursor-pointer select-none' : ''
  } ${
    glowOnHover
      ? 'hover:border-brand-emerald/40 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]'
      : ''
  } ${className}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      onClick={onClick}
      className={cardClasses}
    >
      {/* Subtle top reflection highlights */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/5" />
      {children}
    </motion.div>
  );
}
