import { Headphones } from 'lucide-react';

interface Instruction {
    title: string;
    content: string;
}

interface SupportAsideProps {
    instructions: Instruction[];
}

export default function SupportAside({ instructions = [] }: SupportAsideProps) {
    return (
        <aside className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            {instructions.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-300 px-3 py-4 text-sm text-slate-500">
                    Belum ada instruksi untuk produk ini.
                </div>
            )}

            {instructions.map((item, index) => (
                <div key={index} className="rounded-xl bg-slate-50 px-3 py-2.5">
                    <p className="text-sm font-semibold text-slate-900">
                        {item.title}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed whitespace-pre-line text-slate-700">
                        {item.content.replaceAll('\\n', '\n')}
                    </p>
                </div>
            ))}
        </aside>
    );
}
