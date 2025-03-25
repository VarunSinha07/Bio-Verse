'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Video, CheckCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MentorUserDetailsModal from './components/mentorUserDetailsModal';
import FeedbackModal from './components/feedbackModal';

// Define interfaces
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

interface Feedback {
  id?: string;
  feedbackText: string;
  decision: string;
}

interface Meeting {
  id: string;
  date: string;
  time: string;
  link: string;
  isCompleted: boolean;
  feedback?: Feedback;
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
  nextMeeting?: Meeting | null;
}

interface BasicUser {
  id: string;
  name?: string;
  email: string;
  stage?: string;
  meetingStatus?: string | null;
  questionnaire?: {
    ideaTitle: string;
    startUpName?: string;
  } | null;
  nextMeeting?: Meeting | null;
}

const MentorDashboard = () => {
  type TabStage = 'stage3' | 'stage4' | 'incubation';
  type FilterStatus = 'all' | 'scheduled' | 'pending' | 'completed';
  
  const [selectedTab, setSelectedTab] = useState<TabStage>('stage3');
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [users, setUsers] = useState<BasicUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  // Define the stage mappings for each tab
  const tabStageMap = React.useMemo(() => ({
    stage3: '3',
    stage4: '4',
    incubation: 'In Incubation'
  }), []);

  interface FetchUsersProps {
    stage: string;
    filter: FilterStatus;
  }

  const fetchUsers = React.useCallback(async ({ stage, filter }: FetchUsersProps): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch(`/api/mentor/users?stage=${encodeURIComponent(stage)}&filter=${filter}`);
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json() as BasicUser[];
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers({ stage: tabStageMap[selectedTab], filter });
  }, [selectedTab, filter, tabStageMap, fetchUsers]);

  const handleViewDetails = async (userId: string): Promise<void> => {
    try {
      const response = await fetch(`/api/mentor/user-details?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }
      const data = await response.json() as User;
      setSelectedUser(data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleScheduleMeeting = async (): Promise<void> => {
    try {
      await fetchUsers({ stage: tabStageMap[selectedTab], filter });
    } catch (error) {
      console.error('Error scheduling meeting:', error);
    }
  };

  const handleOpenFeedbackModal = (user: BasicUser) => {
    if (user.nextMeeting) {
      setSelectedMeeting(user.nextMeeting);
      setSelectedUser({ id: user.id, email: user.email, name: user.name });
      setIsFeedbackModalOpen(true);
    }
  };

  const handleFeedbackSubmit = async () => {
    await fetchUsers({ stage: tabStageMap[selectedTab], filter });
    setIsFeedbackModalOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const closeFeedbackModal = () => {
    setIsFeedbackModalOpen(false);
    setSelectedMeeting(null);
  };

  const formatMeetingDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  const getMeetingStatusDisplay = (user: BasicUser) => {
    if (user.nextMeeting) {
      if (user.nextMeeting.isCompleted) {
        return (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span>Completed</span>
          </div>
        );
      }
      
      
      return (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-600" />
            <span>{formatMeetingDate(user.nextMeeting.date)} at {user.nextMeeting.time}</span>
          </div>
          <div className="flex gap-2 mt-1">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => window.open(user.nextMeeting?.link, '_blank')}
            >
              <Video className="h-3 w-3" />
              Join
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-1"
              onClick={() => handleOpenFeedbackModal(user)}
            >
              Feedback
            </Button>
          </div>
        </div>
      );
    }
    return <span className="text-yellow-600">Not scheduled</span>;
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Mentor Dashboard</h1>
      
      <Tabs defaultValue="stage3" value={selectedTab} onValueChange={(value) => setSelectedTab(value as TabStage)}>
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="stage3">Stage 3</TabsTrigger>
          <TabsTrigger value="stage4">Stage 4</TabsTrigger>
          <TabsTrigger value="incubation">In Incubation</TabsTrigger>
        </TabsList>

        {Object.entries(tabStageMap).map(([tab, stage]) => (
          <TabsContent key={tab} value={tab}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Stage {stage} Users</CardTitle>
                <div className="w-48">
                  <Select 
                    value={filter} 
                    onValueChange={(value) => setFilter(value as FilterStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="unscheduled">Unscheduled</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">Loading...</div>
                ) : users.length === 0 ? (
                  <div className="text-center py-8">No users found in this stage</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Idea</TableHead>
                        <TableHead>Meeting Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.name || 'N/A'}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.questionnaire?.ideaTitle || 'N/A'}</TableCell>
                          <TableCell>{getMeetingStatusDisplay(user)}</TableCell>
                          <TableCell className="flex gap-2">
                            <Button 
                              variant="outline" 
                              onClick={() => handleViewDetails(user.id)}
                            >
                              View Details
                            </Button>
                            <Button 
                              variant="default"
                              onClick={() => handleViewDetails(user.id)}
                              className="flex items-center gap-2"
                            >
                              <Video className="h-4 w-4" />
                              {user.nextMeeting && !user.nextMeeting.isCompleted ? 'Reschedule' : 'Schedule'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {selectedUser && (
        <MentorUserDetailsModal
          isOpen={isModalOpen} 
          onClose={closeModal}
          user={selectedUser}
          onScheduleMeeting={handleScheduleMeeting}
        />
      )}

      {selectedMeeting && selectedUser && (
        <FeedbackModal
          isOpen={isFeedbackModalOpen}
          onClose={closeFeedbackModal}
          meeting={selectedMeeting}
          user={selectedUser}
          onSubmit={handleFeedbackSubmit}
        />
      )}
    </div>
  );
};

export default MentorDashboard;