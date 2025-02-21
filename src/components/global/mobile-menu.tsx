'use client';

import type React from 'react';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '../ui/button';
import { ModeToggle } from '../mode-toggle';
import { Menu, X } from 'lucide-react';

interface MobileMenuProps {
  navItems: string[];
}

const MobileMenu: React.FC<MobileMenuProps> = ({ navItems }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="md:hidden">
      <Button variant="ghost" size="icon" onClick={toggleMenu}>
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 w-full bg-gradient-to-r from-black to-gray-900 shadow-lg py-4"
          >
            <nav className="flex flex-col items-center space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase().replace(/ /g, '-')}`}
                  className="text-gray-300 hover:text-white transition-colors duration-300"
                  onClick={toggleMenu}
                >
                  {item}
                </Link>
              ))}
              <Link href="/sign-in" onClick={toggleMenu}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full bg-gray-800 text-white hover:bg-gray-700 hover:text-sea-green"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up" onClick={toggleMenu}>
                <Button
                  size="sm"
                  className="w-full bg-sea-green text-white hover:bg-sea-green/80"
                >
                  Sign Up
                </Button>
              </Link>
              <ModeToggle />
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileMenu;
