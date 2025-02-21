'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cormorant_Garamond, Waterfall } from 'next/font/google';
import { Icon } from '@iconify/react';

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

const waterfall = Waterfall({
  subsets: ['latin'],
  weight: ['400'],
});

interface Product {
  title: string;
  description: string[];
  icon: string;
  color: string;
}

const products: Product[] = [
  {
    title: 'Virus Simulation Software',
    description: [
      'Models potential virus mutations and spread patterns.',
      'Predicts outbreak zones using LIMS and geographic data integration.',
    ],
    icon: 'mdi:virus-outline',
    color: '#FF6B6B',
  },
  {
    title: 'Virtual Lab Management Systems (LIMS)',
    description: [
      'Cloud-based solutions for biotech project management.',
      'Integrated dashboards for data visualization and reporting.',
    ],
    icon: 'mdi:flask-outline',
    color: '#4ECDC4',
  },
  {
    title: 'Biochip Prototyping Studio',
    description: [
      'Online tools for designing, testing, and refining biochip architectures.',
      'Ready-to-export designs for physical manufacturing.',
    ],
    icon: 'mdi:chip',
    color: '#45B7D1',
  },
  {
    title: 'Bioprinting Virtual Workspace',
    description: [
      'Simulation tools for creating 3D bioprinting designs.',
      'Integration with materials databases for accurate modelling.',
    ],
    icon: 'mdi:printer-3d-nozzle-outline',
    color: '#FF9FF3',
  },
];

const LabBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-white opacity-90" />
    <div className="absolute inset-0 bg-[url('/light-lab-background.jpg')] bg-cover bg-center opacity-10" />
    <div
      className="absolute inset-0 bg-grid-black/[0.03]"
      style={{ backgroundSize: '40px 40px' }}
    />
  </div>
);

const FloatingParticle = ({ color }: { color: string }) => {
  const [isClient, setIsClient] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const randomPosition = useCallback(() => {
    if (typeof window !== 'undefined') {
      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
      };
    }
    return { x: 0, y: 0 };
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const updatePosition = () => setPosition(randomPosition());
    updatePosition(); // Initial position

    const interval = setInterval(updatePosition, Math.random() * 5000 + 5000);

    return () => clearInterval(interval);
  }, [isClient, randomPosition]);

  if (!isClient) return null;

  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full"
      style={{ backgroundColor: color, opacity: 0.6 }}
      animate={position}
      transition={{ duration: 5, ease: 'linear' }}
    />
  );
};

// Rest of the component remains the same as in the original code
export default function ProductsLab() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % products.length);
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-100 text-gray-800">
      <LabBackground />
      {products.map((product) => (
        <FloatingParticle key={product.title} color={product.color} />
      ))}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.h1
          className={`${waterfall.className} text-5xl md:text-7xl lg:text-8xl text-center mb-16`}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ color: '#2E8B57' }}
        >
          Our Products
        </motion.h1>
        <div className="relative w-full h-[60vh]">
          <AnimatePresence>
            {products.map((product, index) => (
              <ProductDisplay
                key={product.title}
                product={product}
                isActive={activeIndex === index}
              />
            ))}
          </AnimatePresence>
        </div>
        <NavigationDots
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
        />
      </div>
    </div>
  );
}

// Include the previously defined ProductDisplay and NavigationDots components
const ProductDisplay = ({
  product,
  isActive,
}: {
  product: Product;
  isActive: boolean;
}) => (
  <motion.div
    className={`${cormorantGaramond.className} absolute inset-0 flex items-center justify-center`}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.8 }}
    transition={{ duration: 0.5 }}
  >
    <div className="text-center">
      <motion.div
        className="w-32 h-32 mx-auto mb-8 rounded-full flex items-center justify-center text-6xl text-white shadow-lg"
        style={{ backgroundColor: product.color }}
        animate={{ rotate: isActive ? 360 : 0 }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'linear',
        }}
      >
        <Icon icon={product.icon} />
      </motion.div>
      <h2 className="text-4xl font-bold text-gray-800 mb-4">{product.title}</h2>
      {product.description.map((desc, index) => (
        <motion.p
          key={index}
          className="text-xl text-gray-600 mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + index * 0.1 }}
        >
          • {desc}
        </motion.p>
      ))}
    </div>
  </motion.div>
);

const NavigationDots = ({
  activeIndex,
  setActiveIndex,
}: {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}) => (
  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4">
    {products.map((_, index) => (
      <motion.div
        key={index}
        className="w-4 h-4 rounded-full bg-gray-400 cursor-pointer"
        whileHover={{ scale: 1.2 }}
        animate={{ opacity: activeIndex === index ? 1 : 0.5 }}
        onClick={() => setActiveIndex(index)}
      />
    ))}
  </div>
);
