import { Link, useSearch } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AuthLayout } from '../auth-layout'
import { OtpForm } from './components/otp-form'

export function Otp() {
  const { email, type } = useSearch({ from: '/(auth)/otp' })
  
  console.log('OTP component rendered with:', { email, type })

  const getTitle = () => {
    switch (type) {
      case 'signup':
        return 'Verify Your Email'
      case 'forgot_password':
        return 'Reset Password Verification'
      default:
        return 'Two-factor Authentication'
    }
  }

  const getDescription = () => {
    switch (type) {
      case 'signup':
        return `Please enter the verification code we sent to ${email || 'your email'} to complete your account setup.`
      case 'forgot_password':
        return `Please enter the verification code we sent to ${email || 'your email'} to reset your password.`
      default:
        return 'Please enter the authentication code. We have sent the authentication code to your email.'
    }
  }

  return (
    <AuthLayout>
      <Card className='gap-4'>
        <CardHeader>
          <CardTitle className='text-base tracking-tight'>
            {getTitle()}
          </CardTitle>
          <CardDescription>
            {getDescription()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OtpForm />
        </CardContent>
        <CardFooter>
          <p className='text-muted-foreground px-8 text-center text-sm'>
            Haven't received it?{' '}
            <Link
              to='/login'
              className='hover:text-primary underline underline-offset-4'
            >
              Resend a new code.
            </Link>
            .
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}
