import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MonthlySalesOrderChart } from '@/components/charts/MonthlySalesOrderChart'
import { SalesComparisonChart } from '@/components/charts/SalesComparisonChart'
import { TotalSalesComparisonChart } from '@/components/charts/TotalSalesComparisonChart'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { NotificationBell } from '@/components/notification-bell'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { LatestOrder } from '@/components/tables/LatestOrder'
import { TopSellingItemsTable } from '@/components/tables/TopSellingItemsTable'
import { ThemeSwitch } from '@/components/theme-switch'
import { useAppSelector } from '@/store'
import { selectDashboardMetrics, selectMonthlySalesData, selectTopSellingItems, selectLatestOrders, selectLatestOnlineOrders } from '@/store/slices/dashboard/dashboardSlice'

export function Dashboard() {
  const metrics = useAppSelector(selectDashboardMetrics)
  const monthlySalesData = useAppSelector(selectMonthlySalesData)
  const topSellingItems = useAppSelector(selectTopSellingItems)
  const latestOrders = useAppSelector(selectLatestOrders)
  const latestOnlineOrders = useAppSelector(selectLatestOnlineOrders)

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <TopNav links={topNav} />
        <div className='ms-auto flex items-center space-x-4'>
          <Search />
          <NotificationBell />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
        </div>
        <Tabs
          orientation='vertical'
          defaultValue='overview'
          className='space-y-4'
        >
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
              <TabsTrigger value='analytics'>Analytics</TabsTrigger>
              <TabsTrigger value='reports'>Reports</TabsTrigger>
              <TabsTrigger value='notifications'>Notifications</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value='overview' className='space-y-4'>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Lifetime Orders
                  </CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='text-muted-foreground h-4 w-4'
                  >
                    <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    ${metrics.lifetimeRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <p className='text-muted-foreground text-xs'>
                    {metrics.lifetimeRevenueChange > 0 ? '+' : ''}{metrics.lifetimeRevenueChange.toFixed(1)}% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Today Order
                  </CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='text-muted-foreground h-4 w-4'
                  >
                    <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
                    <circle cx='9' cy='7' r='4' />
                    <path d='M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{metrics.todayOrderCount}</div>
                  <p className='text-muted-foreground text-xs'>
                    {metrics.todayOrderChange > 0 ? '+' : ''}{metrics.todayOrderChange.toFixed(1)}% from yesterday
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Today Sale
                  </CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='text-muted-foreground h-4 w-4'
                  >
                    <rect width='20' height='14' x='2' y='5' rx='2' />
                    <path d='M2 10h20' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    ${metrics.todaySales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <p className='text-muted-foreground text-xs'>
                    {metrics.todaySalesChange > 0 ? '+' : ''}{metrics.todaySalesChange.toFixed(1)}% from yesterday
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total Customer
                  </CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='text-muted-foreground h-4 w-4'
                  >
                    <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{metrics.totalCustomers}</div>
                  <p className='text-muted-foreground text-xs'>
                    Unique customers
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total Delivered
                  </CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='text-muted-foreground h-4 w-4'
                  >
                    <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{metrics.totalDelivered}</div>
                  <p className='text-muted-foreground text-xs'>
                    Completed orders
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total Reservation
                  </CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='text-muted-foreground h-4 w-4'
                  >
                    <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{metrics.totalReservations}</div>
                  <p className='text-muted-foreground text-xs'>
                    Total reservations
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-8'>
              <Card className='col-span-1 lg:col-span-4'>
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className='ps-2'>
                  <SalesComparisonChart />
                </CardContent>
              </Card>
              <Card className='col-span-1 lg:col-span-4'>
                <CardHeader>
                  <CardTitle>Total Sales</CardTitle>
                  <CardDescription>
                    You made 265 sales this month.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TotalSalesComparisonChart />
                </CardContent>
              </Card>
            </div>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-8'>
              <Card className='col-span-1 lg:col-span-4'>
                <CardHeader>
                  <CardTitle>Top Selling Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <TopSellingItemsTable items={topSellingItems} />
                </CardContent>
              </Card>
              <Card className='col-span-1 lg:col-span-4'>
                <CardHeader>
                  <CardTitle>Monthly Sales Amount and Order</CardTitle>
                </CardHeader>
                <CardContent>
                  <MonthlySalesOrderChart data={monthlySalesData} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value='analytics' className='space-y-4'>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-8'>
              <Card className='col-span-1 lg:col-span-4'>
                <CardHeader>
                  <CardTitle>Latest Order</CardTitle>
                </CardHeader>
                <CardContent>
                  <LatestOrder orders={latestOrders} />
                </CardContent>
              </Card>
              <Card className='col-span-1 lg:col-span-4'>
                <CardHeader>
                  <CardTitle>Latest Online Order</CardTitle>
                </CardHeader>
                <CardContent>
                  <LatestOrder orders={latestOnlineOrders} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value='reports'>Reports Content</TabsContent>
          <TabsContent value='notifications'>Notifications Content</TabsContent>
        </Tabs>
      </Main>
    </>
  )
}

const topNav = [
  {
    title: 'POS Invoice',
    href: '/pos-invoice',
    isActive: true,
    disabled: false,
  },
  {
    title: 'Order List',
    href: 'orders',
    isActive: true,
    disabled: false,
  },
  {
    title: 'Kitchen Dashboard',
    href: '/kitchen-dashboard',
    isActive: true,
    disabled: false,
  },
  {
    title: 'Counter Dashboard',
    href: '/counter-dashboard',
    isActive: true,
    disabled: false,
  },
]
