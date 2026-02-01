import { TabsTrigger } from '@radix-ui/react-tabs'
import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { FoodAvailabilityListTable } from '../components/food-availability-list-table'
import { FoodListTable } from '../components/food-list-table'
import { FoodVariantListTable } from '../components/foodvariant-table'
import { MenuTypeListTable } from '../components/menu-type-list-table'

export const ManageFood = () => {
  return (
    <>
      <Header />
      <Main>
        <div className='mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
          <h1 className='text-2xl font-semibold tracking-tight text-gray-800'>
            Manage Food
          </h1>
        </div>

        <div className='rounded-lg bg-white p-4 shadow-sm'>
          <Tabs
            orientation='vertical'
            defaultValue='food_item'
            className='flex flex-col space-y-4'
          >
            {/* Scrollable tab list on small screens */}
            <div className='w-full overflow-x-auto'>
              <TabsList className='bg-muted/30 inline-flex min-w-max gap-2 rounded-md p-1'>
                <TabsTrigger
                  value='food_item'
                  className='data-[state=active]:bg-primary rounded-md px-4 py-2 transition-all data-[state=active]:text-white'
                >
                  Food Item
                </TabsTrigger>
                <TabsTrigger
                  value='food_variant'
                  className='data-[state=active]:bg-primary rounded-md px-4 py-2 transition-all data-[state=active]:text-white'
                >
                  Food Variant
                </TabsTrigger>
                <TabsTrigger
                  value='food_availability'
                  className='data-[state=active]:bg-primary rounded-md px-4 py-2 transition-all data-[state=active]:text-white'
                >
                  Food Availability
                </TabsTrigger>
                <TabsTrigger
                  value='menu_type'
                  className='data-[state=active]:bg-primary rounded-md px-4 py-2 transition-all data-[state=active]:text-white'
                >
                  Menu Type
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value='food_item' className='mt-4'>
              <FoodListTable />
            </TabsContent>
            <TabsContent value='food_variant' className='mt-4'>
              <FoodVariantListTable />
            </TabsContent>
            <TabsContent value='food_availability' className='mt-4'>
              <FoodAvailabilityListTable />
            </TabsContent>
            <TabsContent value='menu_type' className='mt-4'>
              <MenuTypeListTable />
            </TabsContent>
          </Tabs>
        </div>
      </Main>
    </>
  )
}
