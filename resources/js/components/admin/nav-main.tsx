import { Link, usePage } from '@inertiajs/react';
import type {Icon} from '@tabler/icons-react';
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

export function NavMain({
    groups,
}: {
    groups: {
        title: string;
        items: {
            title: string;
            url: string;
            icon?: Icon;
        }[];
    }[];
}) {
    const page = usePage();

    return (
        <>
            {groups.map((group) => (
                <SidebarGroup key={group.title}>
                    <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                    <SidebarGroupContent className="flex flex-col gap-2">
                        <SidebarMenu>
                            {group.items.map((item) => {
                                const isActive = page.url.startsWith(item.url);

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            tooltip={item.title}
                                            isActive={isActive}
                                            asChild
                                        >
                                            <Link href={item.url}>
                                                {item.icon && <item.icon />}
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            ))}
        </>
    );
}
