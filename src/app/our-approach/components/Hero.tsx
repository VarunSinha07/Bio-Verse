'use client';

import { motion } from 'framer-motion';
import { Microscope, Lightbulb, Rocket } from 'lucide-react';

export default function Hero() {
  return (
    <motion.section
      className="text-center py-20"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-4xl md:text-6xl font-bold text-gray-800 mb-6"
      >
        Innovate in Medical Science
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-xl text-gray-600 mb-12"
      >
        Turn your groundbreaking ideas into reality with our incubation programs
      </motion.p>
      <div className="flex justify-center space-x-8">
        {[
          { icon: Microscope, text: 'Research' },
          { icon: Lightbulb, text: 'Innovate' },
          { icon: Rocket, text: 'Launch' },
        ].map((item, index) => (
          <motion.div
            key={item.text}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="flex flex-col items-center"
          >
            <item.icon className="h-12 w-12 text-indigo-600 mb-2" />
            <span className="text-gray-700">{item.text}</span>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
