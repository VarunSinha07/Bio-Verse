import { Link } from 'lucide-react';
import React from 'react';

const Navbar = () => {
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
              'Ideas',
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
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
