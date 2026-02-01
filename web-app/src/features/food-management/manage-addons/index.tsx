import { TabsTrigger } from '@radix-ui/react-tabs'
import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { AddAddonsListTable } from '../components/addons-list-table'
import { AssignAddOnsListTable } from '../components/assign-addons-list'

export const ManageAddOns = () => {
  return (
    <>
      <Header />
      <Main>
        <div className='mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
          <h1 className='text-2xl font-semibold tracking-tight text-gray-800'>
            Manage Add-ons
          </h1>
        </div>

        <div className='rounded-lg bg-white p-4 shadow-sm'>
          <Tabs
            orientation='vertical'
            defaultValue='add_ons'
            className='flex flex-col space-y-4'
          >
            {/* Scrollable tab list on small screens */}
            <div className='w-full overflow-x-auto'>
              <TabsList className='bg-muted/30 inline-flex min-w-max gap-2 rounded-md p-1'>
                <TabsTrigger
                  value='add_ons'
                  className='data-[state=active]:bg-primary rounded-md px-4 py-2 transition-all data-[state=active]:text-white'
                >
                  Add-ons
                </TabsTrigger>
                <TabsTrigger
                  value='add_ons_assign'
                  className='data-[state=active]:bg-primary rounded-md px-4 py-2 transition-all data-[state=active]:text-white'
                >
                  Add-ons Assign
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value='add_ons' className='mt-4'>
              <AddAddonsListTable />
            </TabsContent>
            <TabsContent value='add_ons_assign' className='mt-4'>
              <AssignAddOnsListTable />
            </TabsContent>
          </Tabs>
        </div>
      </Main>
    </>
  )
}
