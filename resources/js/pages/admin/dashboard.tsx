import { ChartAreaInteractive } from '@/components/admin/chart-area-interactive';
import { SectionCards } from '@/components/admin/section-cards';
import AdminLayout from '@/layouts/admin-layout';

export default function Page({
    metrics,
    chartData,
}: {
    metrics: any;
    chartData: any[];
}) {
    return (
        <AdminLayout title="Admin Dashboard" headerTitle="Dashboard">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <SectionCards metrics={metrics} />
                <div className="px-4 lg:px-6">
                    <ChartAreaInteractive chartData={chartData} />
                </div>
            </div>
        </AdminLayout>
    );
}
