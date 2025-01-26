"use client"

import { motion } from "framer-motion"
import { Cormorant_Garamond, Waterfall } from "next/font/google"

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

const waterfall = Waterfall({
  subsets: ["latin"],
  weight: ["400"],
})

export default function EcosystemHero() {
  return (
    <div className="h-screen bg-sea-green flex items-center justify-center text-white">
      <div className="text-center">
        <motion.h1
          className={`text-5xl md:text-7xl font-bold mb-4 ${cormorantGaramond.className}`}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Our Ecosystem
        </motion.h1>
        <motion.p
          className={`text-2xl md:text-3xl ${waterfall.className}`}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Nurturing innovation in biotech and beyond
        </motion.p>
      </div>
    </div>
  )
}

