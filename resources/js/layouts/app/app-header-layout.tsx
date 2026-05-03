import { AppContent } from '@/components/customer/app-content';
import { AppHeader } from '@/components/customer/app-header';
import { AppShell } from '@/components/customer/app-shell';
import { AppFooter } from '@/components/customer/app-footer';
import type { AppLayoutProps } from '@/types';

export default function AppHeaderLayout({
    children,
    breadcrumbs,
}: AppLayoutProps) {
    return (
        <AppShell variant="header">
            <AppHeader breadcrumbs={breadcrumbs} />
            <AppContent variant="header">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_center,rgba(79,70,229,0.16),transparent_34%),linear-gradient(180deg,rgba(238,242,255,0.95)_0%,rgba(255,255,255,1)_58%)]" />

                <div className="pointer-events-none absolute -top-28 left-1/2 h-[520px] w-[1180px] -translate-x-1/2 rotate-[-18deg] rounded-[90px] bg-indigo-100/45" />

                <div className="pointer-events-none absolute -top-16 left-[8%] h-[460px] w-[300px] rotate-[-24deg] rounded-[60px] bg-indigo-200/25" />

                <div className="pointer-events-none absolute -top-16 right-[8%] h-[460px] w-[300px] rotate-[24deg] rounded-[60px] bg-indigo-200/25" />

                <div className="pointer-events-none absolute top-0 left-0 h-96 w-96 rounded-full bg-blue-100/50 blur-3xl" />

                <div className="pointer-events-none absolute top-8 right-0 h-96 w-96 rounded-full bg-purple-100/50 blur-3xl" />

                <div className="relative z-10 flex-1">{children}</div>
            </AppContent>
            <AppFooter />
        </AppShell>
    );
}
