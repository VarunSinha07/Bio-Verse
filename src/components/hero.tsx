"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Cormorant_Garamond, Waterfall } from 'next/font/google'

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
})

const waterfall = Waterfall({
  subsets: ['latin'],
  weight: ['400'],
})

export default function Hero() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
      <div className="bg-sea-green text-white flex items-center justify-center p-7">
        <div className="max-w-xl">
          <motion.h1
            className={`text-5xl md:text-5xl font-bold mb-4 ${cormorantGaramond.className}`}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Creating a cutting-edge{' '}
            <br></br>
            <span className={`${waterfall.className} text-5xl md:text-9xl block mt-2`}>
              Virtual Ecosystem
            </span>
          </motion.h1>
          <br></br>
          <motion.p
            className={`text-5xl md:text-5xl font-bold mb-4 ${cormorantGaramond.className}`}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            that accelerates innovation in biotech, bioengineering, and biomedical sciences
          </motion.p>
          <motion.div
            className="space-y-4 md:space-y-0 md:space-x-4 flex flex-col md:flex-row"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link
              href="/platform"
              className={`bg-black text-white px-7 py-3 rounded-full hover:bg-opacity-80 transition-colors text-center ${cormorantGaramond.className}`}
            >
              Explore our Platform
            </Link>
            <Link
              href="/community"
              className={`bg-white text-black px-7 py-2 rounded-full hover:bg-opacity-80 transition-colors text-center ${cormorantGaramond.className}`}
            >
              Join the Community
            </Link>
          </motion.div>
        </div>
      </div>
      <div className="relative">
        <Image
          src="/img1.jpg"
          alt="Bioverse Innovation"
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>
    </div>
  )
}