import { z } from 'zod';

export const INDUSTRY_OPTIONS = [
  { value: 'biotechnology', label: 'Biotechnology' },
  { value: 'biomedical-engineering', label: 'Biomedical Engineering' },
  { value: 'medical-devices', label: 'Medical Devices' },
  { value: 'pharmaceutical-research', label: 'Pharmaceutical Research' },
  { value: 'genetic-engineering', label: 'Genetic Engineering' },
  { value: 'regenerative-medicine', label: 'Regenerative Medicine' },
  { value: 'digital-health', label: 'Digital Health' },
  { value: 'clinical-diagnostics', label: 'Clinical Diagnostics' },
  { value: 'medical-imaging', label: 'Medical Imaging' },
  { value: 'bioinformatics', label: 'Bioinformatics' },
  { value: 'therapeutics', label: 'Therapeutics' },
  { value: 'medical-AI', label: 'Medical AI' },
  { value: 'other-medtech', label: 'Other MedTech' },
] as const;

export const STAGE_OPTIONS = [
  { value: 'research-concept', label: 'Research Concept' },
  { value: 'preclinical', label: 'Preclinical Development' },
  { value: 'clinical-trials', label: 'Clinical Trials' },
  { value: 'prototype', label: 'Prototype Development' },
  { value: 'regulatory-review', label: 'Regulatory Review' },
  { value: 'market-ready', label: 'Market Ready' },
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
