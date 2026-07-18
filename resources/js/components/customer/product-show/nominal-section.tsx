import { useMemo, useState } from 'react';

import { cn } from '@/lib/utils';
import type { PriceByCategory, ProductPriceItem } from '@/types';

import { formatRupiah } from './utils';

const DIAMOND_LOGO_URL =
    'https://sin1.contabostorage.com/b1d79b8bbee7475eab6c15cd3d13cd4d:knock/p/17066126930981670143.webp';

const INITIAL_VISIBLE_ITEMS = 12;
const LOAD_MORE_ITEMS = 12;

type NominalSectionProps = {
    categoryTitle: string;
    pricesByCategory: PriceByCategory[];
    selectedCategoryId: number | null;
    onSelectCategory: (categoryId: number) => void;
    priceItems: ProductPriceItem[];
    selectedPriceId: number | null;
    onSelectPrice: (priceId: number) => void;
};

export default function NominalSection({
    pricesByCategory,
    selectedCategoryId,
    onSelectCategory,
    priceItems,
    selectedPriceId,
    onSelectPrice,
}: NominalSectionProps) {
    const listKey = `${selectedCategoryId}:${priceItems.map((price) => price.id).join(',')}`;
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_ITEMS);
    const [prevListKey, setPrevListKey] = useState(listKey);

    if (listKey !== prevListKey) {
        setPrevListKey(listKey);
        setVisibleCount(INITIAL_VISIBLE_ITEMS);
    }

    const visiblePriceItems = useMemo(() => {
        return priceItems.slice(0, visibleCount);
    }, [priceItems, visibleCount]);

    const hasMoreItems = visibleCount < priceItems.length;

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-3 flex items-center gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white dark:bg-slate-200 dark:text-slate-900">
                    2
                </div>

                <div className="min-w-0">
                    <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        Pilih Nominal
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Pilih produk yang ingin dibeli
                    </p>
                </div>
            </div>

            {pricesByCategory.length > 0 && (
                <div className="-mx-3 overflow-x-auto px-3 pb-1 sm:mx-0 sm:px-0">
                    <div className="flex w-max gap-1.5 sm:w-auto sm:flex-wrap">
                        {pricesByCategory.map((group) => {
                            const isActive =
                                group.category.id === selectedCategoryId;

                            return (
                                <button
                                    key={group.category.id}
                                    type="button"
                                    onClick={() =>
                                        onSelectCategory(group.category.id)
                                    }
                                    className={cn(
                                        'shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition',
                                        isActive
                                            ? 'border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-950/50 dark:text-blue-200 dark:shadow-[inset_0_0_0_1px_rgba(96,165,250,0.35)]'
                                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-500',
                                    )}
                                >
                                    {group.category.name}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {visiblePriceItems.map((price) => {
                    const isSelected = selectedPriceId === price.id;

                    return (
                        <button
                            key={price.id}
                            type="button"
                            onClick={() => onSelectPrice(price.id)}
                            className={cn(
                                'group relative overflow-hidden rounded-xl border text-left transition active:scale-[0.98] sm:hover:-translate-y-px',
                                isSelected
                                    ? 'border-blue-600 bg-blue-50 shadow-sm ring-2 ring-blue-200 dark:border-blue-500 dark:bg-blue-950/40 dark:shadow-[inset_0_0_0_1px_rgba(96,165,250,0.25)] dark:ring-blue-500/35'
                                    : 'border-slate-200 bg-white hover:border-blue-400 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-blue-500',
                            )}
                        >
                            {isSelected && (
                                <div className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-blue-600 shadow-sm ring-2 ring-blue-600/40 dark:bg-sky-400 dark:ring-sky-400/50" />
                            )}

                            <div className="flex min-h-[86px] flex-col justify-between p-2.5 sm:min-h-[92px] sm:p-3">
                                <div className="flex items-start justify-between gap-2">
                                    <p className="line-clamp-2 pr-2 text-[14px] leading-snug font-bold text-slate-900 sm:text-base dark:text-slate-100">
                                        {price.display_name}
                                    </p>
                                    <img
                                        src={
                                            price.icon?.file_path ||
                                            DIAMOND_LOGO_URL
                                        }
                                        alt={price.icon?.name || 'Diamond'}
                                        className="h-8 w-8 shrink-0 object-contain sm:h-9 sm:w-9"
                                        loading="lazy"
                                    />
                                </div>

                                <p className="mt-3 text-[13px] leading-tight text-slate-900 sm:text-sm dark:text-slate-200">
                                    {formatRupiah(price.price)}
                                </p>
                            </div>
                        </button>
                    );
                })}

                {priceItems.length === 0 && (
                    <div className="col-span-full rounded-xl border border-dashed border-slate-300 p-4 text-center text-sm text-slate-600 dark:border-slate-700 dark:text-slate-400">
                        Belum ada pilihan diamond untuk produk ini.
                    </div>
                )}
            </div>

            {hasMoreItems && (
                <div className="mt-4 flex justify-center">
                    <button
                        type="button"
                        onClick={() =>
                            setVisibleCount((current) =>
                                Math.min(
                                    current + LOAD_MORE_ITEMS,
                                    priceItems.length,
                                ),
                            )
                        }
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:border-blue-600 hover:text-blue-600 sm:w-auto dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-500 dark:hover:text-blue-400"
                    >
                        Tampilkan Lebih Banyak
                    </button>
                </div>
            )}
        </section>
    );
}
