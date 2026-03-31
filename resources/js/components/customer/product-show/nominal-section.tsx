import type { PriceByCategory, ProductPriceItem } from '@/types';
import { Gem } from 'lucide-react';

import { formatRupiah } from './utils';

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
            <div className="mt-2.5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
                {priceItems.map((price) => {
                    const isSelected = selectedPriceId === price.id;

                    return (
                        <button
                            key={price.id}
                            type="button"
                            onClick={() => onSelectPrice(price.id)}
                            className={`overflow-hidden rounded-xl border transition hover:-translate-y-px hover:border-slate-800 ${
                                isSelected
                                    ? 'border-blue-600 bg-white ring-2 ring-blue-200'
                                    : 'border-slate-200 bg-white'
                            }`}
                        >
                            <div className="px-3 pt-3 pb-2">
                                <p className="text-sm font-semibold text-slate-900">
                                    {price.display_name}
                                </p>

                                <div className="mt-2 flex items-center gap-1.5">
                                    <Gem className="h-4 w-4 text-slate-900" />
                                    <p className="text-lg font-bold text-slate-900">
                                        {formatRupiah(price.price)}
                                    </p>
                                </div>
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
