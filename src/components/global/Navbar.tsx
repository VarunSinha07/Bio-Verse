'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useSession, signOut } from '@/lib/auth-client';

import { cn } from '@/lib/utils';
// Ensure these components exist or use standard HTML/Tailwind for now if they don't
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  // Session handling
  const { data: session, isPending } = useSession();
  const isSignedIn = !isPending && session !== null;

  // Handle scroll effect
  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = isSignedIn
    ? [
        { name: 'Application', path: '/form' },
        { name: 'Resource Hub', path: '/resource-hub' },
        { name: 'Partnered Services', path: '/partnered-services' },
        { name: 'Profile', path: '/profile' },
      ]
    : [
        { name: 'Ecosystem', path: '/ecosystem' },
        { name: 'Our Approach', path: '/our-approach' },
        { name: 'Enabling Excellence', path: '/enabling-excellence' },
        { name: 'Workflow', path: '/workflow' },
      ];

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/sign-in');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out border-b border-transparent',
        scrolled
          ? 'bg-background/80 backdrop-blur-md border-border/40 shadow-sm'
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex-shrink-0 flex items-center gap-2 group"
            onClick={() => setIsOpen(false)}
          >
            <div className="relative w-8 h-8 md:w-10 md:h-10 transition-transform group-hover:scale-105">
              {/* Fallback to text if logo image is missing or just use text for cleaner look */}
              <div className="absolute inset-0 bg-gradient-to-tr from-teal-500 to-emerald-600 rounded-lg transform rotate-3 opacity-90"></div>
              <div className="absolute inset-0 bg-background rounded-lg flex items-center justify-center border border-border shadow-sm">
                <span className="font-bold text-teal-600 text-xl">B</span>
              </div>
            </div>
            <span className="font-bold text-xl md:text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-emerald-600">
              BioVerse
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                asChild
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary hover:bg-accent/50',
                  pathname === item.path
                    ? 'text-primary font-semibold bg-accent/50'
                    : 'text-muted-foreground'
                )}
              >
                <Link href={item.path}>{item.name}</Link>
              </Button>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-2 lg:gap-4">
            <ModeToggle />
            {isSignedIn ? (
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="border-teal-200 hover:bg-teal-50 dark:border-teal-800 dark:hover:bg-teal-950/30"
              >
                Sign Out
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/sign-in">Log in</Link>
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-md shadow-teal-500/20 transition-all hover:shadow-lg hover:shadow-teal-500/30"
                  asChild
                >
                  <Link href="/sign-up">Get Started</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <ModeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-muted-foreground hover:text-primary transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-border/40 bg-background/95 backdrop-blur-md overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4 flex flex-col">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'block px-4 py-3 text-lg font-medium rounded-xl transition-colors',
                    pathname === item.path
                      ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-6 mt-2 border-t border-border/40 flex flex-col gap-3">
                {isSignedIn ? (
                  <Button
                    onClick={handleSignOut}
                    size="lg"
                    variant="outline"
                    className="w-full justify-center"
                  >
                    Sign Out
                  </Button>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full"
                      asChild
                      onClick={() => setIsOpen(false)}
                    >
                      <Link href="/sign-in">Log in</Link>
                    </Button>
                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md"
                      asChild
                      onClick={() => setIsOpen(false)}
                    >
                      <Link href="/sign-up">Get Started</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
