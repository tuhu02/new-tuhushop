import { Minus, Plus } from 'lucide-react';

import SectionCard from './section-card';

type QuantitySectionProps = {
    quantity: number;
    onIncrease: () => void;
    onDecrease: () => void;
    disabled?: boolean;
};

export default function QuantitySection({
    quantity,
    onIncrease,
    onDecrease,
    disabled = false,
}: QuantitySectionProps) {
    return (
        <SectionCard number={3} title="Masukkan Jumlah Pembelian">
            <div className="flex items-center gap-2">
                <input
                    value={quantity}
                    readOnly
                    disabled={disabled}
                    className="h-10 flex-1 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 dark:disabled:bg-slate-800 dark:disabled:text-slate-400"
                />

                <button
                    type="button"
                    onClick={onIncrease}
                    disabled={disabled}
                    className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-900 text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-slate-900"
                    aria-label="Tambah jumlah"
                >
                    <Plus className="h-4 w-4" />
                </button>

                <button
                    type="button"
                    onClick={onDecrease}
                    disabled={disabled || quantity <= 1}
                    className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-700 text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-slate-700"
                    aria-label="Kurangi jumlah"
                >
                    <Minus className="h-4 w-4" />
                </button>
            </div>

            {disabled && (
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    Produk manual hanya bisa dibeli 1 item per transaksi.
                </p>
            )}
        </SectionCard>
    );
}
