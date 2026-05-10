import * as React from 'react';
import { SidebarInset } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import type { AppVariant } from '@/types';

type Props = React.ComponentProps<'main'> & {
    variant?: AppVariant;
};

export function AppContent({ variant = 'sidebar', children, ...props }: Props) {
    const { className, ...restProps } = props;

    if (variant === 'sidebar') {
        return (
            <SidebarInset className={cn('overflow-x-hidden', className)} {...restProps}>
                {children}
            </SidebarInset>
        );
    }

    return (
        <main
            className={cn(
                'relative mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-4 overflow-x-hidden rounded-xl',
                className,
            )}
            {...restProps}
        >
            {children}
        </main>
    );
}
