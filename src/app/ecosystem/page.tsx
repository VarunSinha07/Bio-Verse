"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, AnimatePresence } from "framer-motion"
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

const ecosystemComponents = [
  {
    title: "Virtual Incubation Hub",
    description:
      "Simulated environments for HealthTech design, bio-simulation, and prototype testing. AI-powered tools for genetic analysis, virus modeling, and biomarker analysis.",
    icon: "mdi:test-tube",
  },
  {
    title: "Bio Design Studio",
    description:
      "Virtual 3D modeling for biochip and wearable device design. Integration with online manufacturing partners for physical prototyping when required.",
    icon: "mdi:molecule",
  },
  {
    title: "AI Simulation Platform",
    description:
      "AI-powered simulations for real-time biological data analytics, pathogen behavior modeling, and drug discovery.",
    icon: "mdi:brain",
  },
]

const heroImages = ["/img1.jpg", "/img2.jpg"]

const EcosystemCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % ecosystemComponents.length)
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + ecosystemComponents.length) % ecosystemComponents.length)
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % ecosystemComponents.length)
  }

  return (
    <div className="relative h-[600px] overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className={`${cormorantGaramond.className} absolute inset-0 flex flex-col md:flex-row items-center gap-12 px-16 py-8`}
        >
          <div className="w-full md:w-1/2 space-y-6 order-2 md:order-1">
            <div className="flex items-center gap-6">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-sea-green to-teal-500 flex items-center justify-center text-white text-3xl overflow-hidden">
                <Icon icon={ecosystemComponents[currentIndex].icon} />
              </div>
              <h3 className={`${waterfall.className} text-7xl font-semibold text-sea-green`}>
                {ecosystemComponents[currentIndex].title}
              </h3>
            </div>
            <p className="text-3xl text-white">{ecosystemComponents[currentIndex].description}</p>
          </div>
          <div className="w-full md:w-1/2 aspect-square relative overflow-hidden rounded-lg order-1 md:order-2">
            <Image
              src="/img2.jpg"
              alt={ecosystemComponents[currentIndex].title}
              layout="fill"
              objectFit="cover"
              className="transition-all duration-300"
            />
          </div>
        </motion.div>
      </AnimatePresence>
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-300"
        aria-label="Previous component"
      >
        <Icon icon="mdi:chevron-left" className="text-3xl" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-300"
        aria-label="Next component"
      >
        <Icon icon="mdi:chevron-right" className="text-3xl" />
      </button>
    </div>
  )
}

export default function Ecosystem() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="relative h-screen overflow-hidden">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={heroImages[currentImageIndex] || "/placeholder.svg"}
              alt={`Ecosystem image ${currentImageIndex + 1}`}
              layout="fill"
              objectFit="cover"
              priority
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <motion.div
              className={`${cormorantGaramond.className} text-xl md:text-4xl text-white space-y-6`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <p>Bioverse integrates a comprehensive digital ecosystem that drives advancements in</p>
              <p className={`${waterfall.className} text-3xl md:text-7xl font-bold text-white`}>Life Sciences</p>
              <p className={`${waterfall.className} text-3xl md:text-7xl font-bold text-white`}>HealthTech</p>
              <p className={`${waterfall.className} text-3xl md:text-7xl font-bold text-white`}>
                Environmental Technologies
              </p>

            </motion.div>
          </div>
        </div>
      </div>

      <div ref={containerRef} className="bg-black py-16 px-4 sm:px-6 lg:px-8 relative">
        <h2 className={`${cormorantGaramond.className} text-5xl font-bold text-center text-sea-green mb-16`}>
          Our Ecosystem Components
        </h2>
        <EcosystemCarousel />
      </div>
    </div>
  )
}

