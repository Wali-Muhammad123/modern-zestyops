import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppDispatch, useAppSelector } from '@/store'
import { registerUser, sendOTP } from '@/store/slices/auth/authSlice'
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
  code: z
    .string()
    .min(4, 'Please enter the 4-digit code.')
    .max(4, 'Please enter the 4-digit code.'),
})

type SignupVerifyFormProps = React.HTMLAttributes<HTMLFormElement>

export function SignupVerifyForm({ className, ...props }: SignupVerifyFormProps) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { email } = useSearch({ from: '/(auth)/signup-verify' })
  const isLoading = useAppSelector((state) => state.auth.isLoading)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { code: '' },
  })

  const code = form.watch('code')

  async function resendOTP() {
    try {
      const result = await dispatch(sendOTP({ email: email || '', purpose: 1 }))
      if (sendOTP.fulfilled.match(result)) {
        toast.success('Verification code sent again!')
      } else {
        toast.error(result.payload as string || 'Failed to resend code.')
      }
    } catch (error: any) {
      toast.error('Failed to resend code. Please try again.')
    }
  }

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      // Get the stored signup data and register the user
      const signupDataStr = sessionStorage.getItem('signup-data')
      if (!signupDataStr) {
        throw new Error('Signup data not found. Please start the signup process again.')
      }

      const signupData = JSON.parse(signupDataStr)

      // Register the user with OTP verification
      const result = await dispatch(registerUser({
        ...signupData,
        otp: data.code,
      }))

      if (registerUser.fulfilled.match(result)) {
        // Clear stored signup data
        sessionStorage.removeItem('signup-data')

        const user = result.payload.user
        toast.success('Account created successfully! Welcome!')

        // Handle post-auth navigation based on user status
        handlePostAuthNavigation(navigate, user, email)
      } else {
        toast.error(result.payload as string || 'Registration failed')
      }
    } catch (error: any) {
      console.error('Signup verification error:', error)
      toast.error('Invalid verification code. Please try again.')
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='code'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='sr-only'>Verification Code</FormLabel>
              <FormControl>
                <InputOTP
                  maxLength={4}
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
        <Button className='mt-2' disabled={code.length < 4 || isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Verify & Create Account
        </Button>

        <Button
          type='button'
          variant='ghost'
          onClick={resendOTP}
          disabled={isLoading}
          className='mt-2'
        >
          Resend Code
        </Button>
      </form>
    </Form>
  )
}