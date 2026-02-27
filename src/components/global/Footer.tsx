'use client';

import Link from 'next/link';
import {
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-200 py-12 border-t border-slate-800">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-bold text-2xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-emerald-500">
                BioVerse
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              Resolving the challenges of biotech innovation through a
              cutting-edge virtual ecosystem.
            </p>
            <div className="flex space-x-4 pt-2">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-slate-800 hover:text-teal-400 rounded-full h-8 w-8"
              >
                <Linkedin size={18} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-slate-800 hover:text-teal-400 rounded-full h-8 w-8"
              >
                <Twitter size={18} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-slate-800 hover:text-teal-400 rounded-full h-8 w-8"
              >
                <Instagram size={18} />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Platform</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link
                  href="/ecosystem"
                  className="hover:text-teal-400 transition-colors"
                >
                  Ecosystem
                </Link>
              </li>
              <li>
                <Link
                  href="/workflow"
                  className="hover:text-teal-400 transition-colors"
                >
                  Workflow
                </Link>
              </li>
              <li>
                <Link
                  href="/resource-hub"
                  className="hover:text-teal-400 transition-colors"
                >
                  Resource Hub
                </Link>
              </li>
              <li>
                <Link
                  href="/partnered-services"
                  className="hover:text-teal-400 transition-colors"
                >
                  Partnered Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link
                  href="/our-approach"
                  className="hover:text-teal-400 transition-colors"
                >
                  Our Approach
                </Link>
              </li>
              <li>
                <Link
                  href="/enabling-excellence"
                  className="hover:text-teal-400 transition-colors"
                >
                  Enabling Excellence
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-teal-400 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-teal-400 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-1 text-teal-500" />
                <span>
                  123 Innovation Dr,
                  <br />
                  Biotech Valley, CA 94000
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-teal-500" />
                <a
                  href="mailto:info@bioverse.com"
                  className="hover:text-teal-400 transition-colors"
                >
                  info@bioverse.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-teal-500" />
                <span>+1 (555) 123-4567</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} BioVerse. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="/privacy"
              className="hover:text-slate-300 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-slate-300 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
