import React, { useState, useRef } from 'react';
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
import { AlertCircle, CheckCircle, X, FileText, Download, Upload } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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
  requestStatus?: string | null;
  createdAt?: string;
  questionnaire?: Questionnaire;
  businessPlan?: BusinessPlan;
  documents?: Document[];
}

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onApproveRequest: (userId: string, action: 'approve' | 'decline') => Promise<void>;
}

const UserDetailsModal = ({ isOpen, onClose, user, onApproveRequest }: UserDetailsModalProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [ndaFile, setNdaFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  const questionnaire = user.questionnaire;
  const businessPlan = user.businessPlan;
  const documents = user.documents || [];
  const isStage3Application = user.status === 'Applied for Stage 3';
  
  const handleApproveRequest = async (action: 'approve' | 'decline') => {
    if (action === 'approve' && isStage3Application && !ndaFile) {
      toast({
        title: "NDA Required",
        description: "Please upload a signed NDA document before approving.",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    try {
      // Create form data to handle file upload
      const formData = new FormData();
      formData.append('userId', user.id);
      formData.append('action', action);
      
      if (action === 'approve' && ndaFile) {
        formData.append('ndaFile', ndaFile);
      }

      const response = await fetch('/api/admin/approve-user', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} user request`);
      }

      await onApproveRequest(user.id, action);
      
      toast({
        title: action === 'approve' ? "Request Approved" : "Request Declined",
        description: action === 'approve' 
          ? "The user request has been approved and the signed NDA has been uploaded."
          : "The user request has been declined.",
        variant: action === 'approve' ? "default" : "destructive"
      });
    } catch (error) {
      console.error('Error processing request:', error);
      toast({
        title: "Error",
        description: "There was an error processing your request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf') {
        setNdaFile(file);
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF file for the signed NDA.",
          variant: "destructive"
        });
      }
    }
  };

  const handleDownloadDocument = (doc: Document) => {
    // Create a proper download link with the correct base URL
    const fileUrl = doc.url.startsWith('http') 
      ? doc.url 
      : `${window.location.origin}${doc.url.startsWith('/') ? doc.url : `/uploads/${doc.url}`}`;
    
    // Create a temporary anchor element to trigger the download
    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = doc.name; // Set the download attribute to suggest filename
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const isRequestProcessed = user.requestStatus === 'approved' || user.requestStatus === 'declined';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            Detailed information about the user and their application
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
                <span className="font-medium">Request Status:</span>{' '}
                {user.requestStatus === 'approved' ? (
                  <span className="text-green-600 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" /> Approved
                  </span>
                ) : user.requestStatus === 'declined' ? (
                  <span className="text-red-600 flex items-center">
                    <X className="h-4 w-4 mr-1" /> Declined
                  </span>
                ) : (
                  <span className="text-yellow-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" /> Pending
                  </span>
                )}
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

        {/* Business Plan Section - Only visible for Stage 3 Applications */}
        {isStage3Application && businessPlan && (
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

        {/* Documents Section - Only visible for Stage 3 Applications */}
        {isStage3Application && documents.length > 0 && (
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

        {/* NDA Upload Section - Only visible for non-processed requests */}
        {!isRequestProcessed && isStage3Application && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">NDA Document</h3>
            <div className="border rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-2">
                Please upload a signed NDA document before approving the request.
              </div>
              <div className="flex items-center">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {ndaFile ? 'Change File' : 'Upload NDA'}
                </Button>
                {ndaFile && (
                  <span className="ml-3 text-sm text-green-600">
                    File selected: {ndaFile.name}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="mt-6">
          {!isRequestProcessed && (
            <>
              <Button 
                onClick={() => handleApproveRequest('approve')} 
                disabled={isProcessing}
                className="bg-green-600 hover:bg-green-700 mr-2"
              >
                Approve Request
              </Button>
              <Button 
                onClick={() => handleApproveRequest('decline')} 
                disabled={isProcessing}
                variant="destructive"
                className="mr-2"
              >
                Decline
              </Button>
            </>
          )}
          <Button onClick={onClose} variant="outline">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsModal;