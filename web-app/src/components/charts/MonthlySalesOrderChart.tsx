"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "Chart for Monthly Sales and Orders"

interface MonthlySalesData {
  month: string
  sales: number
  orders: number
}

interface MonthlySalesOrderChartProps {
  data?: MonthlySalesData[]
}

const chartConfig = {
  sales: {
    label: "Sales",
    color: "var(--chart-1)",
  },
  orders: {
    label: "Orders",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function MonthlySalesOrderChart({ data = [] }: MonthlySalesOrderChartProps) {
  const chartData = data.length > 0 ? data : [
    { month: "No Data", sales: 0, orders: 0 }
  ]

  return (
    <Card>
      <CardHeader>
        <CardDescription>
          Showing total sales and orders for the last {data.length} months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.split(' ')[0].slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="sales"
              type="natural"
              fill="var(--color-sales)"
              fillOpacity={0.4}
              stroke="var(--color-sales)"
              stackId="a"
            />
            <Area
              dataKey="orders"
              type="natural"
              fill="var(--color-orders)"
              fillOpacity={0.4}
              stroke="var(--color-orders)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              Monthly Sales & Orders Trend <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              {data.length > 0 ? `${data[0]?.month} - ${data[data.length - 1]?.month}` : 'No data available'}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
