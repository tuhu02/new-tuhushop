import { Minus, Plus } from 'lucide-react';

import SectionCard from './section-card';

type QuantitySectionProps = {
    quantity: number;
    onIncrease: () => void;
    onDecrease: () => void;
};

export default function QuantitySection({
    quantity,
    onIncrease,
    onDecrease,
}: QuantitySectionProps) {
    return (
        <SectionCard number={2} title="Masukkan Jumlah Pembelian">
            <div className="flex items-center gap-2">
                <input
                    value={quantity}
                    readOnly
                    className="h-10 flex-1 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none"
                />
                <button
                    type="button"
                    onClick={onIncrease}
                    className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-900 text-white transition hover:bg-slate-800"
                    aria-label="Tambah jumlah"
                >
                    <Plus className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onClick={onDecrease}
                    className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-700 text-white transition hover:bg-slate-800"
                    aria-label="Kurangi jumlah"
                >
                    <Minus className="h-4 w-4" />
                </button>
            </div>
        </SectionCard>
    );
}
