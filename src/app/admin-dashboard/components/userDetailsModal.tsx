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
import { AlertCircle, CheckCircle, X } from 'lucide-react';

interface Questionnaire {
  role: string;
  startUpName?: string;
  website?: string;
  industry: string;
  ideaTitle: string;
  ideaDescription: string;
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
}

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onApproveRequest: (userId: string, action: 'approve' | 'decline') => Promise<void>;
}

const UserDetailsModal = ({ isOpen, onClose, user, onApproveRequest }: UserDetailsModalProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!user) return null;

  const questionnaire = user.questionnaire;
  
  const handleApproveRequest = async (action: 'approve' | 'decline') => {
    setIsProcessing(true);
    try {
      await onApproveRequest(user.id, action);
    } catch (error) {
      console.error('Error processing request:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const isRequestProcessed = user.requestStatus === 'approve' || user.requestStatus === 'decline';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
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
                {user.requestStatus === 'approve' ? (
                  <span className="text-green-600 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" /> Approved
                  </span>
                ) : user.requestStatus === 'decline' ? (
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