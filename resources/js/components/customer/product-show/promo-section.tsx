import { TicketPercent } from 'lucide-react';

import SectionCard from './section-card';

type PromoSectionProps = {
    promoCode: string;
    onChangePromoCode: (value: string) => void;
};

export default function PromoSection({
    promoCode,
    onChangePromoCode,
}: PromoSectionProps) {
    return (
        <SectionCard number={4} title="Kode Promo">
            <div className="space-y-3">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={promoCode}
                        onChange={(event) =>
                            onChangePromoCode(event.target.value)
                        }
                        placeholder="Ketik Kode Promo Kamu"
                        className="h-10 flex-1 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                    />
                    <button
                        type="button"
                        className="rounded-md bg-slate-900 px-4 text-xs font-semibold text-white transition hover:bg-slate-800"
                    >
                        Gunakan
                    </button>
                </div>
                <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 transition hover:bg-slate-50"
                >
                    <TicketPercent className="h-3.5 w-3.5" />
                    Pakai Promo Yang Tersedia
                </button>
            </div>
        </SectionCard>
    );
}
