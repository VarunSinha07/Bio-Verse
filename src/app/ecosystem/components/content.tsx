"use client"

import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { useEffect } from "react"
import { Cormorant_Garamond } from "next/font/google"

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

const ecosystemComponents = [
  { title: "Research Labs", description: "State-of-the-art facilities for groundbreaking discoveries" },
  { title: "Incubators", description: "Nurturing environments for early-stage biotech startups" },
  { title: "Collaboration Hubs", description: "Spaces designed for cross-disciplinary innovation" },
  { title: "Data Centers", description: "Advanced computing power for complex biotech simulations" },
  { title: "Funding Networks", description: "Connecting innovators with investors in the biotech space" },
  { title: "Education Centers", description: "Cultivating the next generation of biotech leaders" },
]

function EcosystemTile({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-black text-white p-6 rounded-lg shadow-lg">
      <h3 className={`text-2xl font-bold mb-2 ${cormorantGaramond.className}`}>{title}</h3>
      <p className={`text-sea-green ${cormorantGaramond.className}`}>{description}</p>
    </div>
  )
}

export default function EcosystemContent() {
  const controls = useAnimation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  const contentVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={contentVariants}
      className="py-16 px-4 bg-white"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className={`text-4xl font-bold mb-8 text-center text-black ${cormorantGaramond.className}`}>
          Components of Our Ecosystem
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ecosystemComponents.map((component, index) => (
            <EcosystemTile key={index} {...component} />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

