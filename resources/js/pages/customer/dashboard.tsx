import { Head } from '@inertiajs/react';
import CardProduct from '@/components/customer/card-product';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type DashboardCarousel = {
    id: number;
    title: string | null;
    image_url: string;
};

type DashboardProduct = {
    id: number;
    name: string;
    slug: string;
    thumbnail_url: string | null;
    brand: string | null;
    categories: string[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
];

export default function Dashboard({
    carousels,
    products,
}: {
    carousels: DashboardCarousel[];
    products: DashboardProduct[];
}) {
    const categoryOrder = ['🔥 Lagi Populer', 'Top Up Langsung', 'PPOB'];

    const groupedProducts = products.reduce<Record<string, DashboardProduct[]>>(
        (groups, product) => {
            if (product.categories.length === 0) {
                groups.Lainnya = [...(groups.Lainnya ?? []), product];

                return groups;
            }

            product.categories.forEach((category) => {
                groups[category] = [...(groups[category] ?? []), product];
            });

            return groups;
        },
        {},
    );

    const sortedGroups = Object.entries(groupedProducts).sort(([a], [b]) => {
        const aIndex = categoryOrder.findIndex(
            (category) => category.toLowerCase() === a.toLowerCase(),
        );
        const bIndex = categoryOrder.findIndex(
            (category) => category.toLowerCase() === b.toLowerCase(),
        );

        if (aIndex !== -1 && bIndex !== -1) {
            return aIndex - bIndex;
        }

        if (aIndex !== -1) {
            return -1;
        }

        if (bIndex !== -1) {
            return 1;
        }

        return a.localeCompare(b);
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="space-y-6 p-4">
                {carousels.length > 0 && (
                    <div className="flex justify-center px-1">
                        <Carousel className="mx-auto w-full">
                            <CarouselContent className="items-stretch">
                                {carousels.map((item) => (
                                    <CarouselItem
                                        key={item.id}
                                        className="h-60 md:h-80 lg:h-96"
                                    >
                                        <div className="h-full overflow-hidden rounded-xl border border-sidebar-border/70">
                                            <img
                                                src={item.image_url}
                                                alt={
                                                    item.title ??
                                                    'carousel image'
                                                }
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="top-1/2 left-3 z-10 -translate-y-1/2 bg-background/90 hover:bg-background" />
                            <CarouselNext className="top-1/2 right-3 z-10 -translate-y-1/2 bg-background/90 hover:bg-background" />
                        </Carousel>
                    </div>
                )}

                {products.length === 0 ? (
                    <div className="rounded-xl border border-sidebar-border/70 p-6 text-sm text-muted-foreground">
                        Belum ada produk aktif.
                    </div>
                ) : (
                    sortedGroups.map(([category, categoryProducts]) => (
                        <section key={category} className="space-y-3">
                            <h1 className="mt-16 mb-10 text-3xl font-bold">
                                {category}
                            </h1>
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                                {categoryProducts.map((product, index) => (
                                    <div
                                        key={`${category}-${product.id}`}
                                        className={cn(
                                            'w-full',
                                            categoryProducts.length % 2 === 1 &&
                                                index ===
                                                    categoryProducts.length -
                                                        1 &&
                                                'col-span-2 mx-auto max-w-56 sm:col-span-1 sm:max-w-none',
                                            categoryProducts.length % 5 === 1 &&
                                                index ===
                                                    categoryProducts.length -
                                                        1 &&
                                                'lg:col-start-3',
                                        )}
                                    >
                                        <CardProduct
                                            title={product.name}
                                            image={
                                                product.thumbnail_url ??
                                                '/favicon.svg'
                                            }
                                            brand={product.brand ?? 'Unknown'}
                                            badge={
                                                product.categories[0] ?? 'New'
                                            }
                                            slug={product.slug}
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))
                )}
            </div>
        </AppLayout>
    );
}
