import * as React from 'react';
import {
    IconCarouselHorizontal,
    IconChartBar,
    IconCategory,
    IconDashboard,
    IconInnerShadowTop,
    IconList,
    IconListDetails,
    IconPackage,
    IconRefresh,
    IconTag,
    IconUsers,
} from '@tabler/icons-react';

import { NavMain } from '@/components/admin/nav-main';
import { NavUser } from '@/components/admin/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

const data = {
    user: {
        name: 'shadcn',
        email: 'm@example.com',
        avatar: '/avatars/shadcn.jpg',
    },
    navMain: [
        {
            title: 'Dashboard',
            url: '/admin/dashboard',
            icon: IconDashboard,
        },
        {
            title: 'Customers',
            url: '/admin/customers',
            icon: IconUsers,
        },
        {
            title: 'Carousels',
            url: '/admin/carousels',
            icon: IconCarouselHorizontal,
        },
        {
            title: 'Products',
            url: '/admin/products',
            icon: IconPackage,
        },
        {
            title: 'Product Instructions',
            url: '/admin/product-instructions',
            icon: IconList,
        },
        {
            title: 'Brands',
            url: '/admin/brands',
            icon: IconTag,
        },
        {
            title: 'Categories',
            url: '/admin/categories',
            icon: IconCategory,
        },
        {
            title: 'Price List Categories',
            url: '/admin/price-list-categories',
            icon: IconTag,
        },
        {
            title: 'Payment Methods',
            url: '/admin/payment-methods',
            icon: IconListDetails,
        },
        {
            title: 'Payment Channels',
            url: '/admin/payment-channels',
            icon: IconChartBar,
        },
        {
            title: 'Digiflazz Sync',
            url: '/admin/digiflazz/sync',
            icon: IconRefresh,
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:p-1.5!"
                        >
                            <a href="#">
                                <IconInnerShadowTop className="size-5!" />
                                <span className="text-base font-semibold">
                                    Acme Inc.
                                </span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    );
}
