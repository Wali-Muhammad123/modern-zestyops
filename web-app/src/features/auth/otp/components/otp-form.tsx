import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppDispatch, useAppSelector, store } from '@/store'
import { registerUser, verifyOTP, updateUser } from '@/store/slices/auth/authSlice'
import { handlePostAuthNavigation } from '@/lib/post-auth-flow'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '@/components/ui/input-otp'

const formSchema = z.object({
  otp: z
    .string()
    .min(4, 'Please enter the 4-digit code.')
    .max(4, 'Please enter the 4-digit code.'),
})

type OtpFormProps = React.HTMLAttributes<HTMLFormElement>

export function OtpForm({ className, ...props }: OtpFormProps) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { email, type } = useSearch({ from: '/(auth)/otp' })
  const isLoading = useAppSelector((state) => state.auth.isLoading)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { otp: '' },
  })

  const otp = form.watch('otp')

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      if (type === 'signup') {
        // For signup flow, get the stored signup data and register the user
        const signupDataStr = sessionStorage.getItem('signup-data')
        if (!signupDataStr) {
          throw new Error('Signup data not found. Please start the signup process again.')
        }

        const signupData = JSON.parse(signupDataStr)
        
        // Register the user with OTP verification
        const result = await dispatch(registerUser({
          ...signupData,
          otp: data.otp,
        }))
        
        if (registerUser.fulfilled.match(result)) {
          // Clear stored signup data
          sessionStorage.removeItem('signup-data')
          
          toast.success('Account created successfully!')
          navigate({ to: '/dashboard' })
        } else {
          toast.error(result.payload as string || 'Registration failed')
        }
      } else {
        // Handle email verification after login
        const result = await dispatch(verifyOTP({
          email: email || '',
          code: data.otp,
        }))
        
        if (verifyOTP.fulfilled.match(result)) {
          toast.success('Email verified successfully!')
          
          // After verification, update the user's is_verified status and navigate
          dispatch(updateUser({ is_verified: true }))
          
          // Get the updated user state and navigate accordingly
          const currentUser = store.getState().auth.user
          if (currentUser) {
            const updatedUser = { ...currentUser, is_verified: true }
            handlePostAuthNavigation(navigate, updatedUser, email)
          } else {
            // Fallback if no user in state
            navigate({ to: '/dashboard' })
          }
        } else {
          toast.error(result.payload as string || 'OTP verification failed')
        }
      }
    } catch (error: any) {
      console.error('OTP verification error:', error)
      toast.error(
        error.response?.data?.message || 
        'Invalid verification code. Please try again.'
      )
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-2', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='otp'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='sr-only'>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP
                  maxLength={6}
                  {...field}
                  containerClassName='justify-between sm:[&>[data-slot="input-otp-group"]>div]:w-12'
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={otp.length < 4 || isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Verify
        </Button>
      </form>
    </Form>
  )
}
