import Navbar from '@/components/global/Navbar';
import Footer from '@/components/global/Footer';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bioverse',
  description:
    'Accelerating innovation in biotech, bioengineering, and biomedical sciences',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-background text-foreground flex flex-col min-h-screen`}
      >
        <ThemeProvider attribute="class" defaultTheme="system">
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
