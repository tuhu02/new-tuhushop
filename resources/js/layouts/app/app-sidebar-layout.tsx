import { AppContent } from '@/components/customer/app-content';
import { AppShell } from '@/components/customer/app-shell';
import { AppSidebar } from '@/components/customer/app-sidebar';
import { AppSidebarHeader } from '@/components/customer/app-sidebar-header';
import type { AppLayoutProps } from '@/types';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </AppShell>
    );
}
