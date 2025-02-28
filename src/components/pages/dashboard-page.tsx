"use client"

import { useEffect, useState } from "react"
import { useSession } from "@/lib/auth-client"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Dna, Microscope, FlaskRoundIcon as Flask, Atom, Zap, CheckCircle, Download, Calendar, BookOpen } from "lucide-react"
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

interface BusinessPlan {
  problemStatement: string
  targetAudience: string
  revenueModel: string
  competitorAnalysis: string
  uniqueValueProposition: string
}

interface Documents {
  foundersProfile?: File
  productMockups?: File
  marketResearch?: File
}

interface MentorSession {
  availability: string
  questions: string
}

interface ProgramAllotment {
  acceptanceConfirmation: boolean
  startDate: string
  resourceRequirements: string
}

interface DashboardData {
  questionnaire: Questionnaire
  businessPlan?: BusinessPlan
  documents?: Documents
  mentorSession?: MentorSession
  programAllotment?: ProgramAllotment
  currentStage: number
  status: string
}

export default function DashboardPage() {
  const session = useSession()
  const isPending = session?.isPending
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeStage, setActiveStage] = useState<number>(1)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchDashboardData() {
      if (session?.data?.user?.id) {
        try {
          // First try to fetch from the dashboard endpoint
          let response = await fetch("/api/dashboard-data")
          
          if (!response.ok) {
            // If dashboard data isn't available, fall back to primary details
            response = await fetch("/api/primary-details-fetch")
            
            if (response.ok) {
              const primaryData = await response.json()
              
              // Create dashboard data structure from primary details
              // Assuming the user table has stage and status fields that need to be included
              const response2 = await fetch("/api/user-stage")
              let stage = 1
              let status = ""
              
              if (response2.ok) {
                const userData = await response2.json()
                stage = userData.stage || 1
                status = userData.status || ""
              }
              
              setDashboardData({
                questionnaire: primaryData.questionnaire,
                currentStage: stage,
                status: status
              })
              setActiveStage(stage)
            } else {
              throw new Error("Failed to fetch user data")
            }
          } else {
            const data = await response.json()
            setDashboardData(data)
            setActiveStage(data.currentStage)
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
        body: JSON.stringify({
          currentStage: dashboardData?.currentStage,
          newStatus: `Applied for Stage ${(dashboardData?.currentStage ?? 0) + 1}`
        })
      })

      if (!response.ok) {
        throw new Error("Failed to submit stage progression")
      }

      // Update local state with new status
      setDashboardData(prev => {
        if (!prev) return null
        return {
          ...prev,
          status: `Applied for Stage ${prev.currentStage + 1}`
        }
      })

      toast({
        title: "Application Submitted",
        description: `Your application for Stage ${(dashboardData?.currentStage ?? 0) + 1} has been submitted. You will receive an email when it gets approved.`,
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

  const handleDownloadTemplate = () => {
    // This would be implemented to download business plan template
    toast({
      title: "Download Started",
      description: "Business plan template is downloading",
      duration: 3000,
    })
  }

  const handleStageClick = (stage: number) => {
    if (dashboardData && (stage <= dashboardData.currentStage)) {
      setActiveStage(stage)
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

  if (!dashboardData || !dashboardData.questionnaire) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-4 flex items-center justify-center">
        <Card className="max-w-md w-full bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <p className="text-center text-gray-700">No dashboard data available. Please complete your profile.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { questionnaire, businessPlan, mentorSession, programAllotment, currentStage, status } = dashboardData

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

        {/* Stage Progress Indicators */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
          className="flex justify-center"
        >
          <div className="flex items-center justify-center gap-2 md:gap-4 p-4 bg-white/80 rounded-xl shadow-md w-full max-w-3xl">
            {[1, 2, 3, 4].map((stage) => (
              <div 
                key={stage} 
                onClick={() => handleStageClick(stage)} 
                className={`
                  relative flex flex-col items-center cursor-pointer transition-all duration-300
                  ${stage <= currentStage ? 'opacity-100' : 'opacity-50'}
                `}
              >
                <div 
                  className={`
                    w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-white font-bold text-lg
                    ${stage < currentStage ? 'bg-green-500' : stage === currentStage ? 'bg-red-500' : 'bg-gray-300'}
                    ${activeStage === stage ? 'ring-4 ring-blue-300' : ''}
                    ${stage <= currentStage ? 'hover:scale-110' : ''}
                    transition-all duration-300
                  `}
                >
                  {stage < currentStage ? <CheckCircle size={24} /> : stage}
                </div>
                <div className="text-center mt-2 text-sm font-medium">
                  Stage {stage}
                </div>
                {stage < 4 && (
                  <div className="absolute top-6 left-full w-6 md:w-10 h-0.5 bg-gray-300 -z-10"></div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Status Indicator */}
        {status && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-blue-50 border border-blue-200 shadow-md">
              <CardContent className="p-4 flex items-center justify-center">
                <p className="text-blue-700 font-medium">Current Status: {status}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Stage 1: Primary Details */}
        {activeStage === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-600">
                  Stage 1: Primary Details
                </CardTitle>
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
                  <DetailItem icon={<Zap />} title="Current Stage" value={questionnaire?.stage || "Not specified"} />
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
        )}

        {/* Stage 2: Feedback and Additional Details */}
        {activeStage === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-600 flex items-center justify-between">
                  <span>Stage 2: Feedback and Additional Details</span>
                  <Button variant="outline" className="flex items-center gap-2" onClick={handleDownloadTemplate}>
                    <Download size={18} />
                    <span>Download Template</span>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="font-semibold text-lg text-green-700 mb-4">Detailed Business Plan</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DetailItem 
                    icon={<BookOpen />} 
                    title="Problem Statement" 
                    value={businessPlan?.problemStatement || "Not submitted"} 
                  />
                  <DetailItem 
                    icon={<User />} 
                    title="Target Audience" 
                    value={businessPlan?.targetAudience || "Not submitted"} 
                  />
                  <DetailItem 
                    icon={<Zap />} 
                    title="Revenue Model" 
                    value={businessPlan?.revenueModel || "Not submitted"} 
                  />
                  <DetailItem 
                    icon={<Microscope />} 
                    title="Competitor Analysis" 
                    value={businessPlan?.competitorAnalysis || "Not submitted"} 
                  />
                  <DetailItem 
                    icon={<Atom />} 
                    title="Unique Value Proposition" 
                    value={businessPlan?.uniqueValueProposition || "Not submitted"} 
                    className="col-span-full"
                  />
                </div>

                <h3 className="font-semibold text-lg text-green-700 mt-6 mb-4">Required Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <DocumentUploadCard 
                    title="Founders' Profiles" 
                    isUploaded={!!dashboardData.documents?.foundersProfile}
                  />
                  <DocumentUploadCard 
                    title="Product/Service Mockups" 
                    isUploaded={!!dashboardData.documents?.productMockups}
                  />
                  <DocumentUploadCard 
                    title="Market Research Reports" 
                    isUploaded={!!dashboardData.documents?.marketResearch}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Stage 3: Mentor Session */}
        {activeStage === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-600">
                  Stage 3: Mentor Session
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-6">
                  <DetailItem 
                    icon={<Calendar />} 
                    title="Availability for Mentor Session" 
                    value={mentorSession?.availability || "Not specified"} 
                  />
                  <DetailItem 
                    icon={<BookOpen />} 
                    title="Pre-session Questions/Expectations" 
                    value={mentorSession?.questions || "Not specified"} 
                    className="col-span-full"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Stage 4: Program Allotment */}
        {activeStage === 4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-600">
                  Stage 4: Program Allotment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DetailItem 
                    icon={<CheckCircle />} 
                    title="Acceptance Confirmation" 
                    value={programAllotment?.acceptanceConfirmation ? "Confirmed" : "Not confirmed"} 
                  />
                  <DetailItem 
                    icon={<Calendar />} 
                    title="Preferred Start Date" 
                    value={programAllotment?.startDate || "Not specified"} 
                  />
                  <DetailItem 
                    icon={<Zap />} 
                    title="Additional Resource Requirements" 
                    value={programAllotment?.resourceRequirements || "Not specified"} 
                    className="col-span-full"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Next Stage Button - only show if on current stage and not already applied */}
        {activeStage === dashboardData.currentStage && 
         !status?.includes(`Applied for Stage ${currentStage + 1}`) && 
         currentStage < 4 && (
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
              {isSubmitting ? "Submitting..." : `Apply for Stage ${currentStage + 1}`}
            </Button>
          </motion.div>
        )}
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

interface DocumentUploadCardProps {
  title: string;
  isUploaded: boolean;
}

function DocumentUploadCard({ title, isUploaded }: DocumentUploadCardProps) {
  return (
    <motion.div
      className="bg-white/50 p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-300"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <h3 className="font-semibold flex items-center gap-2 text-green-700 mb-2">
        {isUploaded ? <CheckCircle className="text-green-500" /> : <Download />}
        {title}
      </h3>
      <p className="text-blue-600">{isUploaded ? "Uploaded" : "Not uploaded"}</p>
    </motion.div>
  )
}