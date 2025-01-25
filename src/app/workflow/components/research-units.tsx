"use client"

import { useRef } from "react"
import { motion, useInView, useScroll, useTransform } from "framer-motion"
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

const researchUnits = [
  {
    title: "AI-Driven Pathogen Simulation",
    description: [
      "Predictive modeling of virus mutations and epidemic trajectories.",
      "Tools to visualize geographic spread and impact zones.",
    ],
    icon: "mdi:virus",
    image: "/img1.jpg",
  },
  {
    title: "Digital Bioprinting & Biochip Design",
    description: [
      "Virtual modeling of bioprinting workflows and biochip layouts.",
      "Real-time adjustments for efficiency and performance optimization.",
    ],
    icon: "mdi:printer-3d",
    image: "/img1.jpg",
  },
  {
    title: "Personalized Medicine Simulations",
    description: [
      "AI algorithms to model patient-specific responses to treatments.",
      "Tools to simulate genetic interactions and drug efficacy.",
    ],
    icon: "mdi:dna",
    image: "/img1.jpg",
  },
]

const ResearchUnitItem = ({ unit }: { unit: (typeof researchUnits)[0] }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8])

  return (
    <motion.div
      ref={ref}
      style={{ opacity, scale }}
      className={`${cormorantGaramond.className} flex flex-col md:flex-row items-center gap-4 group mb-8`}
    >
      <motion.div
        className="w-full md:w-1/2 aspect-square relative overflow-hidden rounded-full order-1 md:order-2"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        <Image
          src={unit.image || "/placeholder.svg"}
          alt={unit.title}
          layout="fill"
          objectFit="cover"
          className="transition-all duration-500 filter brightness-90 group-hover:brightness-110"
        />
      </motion.div>
      <div className="w-full md:w-1/2 space-y-2 order-2 md:order-1">
        <motion.div
          className="flex items-center gap-3"
          initial={{ x: -50, opacity: 0 }}
          animate={isInView ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div
            className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-xl overflow-hidden group-hover:scale-110 transition-transform duration-300"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <Icon icon={unit.icon} />
          </motion.div>
          <h3 className="text-2xl font-semibold text-teal-700 group-hover:text-teal-500 transition-colors duration-300">
            {unit.title}
          </h3>
        </motion.div>
        {unit.description.map((desc, i) => (
          <motion.p
            key={i}
            className="text-lg text-teal-700 group-hover:text-teal-600 transition-colors duration-300"
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
          >
            {desc}
          </motion.p>
        ))}
      </div>
    </motion.div>
  )
}

export default function ResearchUnits() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <motion.h1
          className={`${waterfall.className} text-5xl md:text-6xl lg:text-7xl text-center mb-8`}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ color: "#2E8B57" }}
        >
          Research Units
        </motion.h1>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }}>
          {researchUnits.map((unit) => (
            <ResearchUnitItem key={unit.title} unit={unit} />
          ))}
        </motion.div>
      </div>
    </div>
  )
}

