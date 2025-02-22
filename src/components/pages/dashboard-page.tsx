'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from '@/lib/auth-client';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
interface Questionnaire {
  name: string;
  role: string;
  startUpName?: string;
  industry: string;
  stage: string;
  website?: string;
  ideaTitle: string;
  ideaDescription: string;
}

interface DashboardData {
  questionnaire: Questionnaire;
}


export default function DashboardPage() {
  const session = useSession();
  const isPending = session?.isPending;
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchDashboardData() {
      if (session?.data?.user?.id) {
        try {
          const response = await fetch('/api/primary-details-fetch');
          if (response.ok) {
            const data = await response.json();
            setDashboardData(data);
          }
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
          toast({
            title: "Error",
            description: "Failed to load dashboard data",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      }
    }

    fetchDashboardData();
  }, [session, toast]);

  const handleNextStage = async () => {
    try {
      setIsSubmitting(true);
      
      const response = await fetch('/api/stage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to submit stage progression');
      }

      toast({
        title: "Application Submitted",
        description: "Your Application for stage 2 has been submitted. You will receive a mail when it gets approved.",
        duration: 5000,
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to submit stage progression. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPending || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session?.data) {
    redirect('/sign-in');
  }

  const { questionnaire } = dashboardData || {};


  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 p-4">
      {/* User Welcome Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Hi, {session?.data?.user?.email}
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Questionnaire Details */}
      <Card>
        <CardHeader>
          <CardTitle>Primary Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Name</h3>
              <p className="text-gray-600">{questionnaire?.name}</p>
            </div>
            <div>
              <h3 className="font-semibold">Role</h3>
              <p className="text-gray-600">{questionnaire?.role}</p>
            </div>
            <div>
              <h3 className="font-semibold">Startup Name</h3>
              <p className="text-gray-600">{questionnaire?.startUpName || 'Not specified'}</p>
            </div>
            <div>
              <h3 className="font-semibold">Industry</h3>
              <p className="text-gray-600">{questionnaire?.industry}</p>
            </div>
            <div>
              <h3 className="font-semibold">Current Stage</h3>
              <p className="text-gray-600">{questionnaire?.stage}</p>
            </div>
            <div>
              <h3 className="font-semibold">Website</h3>
              <p className="text-gray-600">{questionnaire?.website || 'Not specified'}</p>
            </div>
            <div className="col-span-1 md:col-span-2">
              <h3 className="font-semibold">Idea Title</h3>
              <p className="text-gray-600">{questionnaire?.ideaTitle}</p>
            </div>
            <div className="col-span-1 md:col-span-2">
              <h3 className="font-semibold">Idea Description</h3>
              <p className="text-gray-600">{questionnaire?.ideaDescription}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Stage Button */}
      <div className="flex justify-center">
        <Button 
          className="w-full md:w-1/2" 
          onClick={handleNextStage} 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Apply for Next Stage'}
        </Button>
      </div>
    </div>
  );
}