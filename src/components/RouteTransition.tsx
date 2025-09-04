// src/components/RouteTransition.tsx
"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      // no exit → no flash
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="will-change-[opacity]"
    >
      {children}
    </motion.div>
  );
}
