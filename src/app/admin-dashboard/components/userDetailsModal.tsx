import React from 'react';
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

interface Questionnaire {
  role: string;
  startUpName?: string;
  website?: string;
  industry: string;
  ideaTitle: string;
  ideaDescription: string;
}

interface User {
  name?: string;
  email: string;
  stage?: string;
  status?: string;
  createdAt?: string;
  questionnaire?: Questionnaire;
}

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

const UserDetailsModal = ({ isOpen, onClose, user }: UserDetailsModalProps) => {
  if (!user) return null;

  const questionnaire = user.questionnaire;

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
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsModal;