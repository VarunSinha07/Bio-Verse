'use client';


import React from 'react';
import { Button } from '../ui/button';
import { authClient, useSession } from '@/lib/auth-client';
import { redirect } from 'next/navigation';
import Link from 'next/link';

const handleClick = () => {
  authClient.signOut();
  redirect('/sign-in');
};

const Navbar = () => {
  const session = useSession();
  return (
    <div>
      <nav className="bg-black text-white p-4 absolute top-0 left-0 right-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            Bioverse
          </Link>
          <ul className="flex space-x-4">
            {[
              'Ecosystem',
              'Our Approach',
              'enabling-excellence',
              'Workflow',
              'Insights',
              'Contact Us',
            ].map((item) => (
              <li key={item}>
                <Link
                  href={`/${item.toLowerCase().replace(' ', '-')}`}
                  className="hover:text-sea-green transition-colors"
                >
                  {item}
                </Link>
              </li>
            ))}
            <li>
              {session.data?.user.email ? (
                <div>
                  <Button
                    onClick={handleClick}
                    variant="ghost"
                    size="lg"
                    className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600 hover:text-white hover:border-gray-500 hover:shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="lg:space-x-2 flex items-center justify-center">
                  <Link href="/sign-in">
                    <Button
                      variant="ghost"
                      size="lg"
                      className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600 hover:text-white hover:border-gray-500 hover:shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button
                      size="lg"
                      className="bg-emerald-600 text-white hover:bg-emerald-500 hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                    >
                      Apply Now
                    </Button>
                  </Link>
                </div>
              )}
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
