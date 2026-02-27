'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Database, Brain, LineChart, RefreshCcw } from 'lucide-react';

const steps = [
  {
    title: 'Data Integration',
    description:
      'LIMS collects, organizes, and standardizes laboratory data from genetic analysis, biomarker detection, and pathogen studies.',
    icon: <Database className="h-6 w-6 text-blue-500" />,
  },
  {
    title: 'AI-Driven Modeling',
    description:
      'Virus simulation software processes data to predict mutations, spread pathways, and outbreak scenarios. Drug discovery modules simulate molecular interactions.',
    icon: <Brain className="h-6 w-6 text-purple-500" />,
  },
  {
    title: 'Outcome Generation',
    description:
      'Generates dynamic reports with real-time predictions for outbreak zones and drug efficacy. Visual dashboards display actionable insights.',
    icon: <LineChart className="h-6 w-6 text-teal-500" />,
  },
  {
    title: 'Feedback Loop',
    description:
      'Continuous data input from LIMS updates the simulations, ensuring models remain accurate and adaptive.',
    icon: <RefreshCcw className="h-6 w-6 text-orange-500" />,
  },
];

const HowItWorks = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  // Using partial range to start animation earlier
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  });

  const tracingBeamHeight = useTransform(
    scrollYProgress,
    [0, 1],
    ['0%', '100%']
  );

  return (
    <section
      ref={containerRef}
      className="py-24 bg-gradient-to-b from-background to-muted/20 overflow-hidden"
    >
      <div className="container mx-auto px-4 relative">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center mb-24 bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-600"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Operational Workflow
        </motion.h2>

        <div className="max-w-4xl mx-auto relative pl-8 md:pl-0">
          {/* Vertical Line Container */}
          <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 top-4 bottom-0 w-0.5 bg-border h-full" />

          <motion.div
            className="absolute left-0 md:left-1/2 md:-translate-x-1/2 top-4 w-1 bg-gradient-to-b from-teal-500 to-emerald-500 origin-top z-10 rounded-full"
            style={{
              height: tracingBeamHeight,
              boxShadow: '0 0 15px rgba(20, 184, 166, 0.5)',
            }}
          />

          <div className="space-y-24">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 relative ${index % 2 === 0 ? 'md:flex-row-reverse text-left md:text-right' : 'text-left'}`}
              >
                {/* Timeline Node */}
                <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 w-4 h-4 bg-background border-4 border-teal-500 rounded-full z-20 translate-y-1" />
                <motion.div
                  className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-10%' }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div
                    className={`flex items-center gap-3 mb-2 ${index % 2 === 0 ? 'md:flex-row-reverse' : 'flex-row'}`}
                  >
                    <div className="p-2 bg-muted rounded-lg border border-border">
                      {step.icon}
                    </div>
                    <h3 className="text-2xl font-semibold text-foreground">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
                <div className="hidden md:block w-1/2" /> {/* Spacer */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
