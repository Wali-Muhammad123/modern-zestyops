import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { SignupVerify } from '@/features/auth/signup-verify'

const searchSchema = z.object({
  email: z.string(),
})

export const Route = createFileRoute('/(auth)/signup-verify')({
  component: SignupVerify,
  validateSearch: searchSchema,
})