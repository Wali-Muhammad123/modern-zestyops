import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)')({
  component: () => {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900'>
        <div className='text-center'>
          <h1 className='text-4xl font-bold'>404</h1>
          <p className='text-muted-foreground'>Page Not Found</p>
        </div>
      </div>
    )
  },
})
