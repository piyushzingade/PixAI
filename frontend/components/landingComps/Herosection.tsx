// app/components/HeroSection.tsx
"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative flex items-center justify-center min-h-screen bg-neutral-50 dark:bg-black overflow-hidden transition-colors duration-500">
      {/* Moving Grid Squares */}
      <div className="absolute inset-0 z-0 grid grid-cols-6 grid-rows-3">
        {[...Array(18)].map((_, i) => (
          <motion.div
            key={i}
            className="border border-neutral-400 dark:border-neutral-700 w-full h-full"
            animate={{
              x: [0, 10,-5 , 0],
              y: [0, 10, -5 , 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.05,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="z-10 text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <p className="relative inline-flex items-center gap-2 px-5 py-1.5 mb-6 text-sm font-semibold text-neutral-800 dark:text-white bg-neutral-200 dark:bg-neutral-800 rounded-full shadow-md hover:shadow-lg transition-shadow duration-300 group">
            NOT Backed by
            <span className="inline-flex items-center justify-center bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded">
              Y
            </span>
            Combinator... yet
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-r from-transparent via-cyan-400 to-transparent h-px w-4/5 mx-auto"></span>
            <span className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 inset-x-0 bottom-0 bg-gradient-to-r from-transparent via-cyan-400 to-transparent h-[4px] w-4/5 mx-auto blur-sm"></span>
          </p>

          <h1 className="text-5xl md:text-7xl font-bold text-neutral-900 dark:text-white leading-tight mb-6">
            Generate Customize Images <br /> with AI
          </h1>

          <p className="text-neutral-700 dark:text-neutral-400 max-w-xl mx-auto mb-6">
            Everything AI seamlessly integrated—all the modern AI generation
            tools into one platform so that you can generate content with a
            single click.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Button className="  overflow-hidden bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-2xl px-6 py-2 font-medium cursor-pointer transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-400">
              Get started
            </Button>

            <Button
              variant="outline"
              className="bg-neutral-100 text-neutral-700 dark:text-neutral-200 dark:bg-neutral-900 rounded-2xl border border-neutral-200  dark:border-neutral-700"
            >
              Contact us →
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
