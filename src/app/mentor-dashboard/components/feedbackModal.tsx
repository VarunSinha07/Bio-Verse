"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { formatDate } from "@/lib/utils"
import { CheckCircle, XCircle } from "lucide-react"

interface Meeting {
  id: string;
  date: string;
  time: string;
  link: string;
  isCompleted: boolean;
  feedback?: {
    id?: string;
    feedbackText: string;
    decision: string;
  };
}

interface User {
  id: string;
  name?: string;
  email: string;
  stage?: string;
  status?: string;
}

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  meeting: Meeting;
  user: User;
  onSubmit: () => Promise<void>;
}

const FeedbackModal = ({ isOpen, onClose, meeting, user, onSubmit }: FeedbackModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(meeting.feedback?.feedbackText || "");
  const [decision, setDecision] = useState(meeting.feedback?.decision || "decline");

  const handleSubmit = async () => {
    if (!feedback) {
      toast({
        title: "Missing Information",
        description: "Please provide feedback",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/mentor/submit-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          meetingId: meeting.id,
          userId: user.id,
          feedbackText: feedback,
          decision: decision,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit feedback");
      }

      await onSubmit();

      toast({
        title: "Feedback Submitted",
        description: "Your feedback has been successfully submitted.",
        variant: "default",
      });

      onClose();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Error",
        description: "There was an error submitting feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Provide Feedback</DialogTitle>
          <DialogDescription>
            Share your feedback for {user.name || user.email}&apos;s meeting on {formatDate(meeting.date)} at {meeting.time}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="feedback">Feedback</Label>
            <Textarea
              id="feedback"
              placeholder="Enter your feedback about the meeting..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={5}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label>Decision</Label>
            <RadioGroup value={decision} onValueChange={setDecision} className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <RadioGroupItem id="approve-incubation" value="approve-incubation" />
                <Label htmlFor="approve-incubation" className="flex items-center gap-1 cursor-pointer">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Approve for Incubation
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem id="approve-pre-incubation" value="approve-pre-incubation" />
                <Label htmlFor="approve-pre-incubation" className="flex items-center gap-1 cursor-pointer">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  Approve for Pre-Incubation
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem id="decline" value="decline" />
                <Label htmlFor="decline" className="flex items-center gap-1 cursor-pointer">
                  <XCircle className="h-4 w-4 text-red-600" />
                  Decline
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button onClick={onClose} variant="outline">Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className={
              decision === "approve-incubation" 
                ? "bg-green-600 hover:bg-green-700" 
                : decision === "approve-pre-incubation"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-red-600 hover:bg-red-700"
            }
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackModal;