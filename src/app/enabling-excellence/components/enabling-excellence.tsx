'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  FlaskConical,
  Brain,
  Activity,
  Pill,
  BarChart2,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    title: 'Integrated Laboratory Management',
    description:
      'Centralized sample tracking and secure data storage with LIMS. Automated data integration from diverse laboratory workflows enabling seamless analytics and compliance.',
    icon: <FlaskConical className="h-6 w-6 text-cyan-500" />,
    image: '/img1.jpg',
  },
  {
    title: 'AI-Powered Simulations',
    description:
      'Predict evolution, spread patterns, and potential impact zones of pathogens with Virus Modeling. Analyze interactions between pathogens and their environments in real-time.',
    icon: <Brain className="h-6 w-6 text-purple-500" />,
    image: '/img1.jpg',
  },
  {
    title: 'Real-Time Outbreak Predictions',
    description:
      'Combine LIMS-stored data with geographic and demographic datasets to provide actionable insights into high-risk regions, enabling proactive public health measures.',
    icon: <Activity className="h-6 w-6 text-red-500" />,
    image: '/img1.jpg',
  },
  {
    title: 'Drug Discovery Acceleration',
    description:
      'Utilize genetic, biomarker, and pathogen data for targeted simulations. AI algorithms predict drug efficacy and resistance mechanisms, drastically reducing development timelines.',
    icon: <Pill className="h-6 w-6 text-emerald-500" />,
    image: '/img1.jpg',
  },
  {
    title: 'Public Health Analytics',
    description:
      'Identify trends and correlations in infection rates and treatment outcomes. Data-driven suggestions for resource allocation strategies ensures effective epidemic management.',
    icon: <BarChart2 className="h-6 w-6 text-amber-500" />,
    image: '/img1.jpg',
  },
];

export default function EnablingExcellence() {
  return (
    <div className="bg-background min-h-screen py-24">
      <div className="container px-4 md:px-6 mb-16 text-center">
        <motion.h1
          className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-indigo-600"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Enabling Excellence
        </motion.h1>
        <motion.p
          className="text-xl text-muted-foreground max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Empowering researchers with cutting-edge tools to solve the most
          complex biological challenges.
        </motion.p>
      </div>

      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full border-border/50 hover:border-teal-500/50 transition-colors duration-300 overflow-hidden group">
                <div className="relative h-48 w-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10 opacity-60" />
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 z-20 bg-background/80 backdrop-blur-md p-2 rounded-full border border-border shadow-sm">
                    {feature.icon}
                  </div>
                </div>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-teal-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  <div className="flex items-center text-xs font-medium text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Industry Standard
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
