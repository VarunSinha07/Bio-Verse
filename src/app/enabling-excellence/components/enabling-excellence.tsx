"use client"

import { useRef } from "react"
import { motion, useScroll, useInView } from "framer-motion"
import { Cormorant_Garamond, Waterfall } from "next/font/google"
import { Icon } from "@iconify/react"
import Image from "next/image"

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

const waterfall = Waterfall({
  subsets: ["latin"],
  weight: ["400"],
})

const features = [
  {
    title: "Integrated Laboratory Management & Analytics",
    description:
      "Centralized sample tracking and secure data storage with LIMS. Automated data integration from diverse laboratory workflows for seamless analytics.",
    icon: "mdi:flask-outline",
    image: "/img1.jpg",
  },
  {
    title: "AI-Powered Simulations",
    description:
      "Virus Modeling predicts evolution, spread patterns, and potential impact zones of pathogens. Pathogen Behavior Analysis simulates interactions between pathogens and their environments.",
    icon: "mdi:brain",
    image: "/img1.jpg",
  },
  {
    title: "Real-Time Outbreak Predictions",
    description:
      "Combines LIMS-stored data with geographic and demographic datasets. Provides actionable insights into high-risk regions, enabling proactive public health measures.",
    icon: "mdi:chart-bell-curve-cumulative",
    image: "/img1.jpg",
  },
  {
    title: "Drug Discovery Simulations",
    description:
      "Utilizes genetic, biomarker, and pathogen data from LIMS for targeted simulations. AI algorithms predict drug efficacy and resistance mechanisms, accelerating therapeutic development.",
    icon: "mdi:pill",
    image: "/img1.jpg",
  },
  {
    title: "Predictive Analytics for Public Health",
    description:
      "Identifies trends and correlations in infection rates, resistance patterns, and treatment outcomes. Suggests resource allocation strategies for effective epidemic management.",
    icon: "mdi:chart-scatter-plot",
    image: "/img1.jpg",
  },
]

const FeatureItem = ({ feature }: { feature: (typeof features)[0] }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { margin: "-40% 0px -40% 0px" })

  return (
    <div ref={ref} className="min-h-screen flex items-center justify-center mb-[30vh]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5 }}
        className={`${cormorantGaramond.className} flex flex-col md:flex-row items-center gap-12 group`}
      >
        <motion.div
          className="w-full md:w-1/2 aspect-square relative overflow-hidden rounded-lg order-1 md:order-2"
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.9, y: 50 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src={feature.image || "/img1.jpg"}
            alt={feature.title}
            layout="fill"
            objectFit="cover"
            className="transition-all duration-300 filter grayscale group-hover:grayscale-0"
          />
        </motion.div>
        <div className="w-full md:w-1/2 space-y-6 order-2 md:order-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex items-center gap-6"
          >
            <motion.div
              className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white text-3xl overflow-hidden group-hover:scale-110 transition-transform duration-300"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <Icon icon={feature.icon} />
            </motion.div>
            <h3 className="text-2xl font-semibold text-teal-700 group-hover:text-blue-600 transition-colors duration-300">
              {feature.title}
            </h3>
          </motion.div>
          <motion.p
            className="text-lg text-gray-600 group-hover:text-gray-800 transition-colors duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            {feature.description}
          </motion.p>
        </div>
      </motion.div>
    </div>
  )
}

export default function EnablingExcellence() {
  const containerRef = useRef<HTMLDivElement>(null)

  useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="relative h-[60vh] overflow-hidden">
        <Image src="/img1.jpg" alt="Hero image" layout="fill" objectFit="cover" priority />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <motion.h1
            className={`${waterfall.className} text-5xl md:text-7xl text-center text-white`}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Enabling Excellence
          </motion.h1>
        </div>
      </div>

      <div ref={containerRef} className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 relative pb-[20vh]">
        {features.map((feature) => (
          <FeatureItem key={feature.title} feature={feature} />
        ))}
      </div>
    </div>
  )
}

