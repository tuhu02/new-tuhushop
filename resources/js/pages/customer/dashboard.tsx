import { Head } from '@inertiajs/react';
import CardProduct from '@/components/customer/card-product';
import CarouselHero from '@/components/customer/carousel-hero';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type DashboardCarousel = {
    id: number;
    title: string | null;
    description: string | null;
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

function categoryId(category: string) {
    return `category-${category
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')}`;
}

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

    const handleClickCategory = (category: string) => {
        const element = document.getElementById(categoryId(category));
        element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head>
                <title>Top Up Game Murah, Cepat & Terpercaya</title>
                <meta name="description" content="TUHU SHOP adalah platform top up game murah, aman, cepat, dan terpercaya. Menyediakan top up Mobile Legends (ML), PUBG Mobile, Free Fire (FF), dan game populer lainnya dengan pelayanan 24 jam otomatis." />
                <meta name="keywords" content="tuhu shop, tuhushop, top up game, top up ml, top up pubg, top up ff, top up murah, voucher game murah, top up game otomatis" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="TUHU SHOP - Top Up Game Murah, Cepat & Terpercaya" />
                <meta property="og:description" content="TUHU SHOP adalah platform top up game murah, aman, cepat, dan terpercaya. Menyediakan top up Mobile Legends, PUBG Mobile, Free Fire, dan game populer lainnya dengan pelayanan 24 jam otomatis." />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="TUHU SHOP - Top Up Game Murah, Cepat & Terpercaya" />
                <meta name="twitter:description" content="TUHU SHOP adalah platform top up game murah, aman, cepat, dan terpercaya. Menyediakan top up Mobile Legends, PUBG Mobile, Free Fire, dan game populer lainnya dengan pelayanan 24 jam otomatis." />
            </Head>

            <div className="w-full overflow-x-hidden">
                <div className="space-y-6 p-4">
                    <CarouselHero carousels={carousels} />

                    {products.length > 0 && (
                        <div className="w-full overflow-hidden">
                            <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                {sortedGroups.map(([category]) => (
                                    <button
                                        key={category}
                                        type="button"
                                        onClick={() =>
                                            handleClickCategory(category)
                                        }
                                        className="shrink-0 rounded-full border bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {products.length === 0 ? (
                        <div className="rounded-xl border border-sidebar-border/70 p-6 text-sm text-muted-foreground">
                            Belum ada produk aktif.
                        </div>
                    ) : (
                        <div className="space-y-10">
                            {sortedGroups.map(
                                ([category, categoryProducts]) => (
                                    <section
                                        key={category}
                                        id={categoryId(category)}
                                        className="scroll-mt-24 space-y-6"
                                    >
                                        <h1 className="text-3xl font-bold">
                                            {category}
                                        </h1>

                                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                                            {categoryProducts.map((product) => (
                                                <div
                                                    key={`${category}-${product.id}`}
                                                >
                                                    <CardProduct
                                                        title={product.name}
                                                        image={
                                                            product.thumbnail_url ??
                                                            '/favicon.svg'
                                                        }
                                                        brand={
                                                            product.brand ??
                                                            'Unknown'
                                                        }
                                                        badge={
                                                            product
                                                                .categories[0] ??
                                                            'New'
                                                        }
                                                        slug={product.slug}
                                                        variant={
                                                            category ===
                                                            '🔥 Lagi Populer'
                                                                ? 'popular'
                                                                : 'default'
                                                        }
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                ),
                            )}

                            <section className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                                <div className="relative flex flex-col items-center gap-6 px-6 py-8 text-center md:flex-row md:gap-8 md:px-8 md:py-10 md:text-left">
                                    <div className="relative z-10 shrink-0">
                                        <img
                                            src="/images/logo/produk-tidak-ketemu.png"
                                            alt="Produk tidak ketemu"
                                            className="w-48 md:w-56"
                                        />
                                    </div>

                                    <div className="relative z-10 flex flex-col items-center md:items-start">
                                        <h2 className="text-xl font-bold text-gray-900 md:text-2xl dark:text-white">
                                            Gak nemu yang kamu cari?
                                        </h2>

                                        <p className="mt-2 max-w-md text-sm text-gray-700 md:text-base dark:text-slate-400">
                                            Kasih tau kami game atau produk yang
                                            harusnya ada di Tuhu Shop.
                                        </p>

                                        <button className="mt-6 w-full rounded-full border border-blue-700 px-6 py-2.5 font-semibold text-blue-700 transition hover:bg-blue-50 sm:w-auto md:px-8 md:py-3 dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-950/30">
                                            Kasih saran game atau produk
                                        </button>
                                    </div>

                                    <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 bg-linear-to-l from-indigo-50 to-transparent md:block dark:from-indigo-950/10" />

                                    <div className="pointer-events-none absolute right-0 bottom-0 hidden h-40 w-72 rotate-12 rounded-xl bg-indigo-100/50 md:block dark:bg-indigo-950/30" />
                                    <div className="pointer-events-none absolute right-20 bottom-8 hidden h-32 w-56 rotate-12 rounded-xl bg-indigo-100/40 md:block dark:bg-indigo-950/20" />
                                </div>
                            </section>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
