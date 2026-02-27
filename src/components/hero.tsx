'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export default function Hero() {
  return (
    <div
      className={`relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-background ${cormorantGaramond.variable} ${inter.variable}`}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background/50 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

        <Image
          src="/img1.jpg"
          alt="Bioverse Innovation"
          fill
          className="object-cover opacity-20 dark:opacity-10"
          priority
        />
      </div>

      <div className="container relative z-20 px-4 md:px-6 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-4xl mx-auto space-y-8"
        >
          

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground font-cormorant leading-tight pt-24">
            Creating a cutting-edge <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-600">
              Virtual Ecosystem
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-xl text-muted-foreground font-inter leading-relaxed">
            Accelerating innovation in biotech, bioengineering, and biomedical
            sciences through advanced simulation and collaborative intelligence.
          </p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <Button
              size="lg"
              className="h-12 px-8 text-lg font-medium bg-teal-600 hover:bg-teal-700 text-white rounded-full transition-all hover:scale-105"
              asChild
            >
              <Link href="/ecosystem">
                Explore Platform <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 text-lg font-medium border-teal-200 dark:border-teal-800 hover:bg-teal-50 dark:hover:bg-teal-950/50 rounded-full transition-all hover:scale-105"
              asChild
            >
              <Link href="/our-approach">Our Approach</Link>
            </Button>
          </motion.div>

          {/* Stats or quick info */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 pt-8 border-t border-border/40">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-teal-600 dark:text-teal-400 font-cormorant">
                Advanced
              </span>
              <span className="text-sm text-muted-foreground font-inter">
                Simulation Platform
              </span>
            </div>
            <div className="flex flex-col items-center border-l border-r border-border/40 px-8">
              <span className="text-3xl font-bold text-teal-600 dark:text-teal-400 font-cormorant">
                Global
              </span>
              <span className="text-sm text-muted-foreground font-inter">
                Research Network
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-teal-600 dark:text-teal-400 font-cormorant">
                Secure
              </span>
              <span className="text-sm text-muted-foreground font-inter">
                Data Ecosystem
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
