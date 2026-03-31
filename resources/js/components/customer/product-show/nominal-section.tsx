import type { PriceByCategory, ProductPriceItem } from '@/types';

import { formatRupiah } from './utils';

const DIAMOND_LOGO_URL =
    'https://sin1.contabostorage.com/b1d79b8bbee7475eab6c15cd3d13cd4d:knock/p/17066126930981670143.webp';

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
    categoryTitle,
    pricesByCategory,
    selectedCategoryId,
    onSelectCategory,
    priceItems,
    selectedPriceId,
    onSelectPrice,
}: NominalSectionProps) {
    return (
        <section className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
            <div className="mb-2 flex gap-2 rounded-md bg-white p-0.5 text-sm font-semibold">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-foreground text-accent">
                    1
                </div>
                <span>Pilih Nominal</span>
            </div>

            {pricesByCategory.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
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
                                className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold transition ${
                                    isActive
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-slate-300 bg-white text-slate-700 hover:border-slate-500'
                                }`}
                            >
                                {group.category.name}
                            </button>
                        );
                    })}
                </div>
            )}
            <div className="mt-2.5 grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
                {priceItems.map((price) => {
                    const isSelected = selectedPriceId === price.id;

                    return (
                        <button
                            key={price.id}
                            type="button"
                            onClick={() => onSelectPrice(price.id)}
                            className={`overflow-hidden rounded-lg border transition hover:-translate-y-px hover:border-blue-600 ${
                                isSelected
                                    ? 'border-blue-600 bg-white ring-2 ring-blue-200'
                                    : 'border-slate-200 bg-white'
                            }`}
                        >
                            <div className="flex items-center justify-between gap-2 px-2.5 py-2">
                                <div className="min-w-0 text-left">
                                    <p className="truncate text-[12px] font-semibold text-slate-900">
                                        {price.display_name}
                                    </p>

                                    <p className="mt-0.5 text-sm pt-2 leading-tight text-slate-900">
                                        {formatRupiah(price.price)}
                                    </p>
                                </div>

                                <img
                                    src={DIAMOND_LOGO_URL}
                                    alt="Diamond"
                                    className="h-5 w-5 shrink-0 object-contain"
                                    loading="lazy"
                                />
                            </div>
                        </button>
                    );
                })}

                {priceItems.length === 0 && (
                    <div className="col-span-full rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-600">
                        Belum ada pilihan diamond untuk produk ini.
                    </div>
                )}
            </div>
        </section>
    );
}
