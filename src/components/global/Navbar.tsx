'use client';

import React from 'react';
import { Button } from '../ui/button';
import { authClient } from '@/lib/auth-client';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ModeToggle } from '../mode-toggle';

const handleClick = () => {
  authClient.signOut();
  redirect('/sign-in');
};

interface NavbarProps {
  navItems: string[]
  handleClick: () => void
}

const Navbar = () => {
  const pathname = usePathname()

  const navItems = ["Ecosystem", "Our Approach", "Enabling Excellence", "Workflow", "Insights", "Contact Us"]

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-black to-gray-900 text-white p-4 shadow-lg border-b border-sea-green">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-3xl font-bold text-sea-green hover:text-white transition-colors duration-300">
          Bioverse
        </Link>
        <ul className="hidden md:flex space-x-4">
          {navItems.map((item) => (
            <li key={item} className="relative group">
              <Link
                href={`/${item.toLowerCase().replace(/ /g, "-")}`}
                className={`px-3 py-2 text-sm font-medium transition-colors duration-300 ${
                  pathname === `/${item.toLowerCase().replace(/ /g, "-")}`
                    ? "text-sea-green"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {item}
              </Link>
              <span
                className={`absolute left-0 bottom-0 w-full h-0.5 bg-sea-green transition-all duration-300 ${
                  pathname === `/${item.toLowerCase().replace(/ /g, "-")}`
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                }`}
              />
            </li>
          ))}
        </ul>
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex space-x-2">
            <Link href="/sign-in">
              <Button
                variant="ghost"
                size="sm"
                className="bg-gray-800 text-white hover:bg-gray-700 hover:text-sea-green hover:shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:-translate-y-1 rounded-md px-4 py-2"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button
                size="sm"
                className="bg-sea-green text-white hover:bg-sea-green/80 hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:rotate-1 rounded-md px-4 py-2"
              >
                Sign Up
              </Button>
            </Link>
          </div>
          <ModeToggle />
        </div>
      </div>
    </nav>
  )
}


export default Navbar;
