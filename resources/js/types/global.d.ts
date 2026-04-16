import type { Auth } from '@/types/auth';

type HeaderSearchProduct = {
    id: number;
    name: string;
    slug: string;
    thumbnail_url: string | null;
};

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            sidebarOpen: boolean;
            headerSearchProducts: HeaderSearchProduct[];
            [key: string]: unknown;
        };
    }
}
