import { ShoppingBag } from 'lucide-react';

import type { PaymentChannel, ProductPriceItem } from '@/types';
import { formatRupiah } from './utils';

type BottomCheckoutBarProps = {
    selectedPrice: ProductPriceItem | null;
    selectedChannel: PaymentChannel | null;
    quantity: number;
    feeFlat: number;
    feePercent: number;
    feePercentAmount: number;
    totalPrice: number;
};

export default function BottomCheckoutBar({
    selectedPrice,
    selectedChannel,
    quantity,
    feeFlat,
    feePercent,
    feePercentAmount,
    totalPrice,
}: BottomCheckoutBarProps) {
    const feeLabel =
        selectedChannel === null
            ? 'Biaya layanan: Rp0'
            : `Biaya layanan ${selectedChannel.name}: ${formatRupiah(feeFlat)}${
                  feePercent > 0
                      ? ` + ${feePercent}% (${formatRupiah(feePercentAmount)})`
                      : ''
              }`;

    return (
        <div
            className={`fixed right-0 bottom-0 left-0 z-50 px-3 pb-3 transition-all duration-300 ease-out sm:px-4 sm:pb-4 ${
                selectedPrice !== null
                    ? 'translate-y-0 opacity-100'
                    : 'pointer-events-none translate-y-full opacity-0'
            }`}
            aria-hidden={selectedPrice === null}
        >
            <div className="mx-auto w-full max-w-5xl rounded-2xl border border-slate-200 bg-white/95 shadow-lg backdrop-blur">
                <div className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
                    <div className="min-w-0">
                        <p className="text-[11px] text-slate-500">
                            Total pembayaran
                        </p>
                        <p className="truncate text-sm font-semibold text-slate-900">
                            {selectedPrice !== null
                                ? `${selectedPrice.display_name} x${quantity}`
                                : ''}
                        </p>
                        <p className="text-xs text-slate-500">{feeLabel}</p>
                        <p className="text-lg font-bold text-slate-900">
                            {selectedPrice !== null
                                ? formatRupiah(totalPrice)
                                : ''}
                        </p>
                    </div>

                    <button
                        type="button"
                        className="flex w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 sm:w-auto"
                    >
                        <ShoppingBag className="h-4 w-4" />
                        Beli Sekarang
                    </button>
                </div>
            </div>
        </div>
    );
}
