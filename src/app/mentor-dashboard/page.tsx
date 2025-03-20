'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Video } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MentorUserDetailsModal from './components/mentorUserDetailsModal';

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
  nextMeeting?: {
    date: string;
    time: string;
  } | null;
}

const MentorDashboard = () => {
  type TabStage = 'stage3' | 'stage4' | 'incubation';
  type FilterStatus = 'all' | 'scheduled' | 'pending';
  
  const [selectedTab, setSelectedTab] = useState<TabStage>('stage3');
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [users, setUsers] = useState<BasicUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleScheduleMeeting = async (userId: string): Promise<void> => {
    try {
      await fetchUsers({ stage: tabStageMap[selectedTab], filter });
    } catch (error) {
      console.error('Error scheduling meeting:', error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const formatMeetingDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  const getMeetingStatusDisplay = (user: BasicUser) => {
    if (user.nextMeeting) {
      return (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-green-600" />
          <span>{formatMeetingDate(user.nextMeeting.date)} at {user.nextMeeting.time}</span>
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
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
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
                        <TableHead>Startup / Idea</TableHead>
                        <TableHead>Meeting Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.name || 'N/A'}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.questionnaire?.startUpName || user.questionnaire?.ideaTitle || 'N/A'}</TableCell>
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
                              {user.nextMeeting ? 'Reschedule' : 'Schedule'}
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
    </div>
  );
};

export default MentorDashboard;