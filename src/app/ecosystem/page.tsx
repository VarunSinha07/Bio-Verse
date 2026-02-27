'use client';

import { motion } from 'framer-motion';
import { Network, Cpu, Activity, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const ecosystemFeatures = [
  {
    title: 'Virtual Incubation Hub',
    description:
      'A complete digital environment for HealthTech design, bio-simulation, and rapid prototype testing. Accelerate your research with our AI-powered genetic analysis tools.',
    icon: <Network className="h-10 w-10 text-blue-500" />,
    image: '/img1.jpg',
    color: 'bg-blue-500/10 text-blue-600',
  },
  {
    title: 'Bio Design Studio',
    description:
      'Advanced virtual 3D modeling suite for biochip architectures and wearable medical devices. Seamlessly integrate with manufacturing partners for physical prototyping.',
    icon: <Cpu className="h-10 w-10 text-purple-500" />,
    image: '/img2.jpg',
    color: 'bg-purple-500/10 text-purple-600',
  },
  {
    title: 'AI Simulation Platform',
    description:
      'Harness the power of artificial intelligence to model pathogen behaviors, analyze real-time biological data, and predict drug efficacy before clinical trials.',
    icon: <Activity className="h-10 w-10 text-teal-500" />,
    image: '/img1.jpg',
    color: 'bg-teal-500/10 text-teal-600',
  },
];

export default function EcosystemPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-teal-50/50 to-transparent dark:from-teal-950/20 pointer-events-none" />
        <div className="container px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold tracking-tight"
            >
              The <span className="text-teal-600">BioVerse</span> Ecosystem
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-muted-foreground leading-relaxed"
            >
              An integrated suite of tools designed to revolutionize disparate
              parts of the biotech lifecycle into one cohesive workflow.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="pb-24">
        <div className="container px-4 md:px-6">
          <div className="space-y-24">
            {ecosystemFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.7 }}
                className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-20`}
              >
                {/* Image Side */}
                <div className="w-full lg:w-1/2 relative group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-teal-600 to-emerald-600 rounded-2xl transform rotate-3 opacity-20 group-hover:rotate-6 transition-transform duration-500 blur-lg" />
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border aspect-video">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                </div>

                {/* Content Side */}
                <div className="w-full lg:w-1/2 space-y-6">
                  <div
                    className={`inline-flex items-center justify-center p-3 rounded-xl ${feature.color}`}
                  >
                    {feature.icon}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold">
                    {feature.title}
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                  <ul className="space-y-3 pt-2">
                    {[
                      'Real-time collaboration',
                      'Secure data capabilities',
                      'Seamless integration',
                    ].map((item, i) => (
                      <li
                        key={i}
                        className="flex items-center text-sm font-medium"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-teal-500 mr-3" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="mt-4" asChild>
                    <Link href="/sign-up">
                      Learn more <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-muted/30 border-t border-border">
        <div className="container px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Join the Ecosystem</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Experience the future of biotech innovation. Start your journey with
            BioVerse today.
          </p>
          <div className="flex justify-center gap-4">
            <Button
              size="lg"
              className="bg-teal-600 hover:bg-teal-700 text-white"
              asChild
            >
              <Link href="/sign-up">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
