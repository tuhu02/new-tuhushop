'use client';

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useIsMobile } from '@/hooks/use-mobile';

export const description = 'An interactive area chart for transaction revenue';

const chartConfig = {
    revenue: {
        label: 'Pendapatan (Rp)',
        color: 'var(--primary)',
    },
} satisfies ChartConfig;

export function ChartAreaInteractive({
    chartData = [],
}: {
    chartData?: any[];
}) {
    const isMobile = useIsMobile();
    const [timeRange, setTimeRange] = React.useState('90d');

    React.useEffect(() => {
        if (isMobile) {
            setTimeRange('7d');
        }
    }, [isMobile]);

    const filteredData = React.useMemo(() => {
        if (!chartData || chartData.length === 0) {
            return [];
        }

        // The data passed from controller already spans 90 days ending at 'now'
        // Let's filter it further based on the selected range.
        let daysToSubtract = 90;

        if (timeRange === '30d') {
            daysToSubtract = 30;
        } else if (timeRange === '7d') {
            daysToSubtract = 7;
        }

        return chartData.slice(-daysToSubtract);
    }, [chartData, timeRange]);

    const totalRevenue = React.useMemo(() => {
        return filteredData.reduce((acc, curr) => acc + curr.revenue, 0);
    }, [filteredData]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const formatShortCurrency = (value: number) => {
        if (value >= 1000000) {
            return `Rp ${(value / 1000000).toFixed(1)}Jt`;
        } else if (value >= 1000) {
            return `Rp ${(value / 1000).toFixed(0)}rb`;
        }

        return `Rp ${value}`;
    };

    if (!chartData || chartData.length === 0) {
        return null;
    }

    return (
        <Card className="@container/card">
            <CardHeader>
                <CardTitle>Pendapatan (Revenue)</CardTitle>
                <CardDescription>
                    <span className="hidden @[540px]/card:block">
                        Total{' '}
                        {timeRange === '90d'
                            ? '3 bulan'
                            : timeRange === '30d'
                              ? '30 hari'
                              : '7 hari'}{' '}
                        terakhir: {formatCurrency(totalRevenue)}
                    </span>
                    <span className="@[540px]/card:hidden">
                        {timeRange === '90d'
                            ? '3 bln'
                            : timeRange === '30d'
                              ? '30 hr'
                              : '7 hr'}
                        : {formatShortCurrency(totalRevenue)}
                    </span>
                </CardDescription>
                <CardAction>
                    <ToggleGroup
                        type="single"
                        value={timeRange}
                        onValueChange={(val) => val && setTimeRange(val)}
                        variant="outline"
                        className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
                    >
                        <ToggleGroupItem value="90d">90 Hari</ToggleGroupItem>
                        <ToggleGroupItem value="30d">30 Hari</ToggleGroupItem>
                        <ToggleGroupItem value="7d">7 Hari</ToggleGroupItem>
                    </ToggleGroup>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger
                            className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
                            size="sm"
                            aria-label="Pilih rentang waktu"
                        >
                            <SelectValue placeholder="90 Hari" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="90d" className="rounded-lg">
                                90 Hari
                            </SelectItem>
                            <SelectItem value="30d" className="rounded-lg">
                                30 Hari
                            </SelectItem>
                            <SelectItem value="7d" className="rounded-lg">
                                7 Hari
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </CardAction>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <AreaChart data={filteredData}>
                        <defs>
                            <linearGradient
                                id="fillRevenue"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-revenue)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-revenue)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value);

                                return date.toLocaleDateString('id-ID', {
                                    month: 'short',
                                    day: 'numeric',
                                });
                            }}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) =>
                                formatShortCurrency(value)
                            }
                            width={80}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => {
                                        return new Date(
                                            value,
                                        ).toLocaleDateString('id-ID', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        });
                                    }}
                                    indicator="dot"
                                    formatter={(value, _name, item) => {
                                        return (
                                            <div className="flex w-full flex-col gap-1">
                                                <div className="flex w-full items-center justify-between gap-4">
                                                    <span className="text-muted-foreground">
                                                        {
                                                            chartConfig.revenue
                                                                .label
                                                        }
                                                    </span>
                                                    <span className="font-medium text-foreground">
                                                        {formatCurrency(
                                                            value as number,
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="flex w-full items-center justify-between gap-4">
                                                    <span className="text-muted-foreground">
                                                        Transaksi
                                                    </span>
                                                    <span className="font-medium text-foreground">
                                                        {
                                                            item.payload
                                                                .transactions
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    }}
                                />
                            }
                        />
                        <Area
                            dataKey="revenue"
                            type="natural"
                            fill="url(#fillRevenue)"
                            stroke="var(--color-revenue)"
                            stackId="a"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
