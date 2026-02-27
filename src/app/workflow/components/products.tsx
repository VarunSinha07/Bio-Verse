'use client';

import { motion } from 'framer-motion';
import { Monitor, Server, Cpu, Layers } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Note: Badge component might need to be created if not present, but usually in shadcn/ui.
// If not present, I'll just use a span with styling.

const products = [
  {
    title: 'Virus Simulation Suite',
    description: [
      'Model potential virus mutations and spread patterns.',
      'Predict outbreak zones using LIMS and geographic data integration.',
    ],
    icon: <Monitor className="h-6 w-6 text-red-500" />,
    tag: 'Simulation',
  },
  {
    title: 'Virtual LIMS',
    description: [
      'Cloud-based solutions for biotech project management.',
      'Integrated dashboards for data visualization and reporting.',
    ],
    icon: <Server className="h-6 w-6 text-blue-500" />,
    tag: 'Management',
  },
  {
    title: 'Biochip Prototyping',
    description: [
      'Online tools for designing, testing, and refining biochip architectures.',
      'Ready-to-export designs for physical manufacturing.',
    ],
    icon: <Cpu className="h-6 w-6 text-cyan-500" />,
    tag: 'Design',
  },
  {
    title: 'Bioprinting Workspace',
    description: [
      'Simulation tools for creating 3D bioprinting designs.',
      'Integration with materials databases for accurate modelling.',
    ],
    icon: <Layers className="h-6 w-6 text-purple-500" />,
    tag: '3D Printing',
  },
];

export default function ProductsLab() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-4"
          >
            Integrated Platform Tools
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            A comprehensive suite of software solutions designed for the modern
            bio-engineer.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-background border-border/60">
                <CardHeader>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-muted rounded-lg">
                      {product.icon}
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                      {product.tag}
                    </span>
                  </div>
                  <CardTitle className="text-lg">{product.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {product.description.map((desc, i) => (
                      <li
                        key={i}
                        className="text-sm text-muted-foreground leading-relaxed"
                      >
                        • {desc}
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
