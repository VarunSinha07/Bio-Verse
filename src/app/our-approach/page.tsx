'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Lightbulb,
  Rocket,
  Zap,
  ArrowRight,
  Code,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function OurApproachPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const steps = [
    {
      icon: <Lightbulb className="h-10 w-10 text-amber-500" />,
      title: 'Ideation & Discovery',
      description:
        'We begin by identifying core challenges and brainstorming innovative solutions. Our collaborative workshops help refine concepts into viable project roadmaps.',
      color: 'from-amber-500/10 to-transparent',
      borderColor: 'border-amber-500/20',
    },
    {
      icon: <Zap className="h-10 w-10 text-teal-500" />,
      title: 'Prototype Development',
      description:
        'Using our advanced simulation platform, we rapidly prototype and test biological models. This virtual-first approach reduces cost and accelerates iteration cycles.',
      color: 'from-teal-500/10 to-transparent',
      borderColor: 'border-teal-500/20',
    },
    {
      icon: <Rocket className="h-10 w-10 text-indigo-500" />,
      title: 'Incubation & Scale',
      description:
        'Once validated, we support the transition from prototype to market-ready solution. Our network of partners helps facilitate funding, manufacturing, and distribution.',
      color: 'from-indigo-500/10 to-transparent',
      borderColor: 'border-indigo-500/20',
    },
  ];

  return (
    <div className="relative overflow-hidden bg-background min-h-screen">
      {/* Abstract Background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-900/10 via-background to-background" />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400">
              Our Methodology
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              We guide innovators through a comprehensive, data-driven journey
              from initial concept to market-ready solution using our
              proprietary three-phase framework.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-12 md:py-24 relative">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <Card
                  className={`h-full bg-background/50 backdrop-blur-sm border ${step.borderColor} overflow-hidden hover:shadow-lg transition-all duration-300 group`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-30 group-hover:opacity-50 transition-opacity`}
                  />
                  <CardHeader className="relative z-10 pt-8 pb-4">
                    <div className="mb-4 bg-background w-fit p-3 rounded-xl border border-border shadow-sm group-hover:scale-110 transition-transform duration-300">
                      {step.icon}
                    </div>
                    <CardTitle className="text-2xl font-bold">
                      {step.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Programs Section */}
      <div ref={ref} className="container px-4 md:px-6 py-12 md:py-24">
        <div className="max-w-5xl mx-auto space-y-24">
          {/* Ideation Program */}
          <ProgramSection
            number="01"
            title="Ideation Program"
            description="This program helps entrepreneurs and innovators refine their ideas and concepts by providing the essential tools, resources, and mentorship needed to turn an idea into a feasible and marketable solution."
            duration="6 weeks"
            icon={<Lightbulb className="h-10 w-10" />}
            color="purple"
            isInView={isInView}
            modules={[
              {
                title: 'Introduction to Innovation and Design Thinking',
                content: [
                  'Overview of innovation methodologies and design thinking',
                  'Empathy mapping and understanding customer pain points',
                  'Creating problem statements and identifying solution opportunities',
                ],
              },
              {
                title: 'Market Research & Opportunity Identification',
                content: [
                  'Tools for conducting market research (surveys, interviews, focus groups)',
                  'Competitor analysis and market trends',
                  'Identifying customer personas and unmet needs',
                ],
              },
              {
                title: 'Idea Validation & Feasibility Analysis',
                content: [
                  'Techniques for validating ideas (MVP, customer feedback, early testing)',
                  'Financial feasibility: cost structure, revenue model, and pricing',
                  'Market testing with early prototypes or pilot programs',
                ],
              },
              {
                title: 'Building a Value Proposition',
                content: [
                  'Crafting a clear and compelling value proposition',
                  "Defining your product's unique selling point (USP)",
                  'Communicating the benefits of your product to customers and investors',
                ],
              },
              {
                title: 'Business Model Design',
                content: [
                  'Introduction to popular business model frameworks (Business Model Canvas, Lean Canvas)',
                  'Defining business goals and KPIs',
                  'Scaling strategies and identifying potential partnerships',
                ],
              },
              {
                title: 'Pitching Your Idea',
                content: [
                  'Preparing an investor pitch',
                  'Communicating the potential impact and scalability of your idea',
                  'Pitching skills and techniques for convincing stakeholders',
                ],
              },
            ]}
          />

          {/* Prototype Development Program */}
          <ProgramSection
            number="02"
            title="Prototype Development Program"
            description="In this program, entrepreneurs and innovators will learn how to turn their validated ideas into working prototypes using virtual tools and digital prototyping techniques."
            duration="8 weeks"
            icon={<Code className="h-10 w-10" />}
            color="teal"
            isInView={isInView}
            modules={[
              {
                title: 'Introduction to Prototyping',
                content: [
                  'Basics of prototyping: Why, When, and How to prototype',
                  'Types of prototypes: Low-fidelity vs. High-fidelity',
                  'Choosing the right prototyping tools and technologies',
                ],
              },
              {
                title: 'Designing Your Prototype',
                content: [
                  '3D modeling software for product design',
                  'Biochip design, wearable devices, and bioprinting basics',
                  'Creating your first prototype using digital tools',
                ],
              },
              {
                title: 'Rapid Prototyping Techniques',
                content: [
                  'Virtual prototyping: Using simulation tools to test designs',
                  'Online manufacturing partners and rapid prototyping services',
                  'Working with materials and understanding the prototyping process',
                ],
              },
              {
                title: 'Testing and Refining Prototypes',
                content: [
                  'How to simulate real-world scenarios for testing',
                  'Gathering feedback through user testing and virtual simulations',
                  'Iterative prototyping and refinement techniques',
                ],
              },
              {
                title: 'Simulation-Driven Development',
                content: [
                  'Leveraging AI-driven simulation tools for testing prototypes',
                  'Drug testing simulations, virus modeling, and bioprinting trials',
                  'Analyzing simulation results to improve prototype designs',
                ],
              },
              {
                title: 'Bringing Prototypes to Life',
                content: [
                  'Turning digital models into physical prototypes',
                  'Collaborating with manufacturers for physical production',
                  'Managing the prototyping lifecycle and moving toward mass production',
                ],
              },
            ]}
          />

          {/* Incubation Program */}
          <ProgramSection
            number="03"
            title="Incubation Program"
            description="This program focuses on helping startups scale from the early stages to established companies, with guidance on business development, securing investment, and market strategies."
            duration="12 weeks"
            icon={<Rocket className="h-10 w-10" />}
            color="amber"
            isInView={isInView}
            modules={[
              {
                title: 'Building a Strong Foundation for Your Startup',
                content: [
                  'Business strategy development and goal setting',
                  'Identifying key resources and partners for startup growth',
                  'Understanding the legal and regulatory landscape',
                ],
              },
              {
                title: 'Financial Planning & Fundraising',
                content: [
                  'Managing startup finances: cash flow, revenue, and expenses',
                  'Preparing for investment: pitch decks, valuation, and funding rounds',
                  'Types of funding: venture capital, grants, crowdfunding, angel investors',
                ],
              },
              {
                title: 'Go-to-Market Strategy & Branding',
                content: [
                  'Developing a marketing strategy and identifying key channels',
                  'Building a brand identity and value proposition',
                  'Using social media, PR, and digital marketing to grow your audience',
                ],
              },
              {
                title: 'Sales Strategy & Customer Acquisition',
                content: [
                  'Creating a sales funnel: from lead generation to conversion',
                  'Pricing strategies and product-market fit',
                  'Customer relationship management and retention tactics',
                ],
              },
              {
                title: 'Operations Management & Scaling',
                content: [
                  'Systems and processes for smooth operations as you scale',
                  'Managing teams, resources, and workflows',
                  'Automation and using tech tools to improve efficiency',
                ],
              },
              {
                title: 'Pitching & Networking for Growth',
                content: [
                  'Perfecting your pitch for investors and partners',
                  'Building strong networks and leveraging connections',
                  'Attending pitch events, conferences, and startup accelerators',
                ],
              },
            ]}
          />
        </div>
      </div>

      {/* CTA Section */}
      <section className="py-20 bg-teal-50/50 dark:bg-teal-900/10">
        <div className="container px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Join the BioVerse ecosystem today and access the tools you need to
              bring your biotech innovations to life.
            </p>
            <Button
              size="lg"
              className="bg-teal-600 text-white hover:bg-teal-700 font-semibold px-8 py-6 rounded-full"
              asChild
            >
              <Link href="/sign-up">
                Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

interface ProgramSectionProps {
  number: string;
  title: string;
  description: string;
  duration: string;
  icon: React.ReactNode;
  color: 'purple' | 'teal' | 'amber';
  isInView: boolean;
  modules: {
    title: string;
    content: string[];
  }[];
}

function ProgramSection({
  number,
  title,
  description,
  duration,
  icon,
  color,
  modules,
}: ProgramSectionProps) {
  const colorMap = {
    purple: 'from-purple-500 to-purple-600',
    teal: 'from-teal-500 to-teal-600',
    amber: 'from-amber-500 to-amber-600',
  };

  const bgColorMap = {
    purple: 'bg-purple-50 dark:bg-purple-900/10',
    teal: 'bg-teal-50 dark:bg-teal-900/10',
    amber: 'bg-amber-50 dark:bg-amber-900/10',
  };

  const borderColorMap = {
    purple: 'border-purple-200 dark:border-purple-800',
    teal: 'border-teal-200 dark:border-teal-800',
    amber: 'border-amber-200 dark:border-amber-800',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, amount: 0.2 }}
      className="relative"
    >
      <div className="flex flex-col md:flex-row gap-8 md:gap-12">
        <div className="md:w-1/3">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="sticky top-24"
          >
            <div className="flex items-center gap-4 mb-4">
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${colorMap[color]} text-white font-bold text-lg`}
              >
                {number}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {description}
            </p>
            <div className="flex items-center gap-2 mb-6">
              <div className={`p-2 rounded-full ${bgColorMap[color]}`}>
                {icon}
              </div>
              <div className="font-semibold">Duration: {duration}</div>
            </div>
            <Button
              className={`bg-gradient-to-r ${colorMap[color]} text-white hover:shadow-lg transition-all w-full md:w-auto`}
            >
              Learn More
            </Button>
          </motion.div>
        </div>

        <div className="md:w-2/3">
          <Card className={`border ${borderColorMap[color]}`}>
            <CardHeader>
              <CardTitle>Course Modules</CardTitle>
              <CardDescription>
                Comprehensive curriculum designed to guide you through every
                step of the process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {modules.map((module, index) => (
                  <ModuleCard
                    key={index}
                    module={module}
                    index={index}
                    color={color}
                    colorMap={colorMap}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

interface ModuleCardProps {
  module: {
    title: string;
    content: string[];
  };
  index: number;
  color: 'purple' | 'teal' | 'amber';
  colorMap: Record<string, string>;
}

function ModuleCard({ module, index, color, colorMap }: ModuleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      viewport={{ once: true }}
      className="border rounded-lg overflow-hidden"
    >
      <div
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r ${colorMap[color]} text-white font-medium text-sm`}
          >
            {index + 1}
          </div>
          <span className="font-medium">{module.title}</span>
        </div>
        <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
          {isExpanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </Button>
      </div>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="px-4 pb-4 pl-15"
        >
          <ul className="space-y-2 py-2 pl-11">
            {module.content.map((item, itemIndex) => (
              <motion.li
                key={itemIndex}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * itemIndex }}
                className="flex items-start gap-2"
              >
                <Zap className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}
    </motion.div>
  );
}
