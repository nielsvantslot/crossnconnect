'use client';

import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';

interface DailyClick {
  date: string;
  clicks: number;
}

interface DashboardChartProps {
  data: DailyClick[];
  clicksLabel: string;
}

export function DashboardChart({ data, clicksLabel }: DashboardChartProps) {
  return (
    <ChartContainer
      config={{
        clicks: {
          label: clicksLabel,
          color: "hsl(var(--primary))",
        },
      }}
      className="h-[200px] w-full"
    >
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 12 }}
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          allowDecimals={false}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area 
          type="monotone" 
          dataKey="clicks" 
          stroke="var(--color-clicks)" 
          fill="var(--color-clicks)"
          fillOpacity={0.2}
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  );
}
