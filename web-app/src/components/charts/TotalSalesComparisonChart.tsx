import * as React from 'react'
import { TrendingUp } from 'lucide-react'
import { Label, Pie, PieChart } from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

export const description = 'Total Sales Comparison Chart'

const chartData = [
  { sale: 'walk_in_sale', value: 275, fill: 'var(--chart-1)' },
  { sale: 'online_sale', value: 200, fill: 'var(--chart-2)' },
  { sale: 'third_party_sale', value: 287, fill: 'var(--chart-3)' },
  { sale: 'take_away_sale', value: 173, fill: 'var(--chart-4)' },
  { sale: 'qr_customer_sale', value: 190, fill: 'var(--chart-5)' },
]

const chartConfig = {
  walk_in_sale: {
    label: 'Walk-in Sale',
    color: 'var(--chart-1)',
  },
  online_sale: {
    label: 'Online Sale',
    color: 'var(--chart-2)',
  },
  third_party_sale: {
    label: 'Third Party Sale',
    color: 'var(--chart-3)',
  },
  take_away_sale: {
    label: 'Take Away Sale',
    color: 'var(--chart-4)',
  },
  qr_customer_sale: {
    label: 'QR Customer Sale',
    color: 'var(--chart-5)',
  },
} satisfies ChartConfig

export function TotalSalesComparisonChart() {
  const totalSales = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.value, 0)
  }, [])

  return (
    <Card className='flex flex-col'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>Total Sales Comparison</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>

      <CardContent className='flex-1 pb-0'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square max-h-[250px]'
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey='value'
              nameKey='sale'
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    const { cx, cy } = viewBox
                    return (
                      <text
                        x={cx}
                        y={cy}
                        textAnchor='middle'
                        dominantBaseline='middle'
                      >
                        <tspan
                          x={cx}
                          y={cy}
                          className='fill-foreground text-3xl font-bold'
                        >
                          {totalSales.toLocaleString()}
                        </tspan>
                        <tspan
                          x={cx}
                          y={(cy || 0) + 24}
                          className='fill-muted-foreground text-sm'
                        >
                          Total Sales
                        </tspan>
                      </text>
                    )
                  }
                  return null
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className='flex-col gap-2 text-sm'>
        <div className='flex items-center gap-2 leading-none font-medium'>
          Trending up by 5.2% this month <TrendingUp className='h-4 w-4' />
        </div>
        <div className='text-muted-foreground leading-none'>
          Showing total sales for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
