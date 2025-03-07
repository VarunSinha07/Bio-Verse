"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useSession } from "@/lib/auth-client"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  User,
  Dna,
  Microscope,
  FlaskRoundIcon as Flask,
  Atom,
  Zap,
  CheckCircle,
  Download,
  Calendar,
  BookOpen,
  Upload,
  FileText,
  X,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

import { Textarea } from "@/components/ui/textarea"

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
  uniqueValueProposition: string
}

interface Documents {
  competitorAnalysis?: string
  foundersProfile?: string
  productMockups?: string
  marketResearch?: string
  signedNDA?: string
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

// Component for displaying details
interface DetailItemProps {
  icon: React.ReactNode
  title: string
  value: string
  className?: string
}

const DetailItem = ({ icon, title, value, className = "" }: DetailItemProps) => (
  <div
    className={`p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:bg-white hover:translate-y-[-2px] ${className}`}
  >
    <div className="flex items-center gap-2 mb-2 text-blue-600">
      <div className="p-2 bg-blue-100 rounded-full transition-all duration-300 group-hover:bg-blue-200">{icon}</div>
      <h3 className="font-semibold">{title}</h3>
    </div>
    <p className="text-gray-700 whitespace-pre-line">{value}</p>
  </div>
)

// Component for displaying document status
interface DocumentItemProps {
  title: string
  isUploaded: boolean
}

const DocumentItem = ({ title, isUploaded }: DocumentItemProps) => (
  <div className="p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:bg-white hover:translate-y-[-2px]">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-blue-100 rounded-full">
          <FileText className="text-blue-600" />
        </div>
        <h3 className="font-medium">{title}</h3>
      </div>
      <div
        className={`px-3 py-1 rounded-full text-sm ${
          isUploaded ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
        } transition-colors duration-300`}
      >
        {isUploaded ? (
          <span className="flex items-center gap-1">
            <CheckCircle size={14} />
            Uploaded
          </span>
        ) : (
          "Not Uploaded"
        )}
      </div>
    </div>
  </div>
)
// Component for document upload UI
interface DocumentUploadProps {
  title: string
  description: string
  fileType: string
  inputRef: React.RefObject<HTMLInputElement | null>
  isUploaded: boolean
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleRemoveFile: () => void
  required?: boolean
}

const DocumentUpload = ({
  title,
  description,
  inputRef,
  isUploaded,
  handleFileChange,
  handleRemoveFile,
  required = false,
}: DocumentUploadProps) => (
  <div className="p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:bg-white hover:translate-y-[-2px]">
    <div className="flex items-center gap-2 mb-2 text-blue-600">
      <div className="p-2 bg-blue-100 rounded-full">
        <FileText />
      </div>
      <h3 className="font-semibold">{title}</h3>
    </div>
    <p className="text-sm text-gray-500 mb-3">{description}</p>

    {isUploaded ? (
      <div className="flex items-center justify-between bg-green-50 p-3 rounded-md border border-green-100 hover:bg-green-100 transition-colors duration-300">
        <span className="text-green-600 flex items-center gap-2">
          <CheckCircle size={16} />
          <span className="text-sm font-medium">File selected</span>
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRemoveFile}
          className="h-8 w-8 p-0 rounded-full hover:bg-red-100 hover:text-red-500 transition-colors duration-300"
        >
          <X size={16} className="text-gray-500" />
        </Button>
      </div>
    ) : (
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-1 text-gray-500 group-hover:text-blue-500 transition-colors duration-300" />
            <p className="mb-1 text-sm text-gray-500 group-hover:text-blue-600 transition-colors duration-300">
              <span className="font-semibold">Click to upload</span>
            </p>
            <p className="text-xs text-gray-500">PDF only</p>
          </div>
          <input
            type="file"
            className="hidden"
            ref={inputRef}
            accept=".pdf"
            onChange={handleFileChange}
            required={required}
          />
        </label>
      </div>
    )}
  </div>
)

