'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import UserDetailsModal from './components/userDetailsModal';

// Define interfaces first to avoid reference errors
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
  name?: string; // Changed from string | null to string | undefined to match modal component
  email: string;
  stage?: string;
  status?: string;
  createdAt?: string;
  questionnaire?: Questionnaire;
}

interface BasicUser {
  id: string;
  name?: string; // Changed to match User interface
  email: string;
  questionnaire?: {
    ideaTitle: string;
  } | null;
}

const AdminDashboard = () => {
  type TabStatus = 'stage2' | 'stage3' | 'preIncubation' | 'incubation';
  const [selectedTab, setSelectedTab] = useState<TabStatus>('stage2');
  const [users, setUsers] = useState<BasicUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Define the status mappings for each tab
  const tabStatusMap = React.useMemo(() => ({
    stage2: 'Applied for Stage 2',
    stage3: 'Applied for Stage 3',
    preIncubation: 'Applied for Incubation/Pre Incubation',
    incubation: 'Incubation/Pre-incubation'
  }), []);

  interface FetchUsersProps {
    status: string;
  }

  const fetchUsers = React.useCallback(async (status: FetchUsersProps['status']): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/users?status=${encodeURIComponent(status)}`);
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
    fetchUsers(tabStatusMap[selectedTab]);
  }, [selectedTab, tabStatusMap, fetchUsers]);

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

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs defaultValue="stage2" value={selectedTab} onValueChange={(value) => setSelectedTab(value as TabStatus)}>
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="stage2">Applied for Stage 2</TabsTrigger>
          <TabsTrigger value="stage3">Applied for Stage 3</TabsTrigger>
          <TabsTrigger value="preIncubation">Applied for Incubation</TabsTrigger>
          <TabsTrigger value="incubation">In Incubation</TabsTrigger>
        </TabsList>

        {Object.entries(tabStatusMap).map(([tab, status]) => (
          <TabsContent key={tab} value={tab}>
            <Card>
              <CardHeader>
                <CardTitle>{status}</CardTitle>
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
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.name || 'N/A'}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.questionnaire?.ideaTitle || 'N/A'}</TableCell>
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
        />
      )}
    </div>
  );
};

export default AdminDashboard;