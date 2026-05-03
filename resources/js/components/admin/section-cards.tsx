import { IconTrendingDown, IconTrendingUp, IconMinus } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type Metric = {
    value: number;
    growth: number;
};

type MetricsData = {
    revenue: Metric;
    customers: Metric;
    transactions: Metric;
    success_rate: Metric;
};

export function SectionCards({ metrics }: { metrics?: MetricsData }) {
  if (!metrics) return null;

  const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0,
      }).format(amount);
  };

  const renderGrowthBadge = (growth: number, isPercentage: boolean = true) => {
      if (growth > 0) {
          return (
              <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">
                  <IconTrendingUp className="mr-1 h-3 w-3" />
                  +{growth}{isPercentage ? '%' : ''}
              </Badge>
          );
      } else if (growth < 0) {
          return (
              <Badge variant="outline" className="text-red-600 bg-red-50 border-red-200">
                  <IconTrendingDown className="mr-1 h-3 w-3" />
                  {growth}{isPercentage ? '%' : ''}
              </Badge>
          );
      }
      return (
          <Badge variant="outline" className="text-gray-600 bg-gray-50 border-gray-200">
              <IconMinus className="mr-1 h-3 w-3" />
              0{isPercentage ? '%' : ''}
          </Badge>
      );
  };

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Revenue (Bulan Ini)</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatCurrency(metrics.revenue.value)}
          </CardTitle>
          <CardAction>
            {renderGrowthBadge(metrics.revenue.growth)}
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            Dibandingkan bulan lalu
          </div>
        </CardFooter>
      </Card>
      
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Pelanggan Baru</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.customers.value.toLocaleString('id-ID')}
          </CardTitle>
          <CardAction>
            {renderGrowthBadge(metrics.customers.growth)}
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            Pendaftaran bulan ini
          </div>
        </CardFooter>
      </Card>
      
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Transaksi</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.transactions.value.toLocaleString('id-ID')}
          </CardTitle>
          <CardAction>
            {renderGrowthBadge(metrics.transactions.growth)}
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            Seluruh status bulan ini
          </div>
        </CardFooter>
      </Card>
      
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Tingkat Sukses</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.success_rate.value}%
          </CardTitle>
          <CardAction>
            {renderGrowthBadge(metrics.success_rate.growth)}
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            Persentase transaksi PAID
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
