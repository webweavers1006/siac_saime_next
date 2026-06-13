"use client";

import { motion } from "framer-motion";
import { sectionContainerVariants, sectionItemVariants } from "@/features/shared";
import { AUTH_CONFIG } from "../config/auth.constants";

/**
 * LoginHero — Branding superior de la página de login.
 * Animaciones suaves para la entrada del portal.
 */
export function LoginHero() {
  const { HEADER } = AUTH_CONFIG.UI.LABELS;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={sectionContainerVariants}
      className="relative z-10 text-center mb-8 space-y-3"
    >
      <motion.h1
        variants={sectionItemVariants}
        className="text-3xl font-bold tracking-tight"
      >
        {HEADER.TITLE}
      </motion.h1>

      <motion.div
        variants={sectionItemVariants}
        className="w-16 h-1 bg-primary mx-auto rounded-full"
      />
    </motion.div>
  );
}
