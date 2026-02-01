import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function ProductCategoryTabs() {
  return (
    <div className='flex w-full max-w-sm flex-col gap-6 '>
      <Tabs defaultValue='account'>
        <TabsList>
          <TabsTrigger value='account'>Account</TabsTrigger>
          <TabsTrigger value='password'>Password</TabsTrigger>
        </TabsList>
        <TabsContent value='account'>
        </TabsContent>
      </Tabs>
    </div>
  )
}
