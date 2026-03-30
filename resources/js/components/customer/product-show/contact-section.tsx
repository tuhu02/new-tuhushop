import { Info, MessageCircle } from 'lucide-react';

import SectionCard from './section-card';

type ContactSectionProps = {
    phoneNumber: string;
    onChangePhoneNumber: (value: string) => void;
};

export default function ContactSection({
    phoneNumber,
    onChangePhoneNumber,
}: ContactSectionProps) {
    return (
        <SectionCard number={6} title="Detail Kontak">
            <div className="space-y-3 text-slate-900">
                <div>
                    <label className="mb-1 block text-xs text-slate-600">
                        No. WhatsApp
                    </label>
                    <div className="flex h-10 items-center rounded-md border border-slate-300 bg-white px-3">
                        <span className="mr-2 text-sm">🇮🇩</span>
                        <span className="mr-2 text-sm text-slate-600">+62</span>
                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(event) =>
                                onChangePhoneNumber(event.target.value)
                            }
                            placeholder="89xxxxxx"
                            className="w-full border-none bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                        />
                    </div>
                    <p className="mt-2 text-[11px] text-slate-500 italic">
                        Nomor ini akan dihubungi jika terjadi masalah.
                    </p>
                </div>
                <div className="flex items-start gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-600">
                    <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    Pastikan nomor WhatsApp benar, agar kami bisa menghubungi
                    jika transaksi bermasalah.
                </div>
                <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-xs text-slate-800 transition hover:bg-slate-50"
                >
                    <MessageCircle className="h-3.5 w-3.5" />
                    Hubungi CS
                </button>
            </div>
        </SectionCard>
    );
}
