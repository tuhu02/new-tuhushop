import { Headphones } from 'lucide-react';

export default function SupportAside() {
    return (
        <aside className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="rounded-xl border border-slate-200 bg-white p-4 text-slate-900">
                <div className="flex items-center gap-3">
                    <Headphones className="h-5 w-5 text-slate-600" />
                    <div>
                        <p className="font-semibold">Butuh Bantuan?</p>
                        <p className="text-sm text-slate-600">
                            Kamu bisa hubungi admin disini.
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
