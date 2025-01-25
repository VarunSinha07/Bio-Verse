"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { Cormorant_Garamond, Waterfall } from "next/font/google"

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

const waterfall = Waterfall({
  subsets: ["latin"],
  weight: ["400"],
})

const steps = [
  {
    title: "Data Integration",
    description:
      "LIMS collects, organizes, and standardizes laboratory data from genetic analysis, biomarker detection, and pathogen studies.",
  },
  {
    title: "AI-Driven Modeling",
    description:
      "Virus simulation software processes data to predict mutations, spread pathways, and outbreak scenarios. Drug discovery modules simulate molecular interactions.",
  },
  {
    title: "Outcome Generation",
    description:
      "Generates dynamic reports with real-time predictions for outbreak zones and drug efficacy. Visual dashboards display actionable insights.",
  },
  {
    title: "Feedback Loop",
    description:
      "Continuous data input from LIMS updates the simulations, ensuring models remain accurate and adaptive.",
  },
]

const HowItWorks = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const tracingBeamProgress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  return (
    <section ref={containerRef} className="py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.h2
          className={`text-7xl font-extrabold text-center mb-24 text-sea-green ${waterfall.className}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          How It Works
        </motion.h2>
        <div className="max-w-4xl mx-auto relative">
          <motion.div
            className="absolute left-0 top-0 w-3 bg-gradient-to-b from-sea-green via-ocean-blue to-sea-green"
            style={{
              height: tracingBeamProgress,
              backgroundSize: "100% 400%",
              backgroundPosition: "center",
              animation: "gradientFlow 8s linear infinite",
              opacity: 1,
              boxShadow: "0 0 10px rgba(46, 139, 87, 0.5), 0 0 20px rgba(65, 105, 225, 0.3)",
            }}
          />
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="mb-32 pl-16 relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <h3 className={`text-4xl font-semibold mb-4 text-ocean-blue ${cormorantGaramond.className}`}>
                {step.title}
              </h3>
              <motion.p
                className={`text-xl text-gray-700 ${cormorantGaramond.className}`}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {step.description}
              </motion.p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks

