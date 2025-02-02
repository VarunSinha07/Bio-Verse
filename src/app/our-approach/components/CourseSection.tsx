// "use client"

// import { useState } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import { ChevronDown, ChevronUp } from "lucide-react"
// import Link from "next/link"
// import Image from "next/image"

// interface CourseSectionProps {
//   title: string
//   duration: string
//   format: string
//   description: string
//   modules: string[]
//   image: string
//   buttonText?: string
//   buttonLink?: string
// }

// export default function CourseSection({
//   title,
//   duration,
//   format,
//   description,
//   modules,
  
//   buttonText,
//   buttonLink,
// }: CourseSectionProps) {
//   const [isExpanded, setIsExpanded] = useState(false)

//   return (
//     <motion.section
//       initial={{ opacity: 0, y: 50 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//       className="bg-white rounded-lg shadow-lg p-6 mb-8"
//     >
//       <div className="flex flex-col md:flex-row items-center mb-4">
//         <motion.div
//           className="w-full md:w-1/3 mb-4 md:mb-0 md:mr-6"
//           whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgb(79, 70, 229)" }}
//           transition={{ duration: 0.3 }}
//         >
//           <Image src="/placeholder.svg" alt={title} className="w-full h-auto rounded-lg" />
//         </motion.div>
//         <div className="w-full md:w-2/3">
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
//           <p className="text-gray-600 mb-2">Duration: {duration}</p>
//           <p className="text-gray-600 mb-4">Format: {format}</p>
//           <p className="text-gray-700 mb-4">{description}</p>
//           {buttonText && buttonLink && (
//             <Link href={buttonLink}>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-300"
//               >
//                 {buttonText}
//               </motion.button>
//             </Link>
//           )}
//         </div>
//       </div>
//       <motion.button
//         onClick={() => setIsExpanded(!isExpanded)}
//         className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors duration-300"
//         whileHover={{ scale: 1.05 }}
//         whileTap={{ scale: 0.95 }}
//       >
//         {isExpanded ? "Hide Modules" : "Show Modules"}
//         {isExpanded ? <ChevronUp className="ml-2" /> : <ChevronDown className="ml-2" />}
//       </motion.button>
//       <AnimatePresence>
//         {isExpanded && (
//           <motion.ul
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: "auto" }}
//             exit={{ opacity: 0, height: 0 }}
//             transition={{ duration: 0.3 }}
//             className="mt-4 space-y-2"
//           >
//             {modules.map((module, index) => (
//               <motion.li
//                 key={index}
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.3, delay: index * 0.1 }}
//                 className="flex items-center text-gray-700"
//               >
//                 <span className="w-4 h-4 bg-indigo-200 rounded-full mr-2"></span>
//                 {module}
//               </motion.li>
//             ))}
//           </motion.ul>
//         )}
//       </AnimatePresence>
//     </motion.section>
//   )
// }









"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp } from "lucide-react"

interface CourseSectionProps {
  title: string
  duration: string
  format: string
  description: string
  modules: string[]
  image: string
  images?: string[]
  buttonText?: string
  buttonLink?: string
}

export default function CourseSection({
  title,
  duration,
  format,
  description,
  modules = [], 
  image,
  images = [],
  buttonText,
  buttonLink,
}: CourseSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  // Use the provided image as the first image if images array is empty
  const allImages = images.length > 0 ? images : [image, image, image, image]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
    }, 2500)

    return () => clearInterval(interval)
  }, [allImages.length])

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-lg p-6 mb-8"
    >
      <div className="flex flex-col md:flex-row items-center mb-4">
        <motion.div
          className="w-full md:w-1/3 mb-4 md:mb-0 md:mr-6 relative overflow-hidden rounded-lg"
          whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgb(79, 70, 229)" }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative w-full aspect-video">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                src={allImages[currentImageIndex] || "/placeholder.svg"}
                alt={`${title} - Image ${currentImageIndex + 1}`}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 w-full h-full object-cover rounded-lg"
              />
            </AnimatePresence>
            <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
              {allImages.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentImageIndex ? "bg-indigo-600" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
        <div className="w-full md:w-2/3">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
          <p className="text-gray-600 mb-2">Duration: {duration}</p>
          <p className="text-gray-600 mb-4">Format: {format}</p>
          <p className="text-gray-700 mb-4">{description}</p>
          {buttonText && buttonLink && (
            <a href={buttonLink}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-300"
              >
                {buttonText}
              </motion.button>
            </a>
          )}
        </div>
      </div>
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isExpanded ? "Hide Modules" : "Show Modules"}
        {isExpanded ? <ChevronUp className="ml-2" /> : <ChevronDown className="ml-2" />}
      </motion.button>
      <AnimatePresence>
        {isExpanded && (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 space-y-2"
          >
            {modules.map((module, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center text-gray-700"
              >
                <span className="w-4 h-4 bg-indigo-200 rounded-full mr-2"></span>
                {module}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.section>
  )
}
