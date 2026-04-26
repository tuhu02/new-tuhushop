import { ShoppingBag } from 'lucide-react';
import { useState } from 'react';
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
    productId: number;
    customerInputs: Record<string, string>;
    phoneNumber: string;
    promoCode: string;
};

export default function BottomCheckoutBar({
    selectedPrice,
    selectedChannel,
    quantity,
    feeFlat,
    feePercent,
    feePercentAmount,
    totalPrice,
    productId,
    customerInputs,
    phoneNumber,
    promoCode,
}: BottomCheckoutBarProps) {
    const [loading, setLoading] = useState(false);

    const feeLabel =
        selectedChannel === null
            ? 'Biaya layanan: Rp0'
            : `Biaya layanan ${selectedChannel.name}: ${formatRupiah(feeFlat)}${
                  feePercent > 0
                      ? ` + ${feePercent}% (${formatRupiah(feePercentAmount)})`
                      : ''
              }`;

    const handleCheckout = async () => {
        if (selectedPrice === null) return;

        if (selectedChannel === null) {
            alert('Pilih metode pembayaran terlebih dahulu');
            return;
        }

        const hasEmptyInput = Object.values(customerInputs).some(
            (value) => value.trim() === '',
        );

        if (Object.keys(customerInputs).length === 0 || hasEmptyInput) {
            alert('Lengkapi data tujuan terlebih dahulu');
            return;
        }

        if (phoneNumber.trim() === '') {
            alert('Masukkan nomor WhatsApp terlebih dahulu');
            return;
        }

        setLoading(true);

        try {
            const csrfToken = (
                document.querySelector(
                    'meta[name="csrf-token"]',
                ) as HTMLMetaElement
            )?.content;

            const response = await fetch('/checkout', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken ?? '',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    product_id: productId,
                    price_id: selectedPrice.id,
                    quantity: quantity,
                    payment_code: selectedChannel.code,
                    phone_number: phoneNumber,
                    customer_inputs: customerInputs,

                    promo_code: promoCode,
                }),
            });

            const data = await response.json();

            if (data.redirect_url) {
                window.location.href = data.redirect_url;
            } else {
                alert(data.message ?? 'Terjadi kesalahan, coba lagi');
            }
        } catch (err) {
            console.error(err);
            alert('Terjadi kesalahan, coba lagi');
        } finally {
            setLoading(false);
        }
    };

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
                        onClick={handleCheckout}
                        disabled={loading}
                        className="flex w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                    >
                        <ShoppingBag className="h-4 w-4" />
                        {loading ? 'Memproses...' : 'Beli Sekarang'}
                    </button>
                </div>
            </div>
        </div>
    );
}
