"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import { CalendarIcon, Video, FileText, Download } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"

interface Questionnaire {
  role: string
  startUpName?: string
  website?: string
  industry: string
  ideaTitle: string
  ideaDescription: string
}

interface BusinessPlan {
  executiveSummary: string
  marketAnalysis: string
  financialProjections: string
  timeline: string
}

interface Document {
  id: string
  name: string
  url: string
  type: string
}

interface User {
  id: string
  name?: string
  email: string
  stage?: string
  status?: string
  meetingStatus?: string | null
  createdAt?: string
  questionnaire?: Questionnaire
  businessPlan?: BusinessPlan
  documents?: Document[]
  nextMeeting?: {
    date: string
    time: string
    link: string
  } | null
}

interface MentorUserDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  user: User
  onScheduleMeeting: (userId: string) => Promise<void>
}

const MentorUserDetailsModal = ({ isOpen, onClose, user, onScheduleMeeting }: MentorUserDetailsModalProps) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    user.nextMeeting ? new Date(user.nextMeeting.date) : undefined,
  )
  const [selectedTime, setSelectedTime] = useState<string>(user.nextMeeting ? user.nextMeeting.time : "12:00")
  const [meetingLink, setMeetingLink] = useState<string>(user.nextMeeting ? user.nextMeeting.link : "")

  // Initialize with default values if user data changes
  useEffect(() => {
    if (user.nextMeeting) {
      setSelectedDate(new Date(user.nextMeeting.date))
      setSelectedTime(user.nextMeeting.time)
      setMeetingLink(user.nextMeeting.link)
    }
  }, [user])

  if (!user) return null

  const questionnaire = user.questionnaire
  const businessPlan = user.businessPlan
  const documents = user.documents || []

  const handleScheduleMeeting = async () => {
    if (!selectedDate || !selectedTime || !meetingLink) {
      toast({
        title: "Missing Information",
        description: "Please provide date, time and meeting link",
        variant: "destructive",
      })
      return
    }

    if (!meetingLink.includes("meet.google.com")) {
      toast({
        title: "Invalid Link",
        description: "Please provide a valid Google Meet link",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    try {
      const response = await fetch("/api/mentor/schedule-meeting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          meetingDate: selectedDate.toISOString(),
          meetingTime: selectedTime,
          meetingLink: meetingLink,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to schedule meeting")
      }

      await onScheduleMeeting(user.id)

      toast({
        title: "Meeting Scheduled",
        description: "The meeting has been successfully scheduled.",
        variant: "default",
      })

      onClose()
    } catch (error) {
      console.error("Error scheduling meeting:", error)
      toast({
        title: "Error",
        description: "There was an error scheduling the meeting. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownloadDocument = (doc: Document) => {
    // Construct the proper URL for the document
    const fileUrl = doc.url.startsWith("http") ? doc.url : `${window.location.origin}${doc.url}`

    // Open the document in a new tab
    window.open(fileUrl, "_blank")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-6 md:p-8">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>View user details and schedule a mentoring session</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">User Information</h3>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Name:</span> {user.name || "N/A"}
              </div>
              <div>
                <span className="font-medium">Email:</span> {user.email}
              </div>
              <div>
                <span className="font-medium">Stage:</span> {user.stage || "N/A"}
              </div>
              <div>
                <span className="font-medium">Status:</span> {user.status || "N/A"}
              </div>
              <div>
                <span className="font-medium">Account Created:</span>{" "}
                {user.createdAt ? formatDate(user.createdAt) : "N/A"}
              </div>
            </div>
          </div>

          {questionnaire && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Questionnaire</h3>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Role:</span> {questionnaire.role}
                </div>
                <div>
                  <span className="font-medium">Startup Name:</span> {questionnaire.startUpName || "N/A"}
                </div>
                <div>
                  <span className="font-medium">Website:</span> {questionnaire.website || "N/A"}
                </div>
                <div>
                  <span className="font-medium">Industry:</span> {questionnaire.industry}
                </div>
              </div>
            </div>
          )}
        </div>

        {questionnaire && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Idea Information</h3>
            <div className="space-y-3">
              <div>
                <div className="font-medium">Title</div>
                <div className="mt-1">{questionnaire.ideaTitle}</div>
              </div>
              <div>
                <div className="font-medium">Description</div>
                <div className="mt-1 whitespace-pre-wrap">{questionnaire.ideaDescription}</div>
              </div>
            </div>
          </div>
        )}

        {businessPlan && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Business Plan</h3>
            <div className="space-y-3 border p-4 rounded-lg">
              <div>
                <div className="font-medium">Problem Statement</div>
                <div className="mt-1 whitespace-pre-wrap">{businessPlan.executiveSummary}</div>
              </div>
              <div>
                <div className="font-medium">Target Audience</div>
                <div className="mt-1 whitespace-pre-wrap">{businessPlan.marketAnalysis}</div>
              </div>
              <div>
                <div className="font-medium">Revenue Model</div>
                <div className="mt-1 whitespace-pre-wrap">{businessPlan.financialProjections}</div>
              </div>
              <div>
                <div className="font-medium">Unique Selling Preposition</div>
                <div className="mt-1 whitespace-pre-wrap">{businessPlan.timeline}</div>
              </div>
            </div>
          </div>
        )}

        {documents.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Documents</h3>
            <div className="border rounded-lg p-4">
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-blue-500" />
                      <span>{doc.name}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadDocument(doc)}
                      className="flex items-center"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Meeting Scheduling Section */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Schedule Meeting</h3>
          <div className="border rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium mb-1">Meeting Date*</label>
                <div className="relative">
                  <input
                    type="date"
                    id="date-picker"
                    className="w-full p-2 border rounded-md transition duration-300 ease-in-out focus:ring-2 focus:ring-cyan-400 focus:border-transparent hover:border-cyan-300"
                    value={selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""}
                    onChange={(e) => setSelectedDate(e.target.value ? new Date(e.target.value) : undefined)}
                  />
                  <CalendarIcon
                    className="absolute right-2 top-2 h-5 w-5 text-gray-400 cursor-pointer"
                    onClick={() => (document.getElementById("date-picker") as HTMLInputElement)?.showPicker()}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium mb-1">Meeting Time*</label>
                <input
                  type="time"
                  className="w-full p-2 border rounded-md transition duration-300 ease-in-out focus:ring-2 focus:ring-cyan-400 focus:border-transparent hover:border-cyan-300"
                  value={selectedTime.split(" ")[0]} // Extract just the time part
                  onChange={(e) => {
                    const timeValue = e.target.value
                    if (!timeValue) return
                    setSelectedTime(timeValue)
                  }}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <div className="text-sm font-medium pb-2">Google Meet Link</div>
                <div className="flex items-center space-x-2 relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <Video className="h-4 w-4" />
                  </div>
                  <Input
                    id="meeting-link"
                    placeholder="https://meet.google.com/xxx-xxxx-xxx"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button
            onClick={handleScheduleMeeting}
            disabled={isProcessing}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isProcessing ? "Processing..." : user.nextMeeting ? "Reschedule Meeting" : "Schedule Meeting"}
          </Button>
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default MentorUserDetailsModal

