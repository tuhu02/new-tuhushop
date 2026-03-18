import { Head } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { AppSidebar } from '@/components/admin/app-sidebar';
import { SiteHeader } from '@/components/admin/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

type AdminLayoutProps = {
    title: string;
    headerTitle?: string;
    children: ReactNode;
};

export default function AdminLayout({
    title,
    headerTitle,
    children,
}: AdminLayoutProps) {
    return (
        <SidebarProvider
            style={
                {
                    '--sidebar-width': 'calc(var(--spacing) * 72)',
                    '--header-height': 'calc(var(--spacing) * 12)',
                } as React.CSSProperties
            }
        >
            <Head title={title} />
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader title={headerTitle} />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        {children}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
