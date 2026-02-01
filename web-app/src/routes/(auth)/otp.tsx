import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Otp } from '@/features/auth/otp'

const searchSchema = z.object({
  email: z.string().optional(),
  type: z.enum([ 'signup', 'forgot_password', 'verification']).optional(),
})

export const Route = createFileRoute('/(auth)/otp')({
  beforeLoad: ({ search }) => {
    console.log('OTP route beforeLoad called with search:', search)
  },
  component: Otp,
  validateSearch: searchSchema,
})
