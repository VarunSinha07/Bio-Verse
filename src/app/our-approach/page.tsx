"use client"

import { useRef, useState } from "react"
import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { ChevronDown, ChevronUp, Lightbulb, Rocket, Code, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function OurApproachPage() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.1 })
  const { scrollYProgress } = useScroll()
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])

  return (
    <div className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900" />

      {/* Animated background shapes */}
      <motion.div
        className="absolute -z-10 top-0 left-0 right-0 h-screen pointer-events-none"
        style={{ y: backgroundY }}
      >
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-purple-200 dark:bg-purple-900/20 blur-3xl opacity-30" />
        <div className="absolute top-40 right-20 w-72 h-72 rounded-full bg-teal-200 dark:bg-teal-900/20 blur-3xl opacity-30" />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 rounded-full bg-amber-200 dark:bg-amber-900/20 blur-3xl opacity-30" />
      </motion.div>

      {/* Hero section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">Our Approach</h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
              We guide innovators through a comprehensive journey from idea to market-ready solution through our
              three-phase approach.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex justify-center mt-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 w-full max-w-5xl">
              {[
                {
                  icon: <Lightbulb className="h-8 w-8" />,
                  title: "Ideation",
                  description: "Refine your ideas and concepts",
                },
                {
                  icon: <Code className="h-8 w-8" />,
                  title: "Prototype Development",
                  description: "Turn ideas into working prototypes",
                },
                {
                  icon: <Rocket className="h-8 w-8" />,
                  title: "Incubation",
                  description: "Scale from startup to established company",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, delay: 0.4 + index * 0.2 },
                  }}
                  whileHover={{
                    y: -10,
                    scale: 1.05,
                    transition: {
                      type: "spring",
                      stiffness: 400,
                      damping: 10,
                    },
                  }}
                  className="relative flex flex-col items-center text-center p-6 bg-white dark:bg-slate-800 rounded-xl shadow-md transition-all duration-300 overflow-hidden group"
                >
                  {/* Animated background gradient */}
                  <motion.div
                    className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    initial={{
                      background:
                        "radial-gradient(circle at center, rgba(124, 58, 237, 0.1) 0%, rgba(255, 255, 255, 0) 70%)",
                    }}
                    animate={{
                      background: [
                        "radial-gradient(circle at center, rgba(124, 58, 237, 0.1) 0%, rgba(255, 255, 255, 0) 70%)",
                        "radial-gradient(circle at center, rgba(45, 212, 191, 0.1) 0%, rgba(255, 255, 255, 0) 70%)",
                        "radial-gradient(circle at center, rgba(251, 191, 36, 0.1) 0%, rgba(255, 255, 255, 0) 70%)",
                        "radial-gradient(circle at center, rgba(124, 58, 237, 0.1) 0%, rgba(255, 255, 255, 0) 70%)",
                      ],
                    }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 10,
                      ease: "linear",
                    }}
                  />

                  {/* Floating animation for the card */}
                  <motion.div
                    className="w-full h-full flex flex-col items-center"
                    animate={{
                      y: [0, -5, 0],
                    }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 3 + index,
                      ease: "easeInOut",
                    }}
                  >
                    {/* Icon with animation */}
                    <motion.div
                      className="p-3 rounded-full bg-gradient-to-br from-slate-100 to-white dark:from-slate-700 dark:to-slate-800 mb-4 shadow-md relative z-10 group-hover:shadow-lg group-hover:shadow-purple-200 dark:group-hover:shadow-purple-900/20"
                      whileHover={{
                        rotate: [0, -5, 5, -5, 0],
                        scale: 1.1,
                        transition: { duration: 0.5 },
                      }}
                    >
                      <motion.div
                        animate={{ rotate: [0, 5, 0, -5, 0] }}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 6, ease: "easeInOut" }}
                      >
                        {item.icon}
                      </motion.div>
                    </motion.div>

                    {/* Text content with staggered animations on hover */}
                    <motion.h3
                      className="text-xl font-semibold mb-2 relative"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      {item.title}
                      <motion.span
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 via-teal-500 to-amber-500 rounded-full origin-left"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        transition={{ duration: 0.8, delay: 0.6 + index * 0.2 }}
                      />
                    </motion.h3>
                    <motion.p
                      className="text-slate-600 dark:text-slate-400 relative z-10"
                      initial={{ opacity: 0.8 }}
                      whileHover={{ opacity: 1 }}
                    >
                      {item.description}
                    </motion.p>
                  </motion.div>

                  {/* Sparkle effects on hover */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 rounded-full bg-white shadow-lg shadow-purple-300 dark:shadow-purple-900/30"
                        initial={{
                          x: "50%",
                          y: "50%",
                          scale: 0,
                          opacity: 0,
                        }}
                        whileHover={{
                          x: `${Math.random() * 100}%`,
                          y: `${Math.random() * 100}%`,
                          scale: [0, 1.5, 0],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          delay: i * 0.2,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatDelay: 0.5,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main content */}
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
                title: "Introduction to Innovation and Design Thinking",
                content: [
                  "Overview of innovation methodologies and design thinking",
                  "Empathy mapping and understanding customer pain points",
                  "Creating problem statements and identifying solution opportunities",
                ],
              },
              {
                title: "Market Research & Opportunity Identification",
                content: [
                  "Tools for conducting market research (surveys, interviews, focus groups)",
                  "Competitor analysis and market trends",
                  "Identifying customer personas and unmet needs",
                ],
              },
              {
                title: "Idea Validation & Feasibility Analysis",
                content: [
                  "Techniques for validating ideas (MVP, customer feedback, early testing)",
                  "Financial feasibility: cost structure, revenue model, and pricing",
                  "Market testing with early prototypes or pilot programs",
                ],
              },
              {
                title: "Building a Value Proposition",
                content: [
                  "Crafting a clear and compelling value proposition",
                  "Defining your product's unique selling point (USP)",
                  "Communicating the benefits of your product to customers and investors",
                ],
              },
              {
                title: "Business Model Design",
                content: [
                  "Introduction to popular business model frameworks (Business Model Canvas, Lean Canvas)",
                  "Defining business goals and KPIs",
                  "Scaling strategies and identifying potential partnerships",
                ],
              },
              {
                title: "Pitching Your Idea",
                content: [
                  "Preparing an investor pitch",
                  "Communicating the potential impact and scalability of your idea",
                  "Pitching skills and techniques for convincing stakeholders",
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
                title: "Introduction to Prototyping",
                content: [
                  "Basics of prototyping: Why, When, and How to prototype",
                  "Types of prototypes: Low-fidelity vs. High-fidelity",
                  "Choosing the right prototyping tools and technologies",
                ],
              },
              {
                title: "Designing Your Prototype",
                content: [
                  "3D modeling software for product design",
                  "Biochip design, wearable devices, and bioprinting basics",
                  "Creating your first prototype using digital tools",
                ],
              },
              {
                title: "Rapid Prototyping Techniques",
                content: [
                  "Virtual prototyping: Using simulation tools to test designs",
                  "Online manufacturing partners and rapid prototyping services",
                  "Working with materials and understanding the prototyping process",
                ],
              },
              {
                title: "Testing and Refining Prototypes",
                content: [
                  "How to simulate real-world scenarios for testing",
                  "Gathering feedback through user testing and virtual simulations",
                  "Iterative prototyping and refinement techniques",
                ],
              },
              {
                title: "Simulation-Driven Development",
                content: [
                  "Leveraging AI-driven simulation tools for testing prototypes",
                  "Drug testing simulations, virus modeling, and bioprinting trials",
                  "Analyzing simulation results to improve prototype designs",
                ],
              },
              {
                title: "Bringing Prototypes to Life",
                content: [
                  "Turning digital models into physical prototypes",
                  "Collaborating with manufacturers for physical production",
                  "Managing the prototyping lifecycle and moving toward mass production",
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
                title: "Building a Strong Foundation for Your Startup",
                content: [
                  "Business strategy development and goal setting",
                  "Identifying key resources and partners for startup growth",
                  "Understanding the legal and regulatory landscape",
                ],
              },
              {
                title: "Financial Planning & Fundraising",
                content: [
                  "Managing startup finances: cash flow, revenue, and expenses",
                  "Preparing for investment: pitch decks, valuation, and funding rounds",
                  "Types of funding: venture capital, grants, crowdfunding, angel investors",
                ],
              },
              {
                title: "Go-to-Market Strategy & Branding",
                content: [
                  "Developing a marketing strategy and identifying key channels",
                  "Building a brand identity and value proposition",
                  "Using social media, PR, and digital marketing to grow your audience",
                ],
              },
              {
                title: "Sales Strategy & Customer Acquisition",
                content: [
                  "Creating a sales funnel: from lead generation to conversion",
                  "Pricing strategies and product-market fit",
                  "Customer relationship management and retention tactics",
                ],
              },
              {
                title: "Operations Management & Scaling",
                content: [
                  "Systems and processes for smooth operations as you scale",
                  "Managing teams, resources, and workflows",
                  "Automation and using tech tools to improve efficiency",
                ],
              },
              {
                title: "Pitching & Networking for Growth",
                content: [
                  "Perfecting your pitch for investors and partners",
                  "Building strong networks and leveraging connections",
                  "Attending pitch events, conferences, and startup accelerators",
                ],
              },
            ]}
          />
        </div>
      </div>

      {/* CTA Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-50 to-teal-50 dark:from-purple-950/30 dark:to-teal-950/30" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
          className="container px-4 md:px-6 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Idea?</h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto">
            Join our programs and get the support, resources, and guidance you need to bring your innovation to life.
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-6 text-lg"
          >
            Apply Now
          </Button>
        </motion.div>
      </section>
    </div>
  )
}

interface ProgramSectionProps {
  number: string;
  title: string;
  description: string;
  duration: string;
  icon: React.ReactNode;
  color: "purple" | "teal" | "amber";
  isInView: boolean;
  modules: {
    title: string;
    content: string[];
  }[];
}

function ProgramSection({ number, title, description, duration, icon, color, modules }: ProgramSectionProps) {
  const colorMap = {
    purple: "from-purple-500 to-purple-600",
    teal: "from-teal-500 to-teal-600",
    amber: "from-amber-500 to-amber-600",
  }

  const bgColorMap = {
    purple: "bg-purple-50 dark:bg-purple-900/10",
    teal: "bg-teal-50 dark:bg-teal-900/10",
    amber: "bg-amber-50 dark:bg-amber-900/10",
  }

  const borderColorMap = {
    purple: "border-purple-200 dark:border-purple-800",
    teal: "border-teal-200 dark:border-teal-800",
    amber: "border-amber-200 dark:border-amber-800",
  }

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
            <p className="text-slate-600 dark:text-slate-400 mb-6">{description}</p>
            <div className="flex items-center gap-2 mb-6">
              <div className={`p-2 rounded-full ${bgColorMap[color]}`}>{icon}</div>
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
                Comprehensive curriculum designed to guide you through every step of the process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {modules.map((module, index) => (
                  <ModuleCard key={index} module={module} index={index} color={color} colorMap={colorMap} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}

interface ModuleCardProps {
  module: {
    title: string;
    content: string[];
  };
  index: number;
  color: "purple" | "teal" | "amber";
  colorMap: Record<string, string>;
}

function ModuleCard({ module, index, color, colorMap }: ModuleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

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
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </Button>
      </div>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
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
  )
}

