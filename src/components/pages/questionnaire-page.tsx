'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import {
  QuestionnaireFormData,
  questionnaireSchema,
  INDUSTRY_OPTIONS,
  STAGE_OPTIONS,
  roleOptions,
} from '@/lib/schema/questionnaire';
import { useSession } from '@/lib/auth-client';
import { toast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const INITIAL_FORM_STATE: QuestionnaireFormData = {
  name: '',
  ideaTitle: '',
  role: 'Founder',
  ideaDescription: '',
  startUpName: '',
  website: '',
  industry: 'HealthTech',
  stage: 'idea',
};

const QuestionnairePage = () => {
  const router = useRouter();
  const session = useSession();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formProgress, setFormProgress] = useState<number>(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<QuestionnaireFormData>({
    resolver: zodResolver(questionnaireSchema),
    defaultValues: INITIAL_FORM_STATE,
  });

  const formValues = watch();

  useEffect(() => {
    const fields = Object.values(formValues);
    const filledFields = fields.filter((field) => field !== '').length;
    setFormProgress((filledFields / fields.length) * 100);
  }, [formValues]);

  const onSubmit = async (data: QuestionnaireFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/questionnaire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          userId: session.data?.user.id,
          userEmail: session.data?.user.email,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit questionnaire');
      }

      toast({
        title: 'Success',
        description: 'Questionnaire submitted successfully',
      });
      router.push('/form');
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background transition-all duration-500 ease-in-out py-12 px-4 sm:px-6 lg:px-8 animate-fadeIn">
      <div className="max-w-2xl mx-auto space-y-8">
        <Card className="mb-8 glow-effect transition-all duration-300 hover:shadow-[0_0_15px_rgba(93,63,211,0.5)] hover:border-[#5D3FD3]">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground transition-colors duration-200">
                <span>Questionnaire Progress</span>
                <span>{Math.round(formProgress)}%</span>
              </div>
              <Progress
                value={formProgress}
                className="h-2 transition-all duration-300"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="glow-effect transition-all duration-300 hover:shadow-[0_0_15px_rgba(93,63,211,0.5)] hover:border-[#5D3FD3]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-primary to-[#5D3FD3] bg-clip-text text-transparent">
              Tell Us About Your Startup Idea
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 transition-colors duration-200">
                    Full Name
                  </label>
                  <Input
                    {...register('name')}
                    placeholder="John Doe"
                    className="w-full transition-all duration-200 hover:border-[#5D3FD3] focus:border-[#5D3FD3] dark:bg-background"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 transition-colors duration-200">
                    Idea Title
                  </label>
                  <Input
                    {...register('ideaTitle')}
                    placeholder="A brief title for your startup idea"
                    className="w-full transition-all duration-200 hover:border-[#5D3FD3] focus:border-[#5D3FD3] dark:bg-background"
                  />
                  {errors.ideaTitle && (
                    <p className="text-sm text-red-500 mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                      {errors.ideaTitle.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 transition-colors duration-200">
                    StartUp Name (Optional)
                  </label>
                  <Input
                    {...register('startUpName')}
                    placeholder="A brief title for your startup idea"
                    className="w-full transition-all duration-200 hover:border-[#5D3FD3] focus:border-[#5D3FD3] dark:bg-background"
                  />
                  {errors.startUpName && (
                    <p className="text-sm text-red-500 mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                      {errors.startUpName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 transition-colors duration-200">
                    Website (if any)
                  </label>
                  <Input
                    {...register('website')}
                    placeholder="A brief title for your startup idea"
                    className="w-full transition-all duration-200 hover:border-[#5D3FD3] focus:border-[#5D3FD3] dark:bg-background"
                  />
                  {errors.website && (
                    <p className="text-sm text-red-500 mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                      {errors.website.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 transition-colors duration-200">
                    Idea Description
                  </label>
                  <Textarea
                    {...register('ideaDescription')}
                    placeholder="Describe your idea in detail..."
                    className="w-full min-h-[100px] transition-all duration-200 hover:border-[#5D3FD3] focus:border-[#5D3FD3] dark:bg-background"
                  />
                  {errors.ideaDescription && (
                    <p className="text-sm text-red-500 mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                      {errors.ideaDescription.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 transition-colors duration-200">
                    Industry
                  </label>
                  <Select
                    value={formValues.industry}
                    onValueChange={(value) => setValue('industry', value)}
                  >
                    <SelectTrigger className="w-full transition-all duration-200 hover:border-[#5D3FD3] focus:border-[#5D3FD3] dark:bg-background">
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDUSTRY_OPTIONS.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          className="transition-colors duration-200 hover:bg-[#5D3FD3]/10"
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.industry && (
                    <p className="text-sm text-red-500 mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                      {errors.industry.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 transition-colors duration-200">
                    Position You Hold
                  </label>
                  <Select
                    value={formValues.role}
                    onValueChange={(value) => setValue('role', value)}
                  >
                    <SelectTrigger className="w-full transition-all duration-200 hover:border-[#5D3FD3] focus:border-[#5D3FD3] dark:bg-background">
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {roleOptions.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          className="transition-colors duration-200 hover:bg-[#5D3FD3]/10"
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.role && (
                    <p className="text-sm text-red-500 mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                      {errors.role.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 transition-colors duration-200">
                    Stage of Idea
                  </label>
                  <Select
                    value={formValues.stage}
                    onValueChange={(value) => setValue('stage', value)}
                  >
                    <SelectTrigger className="w-full transition-all duration-200 hover:border-[#5D3FD3] focus:border-[#5D3FD3] dark:bg-background">
                      <SelectValue placeholder="Select current stage" />
                    </SelectTrigger>
                    <SelectContent>
                      {STAGE_OPTIONS.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          className="transition-colors duration-200 hover:bg-[#5D3FD3]/10"
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.stage && (
                    <p className="text-sm text-red-500 mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                      {errors.stage.message}
                    </p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-[#5D3FD3] transition-all duration-300 hover:opacity-90 hover:shadow-lg hover:translate-y-[-2px] active:translate-y-[1px]"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Submitting...
                  </div>
                ) : (
                  'Submit and Continue'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuestionnairePage;
