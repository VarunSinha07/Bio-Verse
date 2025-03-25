'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, Minus, X } from 'lucide-react';
import UserDetailsModal from './components/userDetailsModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Define interfaces first to avoid reference errors
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

interface BasicUser {
  id: string;
  name?: string;
  email: string;
  stage?: string;
  requestStatus?: string | null;
  questionnaire?: {
    ideaTitle: string;
  } | null;
}

const AdminDashboard = () => {
  type TabStatus = 'stage2' | 'stage3' | 'preIncubation' | 'incubation';
  type FilterStatus = 'all' | 'approved' | 'pending' | 'declined';
  
  const [selectedTab, setSelectedTab] = useState<TabStatus>('stage2');
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [users, setUsers] = useState<BasicUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Define the status mappings for each tab
  const tabStatusMap = React.useMemo(() => ({
    stage2: 'Applied for Stage 2',
    stage3: 'Applied for Stage 3',
    stage4: 'Applied for Stage 4',
    preIncubation: 'Applied for Incubation/Pre Incubation',
    incubation: 'Incubation/Pre-incubation'
  }), []);

  

  interface FetchUsersProps {
    status: string;
    filter: FilterStatus;
  }

  const fetchUsers = React.useCallback(async ({ status, filter }: FetchUsersProps): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/users?status=${encodeURIComponent(status)}&filter=${filter}`);
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
    fetchUsers({ status: tabStatusMap[selectedTab], filter });
  }, [selectedTab, filter, tabStatusMap, fetchUsers]);

  const handleViewDetails = async (userId: string): Promise<void> => {
    try {
      const response = await fetch(`/api/admin/user-details?userId=${userId}`);
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

  const handleApproveRequest = async (userId: string, action: 'approve' | 'decline'): Promise<void> => {
    try {
     
      await fetchUsers({ status: tabStatusMap[selectedTab], filter });
    } catch (error) {
      console.error(`Error ${action}ing user request:`, error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const getRequestStatusIcon = (user: BasicUser) => {
    if (user.requestStatus === 'approved') {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    } else if (user.requestStatus === 'declined') {
      return <X className="h-5 w-5 text-red-600" />;
    } else {
      return <Minus className="h-5 w-5 text-yellow-600" />;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs defaultValue="stage2" value={selectedTab} onValueChange={(value) => setSelectedTab(value as TabStatus)}>
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="stage2">Applied for Stage 2</TabsTrigger>
          <TabsTrigger value="stage3">Applied for Stage 3</TabsTrigger>
          <TabsTrigger value="stage4">Applied for Stage 4</TabsTrigger>
          <TabsTrigger value="preIncubation">Applied for Incubation</TabsTrigger>
          <TabsTrigger value="incubation">In Incubation</TabsTrigger>
        </TabsList>

        {Object.entries(tabStatusMap).map(([tab, status]) => (
          <TabsContent key={tab} value={tab}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{status}</CardTitle>
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
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="declined">Declined</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">Loading...</div>
                ) : users.length === 0 ? (
                  <div className="text-center py-8">No users found with this status</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Idea Title</TableHead>
                        <TableHead className="text-center">Request Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.name || 'N/A'}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.questionnaire?.ideaTitle || 'N/A'}</TableCell>
                          <TableCell className="text-center">
                            <div className="flex justify-center">
                              {getRequestStatusIcon(user)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              onClick={() => handleViewDetails(user.id)}
                            >
                              View Details
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
        <UserDetailsModal
          isOpen={isModalOpen} 
          onClose={closeModal}
          user={selectedUser}
          onApproveRequest={handleApproveRequest}
        />
      )}
    </div>
  );
};

export default AdminDashboard;