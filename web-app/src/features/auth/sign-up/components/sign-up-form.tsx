import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { useAppDispatch, useAppSelector } from '@/store'
import { sendOTP } from '@/store/slices/auth/authSlice'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
// import { IconFacebook, IconGithub } from '@/assets/brand-icons'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'

const formSchema = z
  .object({
    first_name: z.string().min(1, 'Please enter your first name'),
    last_name: z.string().min(1, 'Please enter your last name'),
    email: z.email({
      error: (iss) =>
        iss.input === '' ? 'Please enter your email' : undefined,
    }),
    role: z.enum(['MANAGER', 'OWNER'], {
      message: 'Please select a role',
    }),
    phone_number: z.string().optional(),
    password1: z
      .string()
      .min(1, 'Please enter your password')
      .min(8, 'Password must be at least 8 characters long'),
    password2: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password1 === data.password2, {
    message: "Passwords don't match.",
    path: ['password2'],
  })

export function SignUpForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLFormElement>) {
  const dispatch = useAppDispatch()
  const isLoading = useAppSelector((state) => state.auth.isLoading)
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      role: 'OWNER',
      phone_number: '',
      password1: '',
      password2: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      // First, send OTP to the user's email
      const result = await dispatch(sendOTP({ email: data.email, purpose: 1 }))

      if (sendOTP.fulfilled.match(result)) {
        toast.success('Verification code sent to your email!')

        // Store signup data in sessionStorage to use after OTP verification
        sessionStorage.setItem('signup-data', JSON.stringify(data))

        // Navigate to signup verification page
        navigate({
          to: '/signup-verify',
          search: {
            email: data.email,
          },
        })
      } else {
        toast.error(
          (result.payload as string) || 'Failed to send verification code.'
        )
      }
    } catch (error: any) {
      console.error('Signup error:', error)
      toast.error('Failed to send verification code. Please try again.')
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <div className='grid grid-cols-2 gap-3'>
          <FormField
            control={form.control}
            name='first_name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder='John' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='last_name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder='Doe' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='name@example.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='phone_number'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number (Optional)</FormLabel>
              <FormControl>
                <Input placeholder='+1 (555) 123-4567' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='role'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant='outline'
                      className='w-full justify-between'
                    >
                      {field.value || 'Select Role'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className='w-full'>
                    <DropdownMenuItem
                      onSelect={() => field.onChange('MANAGER')}
                    >
                      Manager
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => field.onChange('OWNER')}>
                      Owner
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='password1'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='password2'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className='mt-2' disabled={isLoading}>
          {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
          Create Account
        </Button>

        {/* <div className='relative my-2'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-background text-muted-foreground px-2'>
              Or continue with
            </span>
          </div>
        </div> */}

        {/* <div className='grid grid-cols-2 gap-2'>
          <Button
            variant='outline'
            className='w-full'
            type='button'
            disabled={isLoading}
          >
            <IconGithub className='h-4 w-4' /> GitHub
          </Button>
          <Button
            variant='outline'
            className='w-full'
            type='button'
            disabled={isLoading}
          >
            <IconFacebook className='h-4 w-4' /> Facebook
          </Button>
        </div> */}
      </form>
    </Form>
  )
}
