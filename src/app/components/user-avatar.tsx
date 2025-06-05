/* eslint-disable @next/next/no-img-element */
'use client';

import { motion } from 'framer-motion';

type Props = {
  src: string;
  size?: number;
  layoutId: string;
  alt?: string;
};

export default function UserAvatar({ src, size = 200, layoutId, alt }: Props) {
  return (
    <motion.div
      layoutId={layoutId}
      role="img"
      aria-label={alt || 'User avatar'}
      className="rounded-full overflow-hidden"
      style={{ height: size, width: size }}
    >
      <img
        src={src}
        alt={alt || 'User avatar'}
        className="object-cover w-full h-full"
      />
    </motion.div>
  );
}
