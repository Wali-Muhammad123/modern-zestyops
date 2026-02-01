import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { useAppDispatch, useAppSelector } from '@/store'
import { submitUserOnboarding } from '@/store/slices/auth/authSlice'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const formSchema = z.object({
  restaurant_name: z.string().min(1, 'Enter the restaurant name'),
  restaurant_domain: z.string().min(1, 'Enter the restaurant domain'),
})

export function OnboardingForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLFormElement>) {
  const dispatch = useAppDispatch()
  const isLoading = useAppSelector((state) => state.auth.isLoading)
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      restaurant_domain: '',
      restaurant_name: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      // First, send OTP to the user's email
      const result = await dispatch(submitUserOnboarding(data))

      if (submitUserOnboarding.fulfilled.match(result)) {
        toast.success('Onboarding successful! Redirecting...')
        // Navigate to signup verification page
        navigate({
          to: '/dashboard',
        })
      } else {
        toast.error(
          (result.payload as string) || 'Failed to onboard at the moment'
        )
      }
    } catch (error: any) {
      console.error('Onboarding error:', error)
      toast.error('Onboarding Failed. Please try again later')
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <div className='grid grid-cols-1 gap-3'>
          <FormField
            control={form.control}
            name='restaurant_name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter Restaurant Name</FormLabel>
                <FormControl>
                  <Input placeholder='Restaurant...' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='restaurant_domain'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Restaurant Domain</FormLabel>
                <FormControl>
                  <Input placeholder='Restaurant Domain' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button className='mt-2' disabled={isLoading}>
          {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
          Let's begin
        </Button>
      </form>
    </Form>
  )
}
