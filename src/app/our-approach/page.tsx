// "use client"

// import { motion } from "framer-motion"
// import Hero from "./components/Hero"
// import CourseSection from "./components/CourseSection"

// export default function Home() {
//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 overflow-hidden">
//       <motion.main
//         className="container mx-auto px-4 py-8"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 1 }}
//       >
//         <Hero />
//         <CourseSection
//           title="Ideation Program"
//           duration="6 weeks"
//           format="Weekly workshops and mentoring sessions"
//           description="This course helps entrepreneurs and innovators refine their ideas and concepts by providing the essential tools, resources, and mentorship needed to turn an idea into a feasible and marketable solution."
//           modules={[
//             "Introduction to Innovation and Design Thinking",
//             "Market Research & Opportunity Identification",
//             "Idea Validation & Feasibility Analysis",
//             "Building a Value Proposition",
//             "Business Model Design",
//             "Pitching Your Idea",
//           ]}
//           image="/placeholder.svg"
//         />
//         <CourseSection
//           title="Prototype Development Program"
//           duration="8 weeks"
//           format="Access to Virtual labs, hands-on sessions"
//           description="In the Prototype Development Program, entrepreneurs and innovators will learn how to turn their validated ideas into working prototypes using virtual tools and digital prototyping techniques."
//           modules={[
//             "Introduction to Prototyping",
//             "Designing Your Prototype",
//             "Rapid Prototyping Techniques",
//             "Testing and Refining Prototypes",
//             "Simulation-Driven Development",
//             "Bringing Prototypes to Life",
//           ]}
//           image="/placeholder.svg"
//           buttonText="Go to PDC"
//           buttonLink="/pdc"
//         />
//         <CourseSection
//           title="Incubation Program"
//           duration="12 weeks"
//           format="Weekly expert-led sessions, case studies, virtual coworking spaces, and individual mentorship"
//           description="The Incubation Program focuses on helping startups scale from the early stages to established companies. Participants in this program will learn about business development, securing investment, market strategies, and managing the growth of their startups, all within a collaborative, virtual ecosystem."
//           modules={[
//             "Building a Strong Foundation for Your Startup",
//             "Financial Planning & Fundraising",
//             "Go-to-Market Strategy & Branding",
//             "Sales Strategy & Customer Acquisition",
//             "Operations Management & Scaling",
//             "Pitching & Networking for Growth",
//           ]}
//           image="/placeholder.svg"
//         />
//       </motion.main>
//     </div>
//   )
// }




"use client"
import { motion } from "framer-motion"
import Hero from "./components/Hero"
import CourseSection from "./components/CourseSection"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 overflow-hidden">
      <motion.main
        className="container mx-auto px-4 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Hero />
        <CourseSection
          title="Ideation Program"
          duration="6 weeks"
          format="Weekly workshops and mentoring sessions"
          description="This course helps entrepreneurs and innovators refine their ideas and concepts by providing the essential tools, resources, and mentorship needed to turn an idea into a feasible and marketable solution."
          modules={[
            "Introduction to Innovation and Design Thinking",
            "Market Research & Opportunity Identification",
            "Idea Validation & Feasibility Analysis",
            "Building a Value Proposition",
            "Business Model Design",
            "Pitching Your Idea",
          ]}
          image="/placeholder.svg"
          images={[
            "/api/placeholder/800/600",
            "/api/placeholder/800/600",
            "/api/placeholder/800/600",
            "/api/placeholder/800/600"
          ]}
        />
        <CourseSection
          title="Prototype Development Program"
          duration="8 weeks"
          format="Access to Virtual labs, hands-on sessions"
          description="In the Prototype Development Program, entrepreneurs and innovators will learn how to turn their validated ideas into working prototypes using virtual tools and digital prototyping techniques."
          modules={[
            "Introduction to Prototyping",
            "Designing Your Prototype",
            "Rapid Prototyping Techniques",
            "Testing and Refining Prototypes",
            "Simulation-Driven Development",
            "Bringing Prototypes to Life",
          ]}
          image="/placeholder.svg"
          images={[
            "/img1.jpg",
            "/img2.jpg",
            "/excellence1.jpg",
            "/excellence2.jpg"
          ]}
          buttonText="Go to PDC"
          buttonLink="/pdc"
        />
        <CourseSection
          title="Incubation Program"
          duration="12 weeks"
          format="Weekly expert-led sessions, case studies, virtual coworking spaces, and individual mentorship"
          description="The Incubation Program focuses on helping startups scale from the early stages to established companies. Participants in this program will learn about business development, securing investment, market strategies, and managing the growth of their startups, all within a collaborative, virtual ecosystem."
          modules={[
            "Building a Strong Foundation for Your Startup",
            "Financial Planning & Fundraising",
            "Go-to-Market Strategy & Branding",
            "Sales Strategy & Customer Acquisition",
            "Operations Management & Scaling",
            "Pitching & Networking for Growth",
          ]}
          image="/placeholder.svg"
          images={[
            "/api/placeholder/800/600",
            "/api/placeholder/800/600",
            "/api/placeholder/800/600",
            "/api/placeholder/800/600"
          ]}
        />
      </motion.main>
    </div>
  )
}