"use client";

import React from "react";
import Services from "@/components/sections/Services";
import { motion } from "framer-motion";

export default function ServicesPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-20"
    >
      <Services />
    </motion.div>
  );
}