export default function DashboardPage() {
  const session = useSession();
  const isPending = session?.isPending;
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeStage, setActiveStage] = useState<number>(1);
  const { toast } = useToast();

  // Form state for stage 2
  const [businessPlanForm, setBusinessPlanForm] = useState<BusinessPlan>({
    problemStatement: '',
    targetAudience: '',
    revenueModel: '',
    uniqueValueProposition: '',
  });

  // File upload references and state
  const competitorAnalysisRef = useRef<HTMLInputElement>(null);
  const foundersProfileRef = useRef<HTMLInputElement>(null);
  const productMockupsRef = useRef<HTMLInputElement>(null);
  const marketResearchRef = useRef<HTMLInputElement>(null);
  const signedNDARef = useRef<HTMLInputElement>(null);

  const [selectedFiles, setSelectedFiles] = useState<{
    competitorAnalysis?: File;
    foundersProfile?: File;
    productMockups?: File;
    marketResearch?: File;
    signedNDA?: File;
  }>({});

  // For showing preview of uploaded files
  const [uploadedDocuments, setUploadedDocuments] = useState<{
    competitorAnalysis?: boolean;
    foundersProfile?: boolean;
    productMockups?: boolean;
    marketResearch?: boolean;
    signedNDA?: boolean;
  }>({});

  useEffect(() => {
    async function fetchDashboardData() {
      if (session?.data?.user?.id) {
        try {
          // First try to fetch from the dashboard endpoint
          let response = await fetch('/api/dashboard-data');

          if (!response.ok) {
            // If dashboard data isn't available, fall back to primary details
            response = await fetch('/api/primary-details-fetch');

            if (response.ok) {
              const primaryData = await response.json();

              // Create dashboard data structure from primary details
              // Assuming the user table has stage and status fields that need to be included
              const response2 = await fetch('/api/user-stage');
              let stage = 1;
              let status = '';

              if (response2.ok) {
                const userData = await response2.json();
                stage = userData.stage || 1;
                status = userData.status || '';
              }

              setDashboardData({
                questionnaire: primaryData.questionnaire,
                currentStage: stage,
                status: status,
              });
              setActiveStage(stage);
            } else {
              throw new Error('Failed to fetch user data');
            }
          } else {
            const data = await response.json();
            setDashboardData(data);
            setActiveStage(data.currentStage);

            // If business plan data exists, populate the form
            if (data.businessPlan) {
              setBusinessPlanForm(data.businessPlan);
            }

            // If documents exist, mark them as uploaded
            if (data.documents) {
              setUploadedDocuments({
                competitorAnalysis: !!data.documents.competitorAnalysis,
                foundersProfile: !!data.documents.foundersProfile,
                productMockups: !!data.documents.productMockups,
                marketResearch: !!data.documents.marketResearch,
                signedNDA: !!data.documents.signedNDA,
              });
            }
          }
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
          toast({
            title: 'Error',
            description: 'Failed to load dashboard data',
            variant: 'destructive',
          });
        } finally {
          setLoading(false);
        }
      }
    }

    fetchDashboardData();
  }, [session, toast]);

  const handleNextStage = async () => {
    try {
      setIsSubmitting(true);

      const response = await fetch('/api/stage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentStage: dashboardData?.currentStage,
          newStatus: `Applied for Stage ${(dashboardData?.currentStage ?? 0) + 1}`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit stage progression');
      }

      // Update local state with new status
      setDashboardData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          status: `Applied for Stage ${prev.currentStage + 1}`,
        };
      });

      toast({
        title: 'Application Submitted',
        description: `Your application for Stage ${(dashboardData?.currentStage ?? 0) + 1} has been submitted. You will receive an email when it gets approved.`,
        duration: 5000,
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit stage progression. Please try again.',
        variant: 'destructive',
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadNDA = () => {
    const link = document.createElement('a');
    link.href = '/nda-template.pdf'; // NDA template file path in public folder
    link.download = 'nda-template.pdf';
    link.click();

    toast({
      title: 'Download Started',
      description: 'NDA template is downloading',
      duration: 3000,
    });
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fileType: string
  ) => {
    if (e.target.files && e.target.files[0]) {
      // Validate file type
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        toast({
          title: 'Invalid File Type',
          description: 'Please upload PDF files only',
          variant: 'destructive',
          duration: 3000,
        });
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File Too Large',
          description: 'Please upload files smaller than 5MB',
          variant: 'destructive',
          duration: 3000,
        });
        return;
      }

      setSelectedFiles((prev) => ({
        ...prev,
        [fileType]: file,
      }));

      // Show file as selected in UI
      setUploadedDocuments((prev) => ({
        ...prev,
        [fileType]: true,
      }));
    }
  };

  const handleRemoveFile = (fileType: string) => {
    setSelectedFiles((prev) => {
      const newFiles = { ...prev };
      delete newFiles[fileType as keyof typeof newFiles];
      return newFiles;
    });

    setUploadedDocuments((prev) => ({
      ...prev,
      [fileType]: false,
    }));

    // Reset file input
    if (fileType === 'competitorAnalysis' && competitorAnalysisRef.current) {
      competitorAnalysisRef.current.value = '';
    } else if (fileType === 'foundersProfile' && foundersProfileRef.current) {
      foundersProfileRef.current.value = '';
    } else if (fileType === 'productMockups' && productMockupsRef.current) {
      productMockupsRef.current.value = '';
    } else if (fileType === 'marketResearch' && marketResearchRef.current) {
      marketResearchRef.current.value = '';
    } else if (fileType === 'signedNDA' && signedNDARef.current) {
      signedNDARef.current.value = '';
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setBusinessPlanForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitStage2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // First upload the business plan text data
      const businessPlanResponse = await fetch('/api/business-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(businessPlanForm),
      });

      if (!businessPlanResponse.ok) {
        throw new Error('Failed to submit business plan data');
      }

      // Then handle file uploads
      if (Object.keys(selectedFiles).length > 0) {
        const formData = new FormData();

        // Append each file to the form data with the correct naming convention
        Object.entries(selectedFiles).forEach(([key, file]) => {
          // Rename the file to include the user ID
          const userId = session?.data?.user?.id;
          const newFileName = `${userId}-${key}.pdf`;

          // Create a new File object with the renamed file
          const renamedFile = new File([file], newFileName, {
            type: file.type,
          });

          formData.append(key, renamedFile);
        });

        const fileUploadResponse = await fetch('/api/upload-documents', {
          method: 'POST',
          body: formData,
        });

        if (!fileUploadResponse.ok) {
          throw new Error('Failed to upload documents');
        }
      }

      // Update the dashboard data with new business plan
      setDashboardData((prev) => {
        if (!prev) return null;

        // Construct document paths based on user ID
        const userId = session?.data?.user?.id;
        const documents = {
          ...prev.documents,
          competitorAnalysis: uploadedDocuments.competitorAnalysis
            ? `${userId}-competitorAnalysis.pdf`
            : prev.documents?.competitorAnalysis,
          foundersProfile: uploadedDocuments.foundersProfile
            ? `${userId}-foundersProfile.pdf`
            : prev.documents?.foundersProfile,
          productMockups: uploadedDocuments.productMockups
            ? `${userId}-productMockups.pdf`
            : prev.documents?.productMockups,
          marketResearch: uploadedDocuments.marketResearch
            ? `${userId}-marketResearch.pdf`
            : prev.documents?.marketResearch,
          signedNDA: uploadedDocuments.signedNDA
            ? `${userId}-signedNDA.pdf`
            : prev.documents?.signedNDA,
        };

        return {
          ...prev,
          businessPlan: businessPlanForm,
          documents: documents,
        };
      });

      toast({
        title: 'Submitted Successfully',
        description: 'Your business plan and documents have been saved.',
        duration: 5000,
      });

      // After successful submission, automatically apply for next stage
      await handleNextStage();
    } catch (error) {
      console.error('Error submitting stage 2:', error);
      toast({
        title: 'Error',
        description:
          'Failed to submit business plan and documents. Please try again.',
        variant: 'destructive',
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStageClick = (stage: number) => {
    if (dashboardData && stage <= dashboardData.currentStage) {
      setActiveStage(stage);
    }
  };

  if (isPending || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 via-blue-400 to-blue-500">
      <div className="text-center bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-2xl">
        <motion.div
          className="w-16 h-16 border-4 border-white border-t-transparent rounded-full mx-auto"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'linear',
          }}
        />
        <p className="mt-4 text-white text-lg font-semibold">Loading your dashboard...</p>
      </div>
    </div>
    );
  }

  if (!session?.data) {
    redirect('/sign-in');
  }

  if (!dashboardData || !dashboardData.questionnaire) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-4 flex items-center justify-center">
        <Card className="max-w-md w-full bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <p className="text-center text-gray-700">
              No dashboard data available. Please complete your profile.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const {
    questionnaire,
    businessPlan,
    mentorSession,
    programAllotment,
    currentStage,
    status,
  } = dashboardData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-50 to-blue-100 p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-6xl mx-auto space-y-6">
        {/* User Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Card className="bg-gradient-to-r from-white/90 to-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-2 bg-green-100 rounded-full">
                  <User className="w-8 h-8 text-green-600" />
                </div>
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Welcome, {session?.data?.user?.email}
                </span>
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
          <div className="flex items-center justify-center gap-2 md:gap-4 p-6 bg-white/90 rounded-xl shadow-md w-full max-w-3xl">
            {[1, 2, 3, 4].map((stage) => (
              <div
                key={stage}
                onClick={() => handleStageClick(stage)}
                className={`
                  relative flex flex-col items-center cursor-pointer transition-all duration-300
                  ${stage <= currentStage ? 'opacity-100' : 'opacity-50'}
                  ${stage <= currentStage ? 'hover:scale-110' : ''}
                `}
              >
                <div
                  className={`
                    w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-white font-bold text-lg
                    ${stage < currentStage ? 'bg-gradient-to-br from-green-400 to-green-600' : 
                      stage === currentStage ? 'bg-gradient-to-br from-red-400 to-red-600' : 
                      'bg-gradient-to-br from-gray-300 to-gray-400'}
                    ${activeStage === stage ? 'ring-4 ring-blue-300 shadow-lg' : ''}
                    ${stage <= currentStage ? 'hover:shadow-xl' : ''}
                    transition-all duration-300
                  `}
                >
                  {stage < currentStage ? <CheckCircle size={24} /> : stage}
                </div>
                <div className="text-center mt-2 text-sm font-medium">
                  Stage {stage}
                </div>
                {stage < 4 && (
                  <div className={`absolute top-6 left-full w-6 md:w-10 h-0.5 ${stage < currentStage ? 'bg-green-400' : 'bg-gray-300'} -z-10`}></div>
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
            <Card className="bg-blue-50 border border-blue-200 shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4 flex items-center justify-center">
                <p className="text-blue-700 font-medium flex items-center gap-2">
                  <span className="inline-block w-3 h-3 bg-blue-500 rounded-full animate-pulse"></span>
                  Current Status: {status}
                </p>
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
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  Stage {activeStage}: Primary Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DetailItem
                    icon={<User />}
                    title="Name"
                    value={questionnaire?.name || 'Not specified'}
                  />
                  <DetailItem
                    icon={<Microscope />}
                    title="Role"
                    value={questionnaire?.role || 'Not specified'}
                  />
                  <DetailItem
                    icon={<Flask />}
                    title="Startup Name"
                    value={questionnaire?.startUpName || 'Not specified'}
                  />
                  <DetailItem
                    icon={<Atom />}
                    title="Industry"
                    value={questionnaire?.industry || 'Not specified'}
                  />
                  <DetailItem
                    icon={<Zap />}
                    title="Current Stage"
                    value={questionnaire?.stage || 'Not specified'}
                  />
                  <DetailItem
                    icon={<Dna />}
                    title="Website"
                    value={questionnaire?.website || 'Not specified'}
                  />
                  <DetailItem
                    icon={<Microscope />}
                    title="Idea Title"
                    value={questionnaire?.ideaTitle || 'Not specified'}
                    className="col-span-full"
                  />
                  <DetailItem
                    icon={<Flask />}
                    title="Idea Description"
                    value={questionnaire?.ideaDescription || 'Not specified'}
                    className="col-span-full"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Stage 2: Business Plan Details */}
        {activeStage === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {businessPlan ? (
              // If business plan exists, show it
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                    Stage {activeStage}: Business Plan Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <h3 className="font-semibold text-lg text-green-700 mb-4">
                    Business Plan Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DetailItem
                      icon={<BookOpen />}
                      title="Problem Statement"
                      value={businessPlan.problemStatement || 'Not submitted'}
                    />
                    <DetailItem
                      icon={<User />}
                      title="Target Audience"
                      value={businessPlan.targetAudience || 'Not submitted'}
                    />
                    <DetailItem
                      icon={<Zap />}
                      title="Revenue Model"
                      value={businessPlan.revenueModel || 'Not submitted'}
                    />
                    <DetailItem
                      icon={<Atom />}
                      title="Unique Value Proposition"
                      value={
                        businessPlan.uniqueValueProposition || 'Not submitted'
                      }
                      className="col-span-full"
                    />
                  </div>

                  <h3 className="font-semibold text-lg text-green-700 mt-6 mb-4">
                    Uploaded Documents
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <DocumentItem
                      title="Competitor Analysis"
                      isUploaded={!!dashboardData.documents?.competitorAnalysis}
                    />
                    <DocumentItem
                      title="Founders' Profiles"
                      isUploaded={!!dashboardData.documents?.foundersProfile}
                    />
                    <DocumentItem
                      title="Product/Service Mockups"
                      isUploaded={!!dashboardData.documents?.productMockups}
                    />
                    <DocumentItem
                      title="Market Research Reports"
                      isUploaded={!!dashboardData.documents?.marketResearch}
                    />
                    <DocumentItem
                      title="Signed NDA"
                      isUploaded={!!dashboardData.documents?.signedNDA}
                    />
                  </div>
                </CardContent>
              </Card>
            ) : (
              // If business plan doesn't exist, show the form
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent flex items-center justify-between">
                    <span>Stage {activeStage}: Business Plan Details</span>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 hover:bg-blue-50 transition-colors duration-300 border-blue-200"
                      onClick={handleDownloadNDA}
                    >
                      <Download size={18} className="text-blue-500" />
                      <span>Download NDA Template</span>
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitStage2} className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg text-green-700">
                        Business Plan Information
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <Label
                            htmlFor="problemStatement"
                            className="text-green-700"
                          >
                            Problem Statement
                          </Label>
                          <Textarea
                            id="problemStatement"
                            name="problemStatement"
                            value={businessPlanForm.problemStatement}
                            onChange={handleInputChange}
                            className="mt-1 w-full"
                            rows={3}
                            required
                            placeholder="Describe the problem your solution is addressing..."
                          />
                        </div>

                        <div>
                          <Label
                            htmlFor="targetAudience"
                            className="text-green-700"
                          >
                            Target Audience
                          </Label>
                          <Textarea
                            id="targetAudience"
                            name="targetAudience"
                            value={businessPlanForm.targetAudience}
                            onChange={handleInputChange}
                            className="mt-1 w-full"
                            rows={3}
                            required
                            placeholder="Define your target audience or customer segments..."
                          />
                        </div>

                        <div>
                          <Label
                            htmlFor="revenueModel"
                            className="text-green-700"
                          >
                            Revenue Model
                          </Label>
                          <Textarea
                            id="revenueModel"
                            name="revenueModel"
                            value={businessPlanForm.revenueModel}
                            onChange={handleInputChange}
                            className="mt-1 w-full"
                            rows={3}
                            required
                            placeholder="Explain how you plan to generate revenue..."
                          />
                        </div>

                        <div>
                          <Label
                            htmlFor="uniqueValueProposition"
                            className="text-green-700"
                          >
                            Unique Value Proposition
                          </Label>
                          <Textarea
                            id="uniqueValueProposition"
                            name="uniqueValueProposition"
                            value={businessPlanForm.uniqueValueProposition}
                            onChange={handleInputChange}
                            className="mt-1 w-full"
                            rows={3}
                            required
                            placeholder="What makes your solution unique and valuable to customers..."
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                     
                      <h3 className="font-semibold text-lg text-green-700">
                        Required Documents
                      </h3>
                      <p className="text-sm text-gray-500">
                        Please upload the following documents in PDF format (max
                        5MB each)
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <DocumentUpload
                          title="Competitor Analysis"
                          description="Upload PDF analysis of your competitors"
                          fileType="competitorAnalysis"
                          inputRef={competitorAnalysisRef}
                          isUploaded={!!uploadedDocuments.competitorAnalysis}
                          handleFileChange={(e) =>
                            handleFileChange(e, 'competitorAnalysis')
                          }
                          handleRemoveFile={() =>
                            handleRemoveFile('competitorAnalysis')
                          }
                          required={true}
                        />

                        <DocumentUpload
                          title="Founders' Profiles"
                          description="Upload PDF of founders' backgrounds and experience"
                          fileType="foundersProfile"
                          inputRef={foundersProfileRef}
                          isUploaded={!!uploadedDocuments.foundersProfile}
                          handleFileChange={(e) =>
                            handleFileChange(e, 'foundersProfile')
                          }
                          handleRemoveFile={() =>
                            handleRemoveFile('foundersProfile')
                          }
                          required={true}
                        />

                        <DocumentUpload
                          title="Product/Service Mockups"
                          description="Upload PDF of your product or service mockups"
                          fileType="productMockups"
                          inputRef={productMockupsRef}
                          isUploaded={!!uploadedDocuments.productMockups}
                          handleFileChange={(e) =>
                            handleFileChange(e, 'productMockups')
                          }
                          handleRemoveFile={() =>
                            handleRemoveFile('productMockups')
                          }
                          required={true}
                        />

                        <DocumentUpload
                          title="Market Research Reports"
                          description="Upload PDF of market research findings"
                          fileType="marketResearch"
                          inputRef={marketResearchRef}
                          isUploaded={!!uploadedDocuments.marketResearch}
                          handleFileChange={(e) =>
                            handleFileChange(e, 'marketResearch')
                          }
                          handleRemoveFile={() =>
                            handleRemoveFile('marketResearch')
                          }
                          required={true}
                        />

                        <DocumentUpload
                          title="Signed NDA"
                          description="Upload signed NDA document (download template above)"
                          fileType="signedNDA"
                          inputRef={signedNDARef}
                          isUploaded={!!uploadedDocuments.signedNDA}
                          handleFileChange={(e) =>
                            handleFileChange(e, 'signedNDA')
                          }
                          handleRemoveFile={() => handleRemoveFile('signedNDA')}
                          required={true}
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <Button
                        type="submit"
                        className={cn(
                          "bg-gradient-to-r from-green-400 to-blue-500 text-white px-6",
                          "hover:from-green-500 hover:to-blue-600 shadow-md hover:shadow-lg",
                          "transition-all duration-300 transform hover:translate-y-[-2px]",
                          "focus:ring-4 focus:ring-blue-300 focus:outline-none",
                          "active:scale-95"
                        )}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <motion.div
                              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: 'linear',
                              }}
                            />
                            Submitting...
                          </span>
                        ) : (
                          'Submit Business Plan'
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        {/* Stage 3: Mentor Session */}
        {activeStage === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  Stage {activeStage}: Mentor Session
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="grid grid-cols-1 gap-6">
                  <DetailItem
                    icon={<Calendar />}
                    title="Availability for Mentor Session"
                    value={mentorSession?.availability || 'Not specified'}
                  />
                  <DetailItem
                    icon={<BookOpen />}
                    title="Pre-session Questions/Expectations"
                    value={mentorSession?.questions || 'Not specified'}
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
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  Stage {activeStage}: Program Allotment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DetailItem
                    icon={<CheckCircle />}
                    title="Acceptance Confirmation"
                    value={
                      programAllotment?.acceptanceConfirmation
                        ? 'Confirmed'
                        : 'Not confirmed'
                    }
                  />
                  <DetailItem
                    icon={<Calendar />}
                    title="Preferred Start Date"
                    value={programAllotment?.startDate || 'Not specified'}
                  />
                  <DetailItem
                    icon={<Zap />}
                    title="Additional Resource Requirements"
                    value={
                      programAllotment?.resourceRequirements || 'Not specified'
                    }
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
          currentStage < 4 &&
          (currentStage !== 2 || businessPlan) && ( // Only show next stage button for stage 2 if business plan exists
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex justify-center"
            >
              <Button
                className={cn(
                  "w-full md:w-1/2 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-3 px-6",
                  "rounded-full shadow-lg transition-all duration-300 transform",
                  "hover:from-green-500 hover:to-blue-600 hover:shadow-xl hover:scale-105",
                  "focus:ring-4 focus:ring-blue-300 focus:outline-none",
                  "active:scale-95"
                )}
                onClick={handleNextStage}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <motion.div
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: 'linear',
                      }}
                    />
                    Submitting...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Zap size={18} />
                    Apply for Stage {currentStage + 1}
                  </span>
                )}
              </Button>
            </motion.div>
          )}
      </div>
    </div>
  );
}

