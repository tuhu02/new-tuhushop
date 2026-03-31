import { ChevronDown, Landmark, QrCode, Store, Wallet } from 'lucide-react';

import SectionCard from './section-card';
import { paymentLogos } from './utils';

type PaymentSectionProps = {
    selectedPayment: string;
    onSelectPayment: (payment: string) => void;
};

export default function PaymentSection({
    selectedPayment,
    onSelectPayment,
}: PaymentSectionProps) {
    return (
        <SectionCard number={4} title="Pilih Pembayaran">
            <div className="space-y-3 text-slate-900">
                <button
                    type="button"
                    onClick={() => onSelectPayment('qris')}
                    className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-left transition ${
                        selectedPayment === 'qris'
                            ? 'border border-slate-900 bg-white ring-2 ring-slate-900/20'
                            : 'border border-slate-200 bg-slate-50'
                    }`}
                >
                    <span className="flex items-center gap-2 text-sm font-semibold">
                        <QrCode className="h-5 w-5 text-slate-700" />
                        QRIS (All Payment)
                    </span>
                    <span className="text-xs text-slate-600">Min. 100,00</span>
                </button>

                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="flex items-center justify-between text-sm font-medium">
                        <span className="flex items-center gap-2">
                            <Wallet className="h-4 w-4" />
                            E-Wallet
                        </span>
                        <ChevronDown className="h-4 w-4 text-slate-500" />
                    </div>
                    <p className="mt-2 text-[11px] text-slate-500">
                        {paymentLogos.ewallet.join(' • ')}
                    </p>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="flex items-center justify-between text-sm font-medium">
                        <span className="flex items-center gap-2">
                            <Landmark className="h-4 w-4" />
                            Virtual Account
                        </span>
                        <ChevronDown className="h-4 w-4 text-slate-500" />
                    </div>
                    <p className="mt-2 text-[11px] text-slate-500">
                        {paymentLogos.va.join(' • ')}
                    </p>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="flex items-center justify-between text-sm font-medium">
                        <span className="flex items-center gap-2">
                            <Store className="h-4 w-4" />
                            Convenience Store
                        </span>
                        <ChevronDown className="h-4 w-4 text-slate-500" />
                    </div>
                    <p className="mt-2 text-[11px] text-slate-500">
                        {paymentLogos.store.join(' • ')}
                    </p>
                </div>
            </div>
        </SectionCard>
    );
}
