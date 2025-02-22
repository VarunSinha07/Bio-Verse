"use client"

import { useEffect, useState } from "react"
import { useSession } from "@/lib/auth-client"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Dna, Microscope, FlaskRoundIcon as Flask, Atom, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"

interface Questionnaire {
  name: string
  role: string
  startUpName?: string
  industry: string
  stage: string
  website?: string
  ideaTitle: string
  ideaDescription: string
}

interface DashboardData {
  questionnaire: Questionnaire
}

export default function DashboardPage() {
  const session = useSession()
  const isPending = session?.isPending
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchDashboardData() {
      if (session?.data?.user?.id) {
        try {
          const response = await fetch("/api/primary-details-fetch")
          if (response.ok) {
            const data = await response.json()
            setDashboardData(data)
          }
        } catch (error) {
          console.error("Error fetching dashboard data:", error)
          toast({
            title: "Error",
            description: "Failed to load dashboard data",
            variant: "destructive",
          })
        } finally {
          setLoading(false)
        }
      }
    }

    fetchDashboardData()
  }, [session, toast])

  const handleNextStage = async () => {
    try {
      setIsSubmitting(true)

      const response = await fetch("/api/stage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to submit stage progression")
      }

      toast({
        title: "Application Submitted",
        description: "Your Application for stage 2 has been submitted. You will receive a mail when it gets approved.",
        duration: 5000,
      })
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "Failed to submit stage progression. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isPending || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500">
        <div className="text-center">
          <motion.div
            className="w-16 h-16 border-4 border-white border-t-transparent rounded-full mx-auto"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
          <p className="mt-4 text-white text-lg font-semibold">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session?.data) {
    redirect("/sign-in")
  }

  const { questionnaire } = dashboardData || {}

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-6xl mx-auto space-y-6">
        {/* User Welcome Section */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl text-green-600">
                <User className="w-8 h-8" />
                Welcome, {session?.data?.user?.email}
              </CardTitle>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Questionnaire Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-600">Primary Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DetailItem icon={<User />} title="Name" value={questionnaire?.name || "Not specified"} />
                <DetailItem icon={<Microscope />} title="Role" value={questionnaire?.role || "Not specified"} />
                <DetailItem
                  icon={<Flask />}
                  title="Startup Name"
                  value={questionnaire?.startUpName || "Not specified"}
                />
                <DetailItem icon={<Atom />} title="Industry" value={questionnaire?.industry || "Not specified"} />
                <DetailItem icon={<Zap />} title="Current Stage" value={questionnaire?.stage ?? "Not specified"} />
                <DetailItem icon={<Dna />} title="Website" value={questionnaire?.website || "Not specified"} />
                <DetailItem
                  icon={<Microscope />}
                  title="Idea Title"
                  value={questionnaire?.ideaTitle || "Not specified"}
                  className="col-span-full"
                />
                <DetailItem
                  icon={<Flask />}
                  title="Idea Description"
                  value={questionnaire?.ideaDescription || "Not specified"}
                  className="col-span-full"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Next Stage Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center"
        >
          <Button
            className="w-full md:w-1/2 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            onClick={handleNextStage}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Apply for Next Stage"}
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

interface DetailItemProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  className?: string;
}

function DetailItem({ icon, title, value, className = "" }: DetailItemProps) {
  return (
    <motion.div
      className={`bg-white/50 p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-300 ${className}`}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <h3 className="font-semibold flex items-center gap-2 text-green-700 mb-2">
        {icon}
        {title}
      </h3>
      <p className="text-blue-600">{value}</p>
    </motion.div>
  )
}

