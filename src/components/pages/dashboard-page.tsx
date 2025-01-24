'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Clock,
  Award,
  BookOpen,
  Calendar,
  Upload,
  ArrowRight,
} from 'lucide-react';

const ProgramDashboard = () => {
  const [currentStage] = useState(1);
  const [programType] = useState('preincubation');
  const [daysCompleted] = useState(30);
  const [totalDays] = useState(90);

  const stages = [
    { id: 1, title: 'Primary Details', completed: true },
    { id: 2, title: 'Feedback & NDA', completed: false },
    { id: 3, title: 'Mentor Session', completed: false },
    { id: 4, title: 'Program Allotment', completed: false },
  ];

  const courseProgress = [
    { id: 1, title: 'Business Model Canvas', progress: 80, score: 85 },
    { id: 2, title: 'Pitch Deck Creation', progress: 60, score: 75 },
    { id: 3, title: 'Financial Modeling', progress: 40, score: null },
  ];

  const mentorFeedback = [
    {
      date: '2025-01-02',
      mentor: 'Dr. Sarah Johnson',
      feedback:
        'Great progress on the business model. Need to focus more on market validation.',
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 p-4">
      {/* Progress Tracker */}
      <div className="flex justify-between mb-8">
        {stages.map((stage) => (
          <div key={stage.id} className="flex flex-col items-center w-1/4">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStage >= stage.id ? 'bg-blue-600' : 'bg-gray-200'
              } text-white mb-2`}
            >
              {stage.id}
            </div>
            <div className="text-sm text-center">{stage.title}</div>
          </div>
        ))}
      </div>

      {/* Timeline Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Program Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress
            value={(daysCompleted / totalDays) * 100}
            className="mb-2"
          />
          <div className="flex justify-between text-sm">
            <span>{daysCompleted} days completed</span>
            <span>{totalDays - daysCompleted} days remaining</span>
          </div>
        </CardContent>
      </Card>

      {/* Course Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Course Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {courseProgress.map((course) => (
              <div key={course.id} className="space-y-2">
                <div className="flex justify-between">
                  <span>{course.title}</span>
                  {course.score && <span>Score: {course.score}%</span>}
                </div>
                <Progress value={course.progress} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Mentor Feedback */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Mentor Feedback
          </CardTitle>
        </CardHeader>
        <CardContent>
          {mentorFeedback.map((feedback, index) => (
            <div key={index} className="border-l-4 border-blue-500 pl-4 mb-4">
              <div className="font-semibold">{feedback.mentor}</div>
              <div className="text-sm text-gray-500">{feedback.date}</div>
              <div className="mt-2">{feedback.feedback}</div>
            </div>
          ))}
          <Button className="mt-4" variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Mentor Session
          </Button>
        </CardContent>
      </Card>

      {/* Program Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Program Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button className="w-full">
            <Upload className="w-4 h-4 mr-2" />
            Upload Design/Prototype
          </Button>
          {programType === 'preincubation' && (
            <Button className="w-full" variant="outline">
              <ArrowRight className="w-4 h-4 mr-2" />
              Apply for Incubation
            </Button>
          )}
          {programType === 'incubation' && (
            <Button className="w-full" variant="outline">
              <ArrowRight className="w-4 h-4 mr-2" />
              Explore Incubators
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgramDashboard;
