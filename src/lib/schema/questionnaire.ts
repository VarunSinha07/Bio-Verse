import { z } from 'zod';

export const INDUSTRY_OPTIONS = [
  { value: 'healthTech', label: 'HealthTech' },
  { value: 'bioTech', label: 'BioTech' },
  { value: 'medTech', label: 'MedTech' },
  { value: 'pharmaceuticals', label: 'Pharmaceuticals' },
  { value: 'digital-health', label: 'Digital Health and Wellness' },
  { value: 'mental-health', label: 'Mental Health Solutions' },
  { value: 'diagnostics', label: 'Diagnostics and Testing' },
  { value: 'telemedicine', label: 'Telemedicine' },
  { value: 'genomics', label: 'Genomics' },
  { value: 'medical-devices', label: 'Medical Devices and Equipment' }
] as const;

export const STAGE_OPTIONS = [
  { value: 'idea', label: 'Idea' },
  { value: 'prototype', label: 'Prototype' },
  { value: 'mvp', label: 'MVP' },
  { value: 'scaling', label: 'Scaling' },
] as const;

export const roleOptions = [
  { value: 'Founder', label: 'Founder' },
  { value: 'Co-Founder', label: 'Co-Founder' },
  { value: 'CTO', label: 'CTO' },
  { value: 'CFO', label: 'CFO' },
] as const;
export const questionnaireSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long'),

  ideaTitle: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title is too long'),

  ideaDescription: z
    .string()
    .min(50, 'Please provide a detailed description (minimum 50 characters)')
    .max(2000, 'Description is too long'),

    role: z.enum(
      roleOptions.map((opt) => opt.value) as [string, ...string[]],
      { required_error: 'Please select a MedTech/Biotech industry' }
    ),
  startUpName: z
    .string()
    .min(3, 'Startup Name must be at least 3 characters')
    .max(200, 'Startup Name is too long'),

  website: z
    .string()
    .min(3, 'Website link must be at least 3 characters')
    .max(200, 'Website link is too long'),

  industry: z.enum(
    INDUSTRY_OPTIONS.map((opt) => opt.value) as [string, ...string[]],
    { required_error: 'Please select a MedTech/Biotech industry' }
  ),

  stage: z.enum(
    STAGE_OPTIONS.map((opt) => opt.value) as [string, ...string[]],
    {
      required_error: 'Please select a development stage',
    }
  ),
});

export type QuestionnaireFormData = z.infer<typeof questionnaireSchema>;
