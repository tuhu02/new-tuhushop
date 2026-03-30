import { ShoppingBag } from 'lucide-react';

import type { ProductPriceItem } from '@/types';
import { formatRupiah } from './utils';

type BottomCheckoutBarProps = {
    selectedPrice: ProductPriceItem | null;
    quantity: number;
    totalPrice: number;
};

export default function BottomCheckoutBar({
    selectedPrice,
    quantity,
    totalPrice,
}: BottomCheckoutBarProps) {
    return (
        <div
            className={`fixed right-0 bottom-0 left-0 z-50 border-t border-slate-300 bg-white/95 backdrop-blur transition-all duration-300 ease-out md:left-(--sidebar-width) md:peer-data-[collapsible=offcanvas]:left-0 md:peer-data-[state=collapsed]:left-(--sidebar-width-icon) ${
                selectedPrice !== null
                    ? 'translate-y-0 opacity-100'
                    : 'pointer-events-none translate-y-full opacity-0'
            }`}
            aria-hidden={selectedPrice === null}
        >
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                    <p className="text-[11px] text-slate-500">
                        Total pembayaran
                    </p>
                    <p className="truncate text-sm font-semibold text-slate-900">
                        {selectedPrice !== null
                            ? `${selectedPrice.display_name} x${quantity}`
                            : ''}
                    </p>
                    <p className="text-lg font-bold text-slate-900">
                        {selectedPrice !== null ? formatRupiah(totalPrice) : ''}
                    </p>
                </div>

                <button
                    type="button"
                    className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                    <ShoppingBag className="h-4 w-4" />
                    Beli Sekarang
                </button>
            </div>
        </div>
    );
}
