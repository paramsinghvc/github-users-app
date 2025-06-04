/* eslint-disable @next/next/no-img-element */
// components/UserAvatar.tsx
'use client';

import { motion } from 'framer-motion';

type Props = {
  src: string;
  size?: number;
  layoutId: string;
  alt?: string;
};

export default function UserAvatar({ src, layoutId, alt }: Props) {
  return (
    <motion.div
      layoutId={layoutId}
      className="rounded-full overflow-hidden h-[200px] w-[200px]"
    >
      <img
        src={src}
        alt={alt || 'User avatar'}
        className="object-cover w-full h-full"
      />
    </motion.div>
  );
}
