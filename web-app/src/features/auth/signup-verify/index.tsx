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
import { SignupVerifyForm } from './components/signup-verify-form'

export function SignupVerify() {
  const { email } = useSearch({ from: '/(auth)/signup-verify' })

  return (
    <AuthLayout>
      <Card className='gap-4'>
        <CardHeader>
          <CardTitle className='text-base tracking-tight'>
            Verify Your Email
          </CardTitle>
          <CardDescription>
            Please enter the verification code we sent to {email} to complete your account setup.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignupVerifyForm />
        </CardContent>
        <CardFooter>
          <p className='text-muted-foreground px-8 text-center text-sm'>
            Haven't received it?{' '}
            <span className='hover:text-primary underline underline-offset-4 cursor-pointer'>
              Resend code
            </span>
            {' or '}
            <Link
              to='/signup'
              className='hover:text-primary underline underline-offset-4'
            >
              try a different email.
            </Link>
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}