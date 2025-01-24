import { z } from 'zod';

export const INDUSTRY_OPTIONS = [
  { value: 'technology', label: 'Technology' },
  { value: 'health-and-biotech', label: 'Health and BioTech' },
  {
    value: 'sustainability-and-environment',
    label: 'Sustainability and Environment',
  },
  { value: 'education-and-learning', label: 'Education and Learning' },
  { value: 'finance-and-economy', label: 'Finance and Economy' },
  { value: 'consumer-and-lifestyle', label: 'Consumer and Lifestyle' },
  { value: 'agriculture-and-food', label: 'Agriculture and Food' },
  { value: 'logistics-and-supply-chain', label: 'Logistics and Supply Chain' },
  {
    value: 'transportation-and-mobility',
    label: 'Transportation and Mobility',
  },
  {
    value: 'real-estate-and-construction',
    label: 'Real Estate and Construction',
  },
  {
    value: 'social-impact-and-inclusion',
    label: 'Social Impact and Inclusion',
  },
  { value: 'media-and-entertainment', label: 'Media and Entertainment' },
  { value: 'other-emerging-sectors', label: 'Other Emerging Sectors' },
  { value: 'other', label: 'Other' },
] as const;

export const STAGE_OPTIONS = [
  { value: 'idea', label: 'Just an Idea' },
  { value: 'research', label: 'Research & Planning' },
  { value: 'prototype', label: 'Prototype/MVP' },
  { value: 'development', label: 'In Development' },
  { value: 'launched', label: 'Already Launched' },
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

  industry: z.enum(
    INDUSTRY_OPTIONS.map((opt) => opt.value) as [string, ...string[]],
    { required_error: 'Please select an industry' }
  ),

  stage: z.enum(
    STAGE_OPTIONS.map((opt) => opt.value) as [string, ...string[]],
    {
      required_error: 'Please select a stage',
    }
  ),
});

export type QuestionnaireFormData = z.infer<typeof questionnaireSchema>;
