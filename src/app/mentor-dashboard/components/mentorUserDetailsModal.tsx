import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { Calendar as CalendarIcon, Video, FileText, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Questionnaire {
  role: string;
  startUpName?: string;
  website?: string;
  industry: string;
  ideaTitle: string;
  ideaDescription: string;
}

interface BusinessPlan {
  executiveSummary: string;
  marketAnalysis: string;
  financialProjections: string;
  timeline: string;
}

interface Document {
  id: string;
  name: string;
  url: string;
  type: string;
}

interface User {
  id: string;
  name?: string;
  email: string;
  stage?: string;
  status?: string;
  meetingStatus?: string | null;
  createdAt?: string;
  questionnaire?: Questionnaire;
  businessPlan?: BusinessPlan;
  documents?: Document[];
  nextMeeting?: {
    date: string;
    time: string;
    link: string;
  } | null;
}

interface MentorUserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onScheduleMeeting: (userId: string) => Promise<void>;
}

const MentorUserDetailsModal = ({ isOpen, onClose, user, onScheduleMeeting }: MentorUserDetailsModalProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    user.nextMeeting ? new Date(user.nextMeeting.date) : undefined
  );
  const [selectedTime, setSelectedTime] = useState<string>(
    user.nextMeeting ? user.nextMeeting.time : ''
  );
  const [meetingLink, setMeetingLink] = useState<string>(
    user.nextMeeting ? user.nextMeeting.link : ''
  );
  
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  if (!user) return null;

  const questionnaire = user.questionnaire;
  const businessPlan = user.businessPlan;
  const documents = user.documents || [];
  
  const handleScheduleMeeting = async () => {
    if (!selectedDate || !selectedTime || !meetingLink) {
      toast({
        title: "Missing Information",
        description: "Please provide date, time and meeting link",
        variant: "destructive"
      });
      return;
    }
    
    if (!meetingLink.includes('meet.google.com')) {
      toast({
        title: "Invalid Link",
        description: "Please provide a valid Google Meet link",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    try {
      const response = await fetch('/api/mentor/schedule-meeting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          meetingDate: selectedDate.toISOString(),
          meetingTime: selectedTime,
          meetingLink: meetingLink
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to schedule meeting');
      }

      await onScheduleMeeting(user.id);
      
      toast({
        title: "Meeting Scheduled",
        description: "The meeting has been successfully scheduled.",
        variant: "default"
      });
      
      onClose();
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      toast({
        title: "Error",
        description: "There was an error scheduling the meeting. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadDocument = (doc: Document) => {
    // Construct the proper URL for the document
    const fileUrl = doc.url.startsWith('http') 
      ? doc.url 
      : `${window.location.origin}${doc.url}`;
    
    // Open the document in a new tab
    window.open(fileUrl, '_blank');
  };

  // Generate time options from 9 AM to 6 PM
  const timeOptions = Array.from({ length: 19 }, (_, i) => {
    const hour = Math.floor(i / 2) + 9;
    const minute = i % 2 === 0 ? '00' : '30';
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minute} ${ampm}`;
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            View user details and schedule a mentoring session
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">User Information</h3>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Name:</span> {user.name || 'N/A'}
              </div>
              <div>
                <span className="font-medium">Email:</span> {user.email}
              </div>
              <div>
                <span className="font-medium">Stage:</span> {user.stage || 'N/A'}
              </div>
              <div>
                <span className="font-medium">Status:</span> {user.status || 'N/A'}
              </div>
              <div>
                <span className="font-medium">Account Created:</span>{' '}
                {user.createdAt ? formatDate(user.createdAt) : 'N/A'}
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
                  <span className="font-medium">Startup Name:</span>{' '}
                  {questionnaire.startUpName || 'N/A'}
                </div>
                <div>
                  <span className="font-medium">Website:</span>{' '}
                  {questionnaire.website || 'N/A'}
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
                <div className="font-medium">Executive Summary</div>
                <div className="mt-1 whitespace-pre-wrap">{businessPlan.executiveSummary}</div>
              </div>
              <div>
                <div className="font-medium">Market Analysis</div>
                <div className="mt-1 whitespace-pre-wrap">{businessPlan.marketAnalysis}</div>
              </div>
              <div>
                <div className="font-medium">Financial Projections</div>
                <div className="mt-1 whitespace-pre-wrap">{businessPlan.financialProjections}</div>
              </div>
              <div>
                <div className="font-medium">Timeline</div>
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
                <div className="text-sm font-medium pb-2">Meeting Date</div>
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? formatDate(selectedDate.toISOString()) : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date);
                        setIsCalendarOpen(false);
                      }}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium pb-2">Meeting Time</div>
                <Select 
                  value={selectedTime} 
                  onValueChange={setSelectedTime}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <div className="text-sm font-medium pb-2">Google Meet Link</div>
                <div className="flex items-center space-x-2">
                  <Video className="h-4 w-4 text-gray-500" />
                  <Input
                    id="meeting-link"
                    placeholder="https://meet.google.com/xxx-xxxx-xxx"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    className="flex-1"
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
            className="bg-blue-600 hover:bg-blue-700 mr-2"
          >
            {user.nextMeeting ? 'Reschedule Meeting' : 'Schedule Meeting'}
          </Button>
          <Button onClick={onClose} variant="outline">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MentorUserDetailsModal;