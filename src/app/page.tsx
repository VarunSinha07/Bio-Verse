import Hero from '@/components/hero';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Globe, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Hero />

      {/* Introduction / Value Prop */}
      <section className="py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center space-y-4 p-6 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="p-4 bg-teal-100 dark:bg-teal-900/30 rounded-full text-teal-600 dark:text-teal-400">
                <Globe className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">Global Ecosystem</h3>
              <p className="text-muted-foreground">
                Connect with researchers, labs, and innovators worldwide in a
                seamless virtual environment.
              </p>
            </div>

            <div className="flex flex-col items-center space-y-4 p-6 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-400">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">Accelerated Discovery</h3>
              <p className="text-muted-foreground">
                Reduce time-to-market with AI-driven simulations and rapid
                prototyping tools.
              </p>
            </div>

            <div className="flex flex-col items-center space-y-4 p-6 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">Enterprise Security</h3>
              <p className="text-muted-foreground">
                Your intellectual property is protected by industry-leading
                security and compliance standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlight */}
      <section className="py-24 bg-gradient-to-b from-teal-50/50 to-transparent dark:from-teal-950/20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2 space-y-6">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                From Concept to <span className="text-teal-600">Reality</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                BioVerse provides the infrastructure to take your biological
                innovations from initial ideation through to detailed simulation
                and market readiness.
              </p>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-teal-500" />
                  <span>Advanced Virus Modeling</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>Genetic Sequence Analysis</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-cyan-500" />
                  <span>Virtual Clinical Trials</span>
                </div>
              </div>
              <div className="pt-4">
                <Button
                  variant="default"
                  className="bg-teal-600 hover:bg-teal-700"
                  asChild
                >
                  <Link href="/workflow">
                    View Workflow <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="w-full md:w-1/2 relative min-h-[400px]">
              {/* Abstract visual representation */}
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500 via-emerald-500 to-cyan-500 rounded-2xl opacity-10 blur-3xl" />
              <div className="relative z-10 bg-background border border-border shadow-2xl rounded-2xl p-8 h-full flex flex-col justify-center">
                <div className="space-y-4">
                  <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
                  <div className="h-32 w-full bg-muted/50 rounded-xl mt-6 border border-border/50 flex items-center justify-center">
                    <span className="text-muted-foreground text-sm font-mono">
                      Running Simulation...
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-6 pt-6 border-t border-border">
                    <div className="flex gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-400" />
                      <div className="h-3 w-3 rounded-full bg-yellow-400" />
                      <div className="h-3 w-3 rounded-full bg-green-400" />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      System Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-teal-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/img1.jpg')] bg-cover bg-center opacity-10 mix-blend-overlay" />
        <div className="container px-4 md:px-6 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Research?
          </h2>
          <p className="text-teal-100 text-lg max-w-2xl mx-auto mb-10">
            Join the leading platform for biological innovation and start
            collaborating with the best minds in the field.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="font-semibold text-teal-900 hover:bg-white"
              asChild
            >
              <Link href="/sign-up">Get Started for Free</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white/20 hover:bg-white/10"
              asChild
            >
              <Link href="/contact">Schedule Demo</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
