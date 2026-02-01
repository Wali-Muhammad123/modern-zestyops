import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAppSelector } from '@/store'
import { OnboardingForm } from './OnboardingForm'

export function Onboarding() {
  const { user } = useAppSelector((state) => state.auth)

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900'>
      <div className='w-full max-w-md space-y-8'>
        <Card>
          <CardHeader className='text-center'>
            <CardTitle className='text-2xl font-bold'>
              Welcome to ZestyOps!
            </CardTitle>
            <CardDescription>
              Let's get you set up. We'll guide you through the onboarding
              process.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='text-center'>
              <p className='text-muted-foreground text-sm'>
                Welcome, {user?.first_name || user?.email}!
              </p>
              <p className='text-muted-foreground mt-2 text-sm'>
                Complete your profile setup to get started.
              </p>
            </div>
            <OnboardingForm />

            {/* <div className='space-y-4'>
              <Button onClick={handleCompleteOnboarding} className='w-full'>
                Continue Setup
              </Button>
            </div> */}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
