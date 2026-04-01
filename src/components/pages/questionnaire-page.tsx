'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
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
import {
  Briefcase,
  Building2,
  Globe,
  Lightbulb,
  Loader2,
  User2,
} from 'lucide-react';

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
    <div className="relative w-full overflow-hidden bg-background px-4 pb-10 pt-24 sm:px-6 sm:pt-28 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_rgba(20,184,166,0.16),_transparent_42%),radial-gradient(circle_at_bottom_left,_rgba(13,148,136,0.14),_transparent_50%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.72),rgba(255,255,255,0.96))] dark:bg-[linear-gradient(to_bottom,rgba(2,6,23,0.8),rgba(2,6,23,0.95))]" />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="mx-auto w-full max-w-5xl"
      >
        <Card className="overflow-hidden rounded-3xl border border-border/60 bg-card/80 shadow-2xl backdrop-blur-xl">
          <div className="grid lg:grid-cols-5">
            <div className="relative hidden overflow-hidden bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-500 p-8 text-white lg:col-span-2 lg:block">
              <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:24px_24px]" />
              <div className="relative z-10 space-y-8">
                <div>
                  <p className="text-xs uppercase tracking-[0.26em] text-teal-100">
                    Founder Intake
                  </p>
                  <h1 className="mt-4 text-3xl font-semibold leading-tight">
                    Tell us about your startup vision.
                  </h1>
                  <p className="mt-4 text-sm text-teal-50/90">
                    This helps us personalize your BioVerse journey, recommend
                    the right program, and match you with mentors.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/30 bg-white/10 p-5 backdrop-blur-sm">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-teal-50/90">
                      Questionnaire Progress
                    </span>
                    <span className="font-semibold text-white">
                      {Math.round(formProgress)}%
                    </span>
                  </div>
                  <Progress
                    value={formProgress}
                    className="h-2 bg-white/30 [&>div]:bg-white"
                  />
                </div>

                <ul className="space-y-3 text-sm text-teal-50/90">
                  <li className="flex items-center gap-2">
                    <User2 className="h-4 w-4" /> Founder profile and role
                  </li>
                  <li className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" /> Idea summary and context
                  </li>
                  <li className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" /> Startup details and stage
                  </li>
                </ul>
              </div>
            </div>

            <div className="lg:col-span-3">
              <CardHeader className="px-6 pb-4 pt-8 sm:px-10">
                <CardTitle className="text-2xl font-bold text-foreground sm:text-3xl">
                  Startup Questionnaire
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Complete this form to unlock your personalized dashboard and
                  workflow.
                </p>
                <div className="mt-3 block lg:hidden">
                  <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
                    <span>Questionnaire Progress</span>
                    <span className="font-medium text-foreground">
                      {Math.round(formProgress)}%
                    </span>
                  </div>
                  <Progress value={formProgress} className="h-2" />
                </div>
              </CardHeader>

              <CardContent className="px-6 pb-8 sm:px-10">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <label className="mb-2 block text-sm font-medium text-foreground">
                        Full Name
                      </label>
                      <Input
                        {...register('name')}
                        placeholder="John Doe"
                        className="h-11 border-border/80 bg-background/80 focus:border-teal-500 focus-visible:ring-teal-500/30"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-1">
                      <label className="mb-2 block text-sm font-medium text-foreground">
                        Position You Hold
                      </label>
                      <Select
                        value={formValues.role}
                        onValueChange={(value) =>
                          setValue('role', value, { shouldValidate: true })
                        }
                      >
                        <SelectTrigger className="h-11 border-border/80 bg-background/80 focus:border-teal-500 focus:ring-teal-500/30">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          {roleOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.role && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.role.message}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-foreground">
                        Idea Title
                      </label>
                      <Input
                        {...register('ideaTitle')}
                        placeholder="A concise title for your startup idea"
                        className="h-11 border-border/80 bg-background/80 focus:border-teal-500 focus-visible:ring-teal-500/30"
                      />
                      {errors.ideaTitle && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.ideaTitle.message}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-1">
                      <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                        <Building2 className="h-4 w-4 text-teal-600" /> Startup
                        Name
                      </label>
                      <Input
                        {...register('startUpName')}
                        placeholder="Your startup name"
                        className="h-11 border-border/80 bg-background/80 focus:border-teal-500 focus-visible:ring-teal-500/30"
                      />
                      {errors.startUpName && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.startUpName.message}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-1">
                      <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                        <Globe className="h-4 w-4 text-teal-600" /> Website
                      </label>
                      <Input
                        {...register('website')}
                        placeholder="https://yourstartup.com"
                        className="h-11 border-border/80 bg-background/80 focus:border-teal-500 focus-visible:ring-teal-500/30"
                      />
                      {errors.website && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.website.message}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-1">
                      <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                        <Briefcase className="h-4 w-4 text-teal-600" /> Industry
                      </label>
                      <Select
                        value={formValues.industry}
                        onValueChange={(value) =>
                          setValue('industry', value, { shouldValidate: true })
                        }
                      >
                        <SelectTrigger className="h-11 border-border/80 bg-background/80 focus:border-teal-500 focus:ring-teal-500/30">
                          <SelectValue placeholder="Select your industry" />
                        </SelectTrigger>
                        <SelectContent>
                          {INDUSTRY_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.industry && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.industry.message}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-1">
                      <label className="mb-2 block text-sm font-medium text-foreground">
                        Stage of Idea
                      </label>
                      <Select
                        value={formValues.stage}
                        onValueChange={(value) =>
                          setValue('stage', value, { shouldValidate: true })
                        }
                      >
                        <SelectTrigger className="h-11 border-border/80 bg-background/80 focus:border-teal-500 focus:ring-teal-500/30">
                          <SelectValue placeholder="Select current stage" />
                        </SelectTrigger>
                        <SelectContent>
                          {STAGE_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.stage && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.stage.message}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-foreground">
                        Idea Description
                      </label>
                      <Textarea
                        {...register('ideaDescription')}
                        placeholder="Describe the core problem, your approach, and why this idea matters."
                        className="min-h-[130px] border-border/80 bg-background/80 focus:border-teal-500 focus-visible:ring-teal-500/30"
                      />
                      {errors.ideaDescription && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.ideaDescription.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="h-11 w-full bg-teal-600 text-white transition-all duration-300 hover:bg-teal-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting...
                      </span>
                    ) : (
                      'Submit and Continue'
                    )}
                  </Button>
                </form>
              </CardContent>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default QuestionnairePage;
