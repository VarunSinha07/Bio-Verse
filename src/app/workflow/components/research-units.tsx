'use client';

import { motion } from 'framer-motion';
import { Microscope, Printer, Dna } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const researchUnits = [
  {
    title: 'AI-Driven Pathogen Simulation',
    description: [
      'Predictive modeling of virus mutations and epidemic trajectories.',
      'Tools to visualize geographic spread and impact zones.',
    ],
    icon: <Microscope className="h-8 w-8 text-teal-500" />,
    image: '/img1.jpg',
  },
  {
    title: 'Digital Bioprinting & Biochip Design',
    description: [
      'Virtual modeling of bioprinting workflows and biochip layouts.',
      'Real-time adjustments for efficiency and performance optimization.',
    ],
    icon: <Printer className="h-8 w-8 text-blue-500" />,
    image: '/img1.jpg',
  },
  {
    title: 'Personalized Medicine Simulations',
    description: [
      'AI algorithms to model patient-specific responses to treatments.',
      'Tools to simulate genetic interactions and drug efficacy.',
    ],
    icon: <Dna className="h-8 w-8 text-purple-500" />,
    image: '/img1.jpg',
  },
];

export default function ResearchUnits() {
  return (
    <section className="py-24 bg-background">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-4"
          >
            specialized Research Units
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Dedicated modules for specific biotech applications
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {researchUnits.map((unit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className="h-full overflow-hidden hover:shadow-xl transition-shadow duration-300 border-muted">
                <div className="relative h-48 w-full">
                  <Image
                    src={unit.image}
                    alt={unit.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <span className="text-white font-medium px-4 py-2 border border-white/30 rounded-full backdrop-blur-sm">
                      View Details
                    </span>
                  </div>
                </div>
                <CardHeader className="pt-6">
                  <div className="mb-4 bg-muted w-fit p-3 rounded-xl">
                    {unit.icon}
                  </div>
                  <CardTitle className="text-xl mb-2">{unit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {unit.description.map((desc, i) => (
                      <li
                        key={i}
                        className="flex items-start text-muted-foreground text-sm"
                      >
                        <span className="mr-2 mt-1.5 h-1.5 w-1.5 rounded-full bg-teal-500 flex-shrink-0" />
                        {desc}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
