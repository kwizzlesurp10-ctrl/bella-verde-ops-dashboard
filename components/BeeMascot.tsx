'use client';
import { motion } from 'framer-motion';

export default function BeeMascot({ size = 64 }: { size?: number }) {
  return (
    <motion.div
      className="inline-block bee"
      animate={{
        x: [0, 120, 0],
        y: [0, -25, 0],
        rotate: [0, 12, -8, 0],
      }}
      transition={{
        duration: 4.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <span style={{ fontSize: size }} className="select-none">🐝</span>
    </motion.div>
  );
}