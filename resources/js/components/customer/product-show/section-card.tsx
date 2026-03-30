import type { ReactNode } from 'react';

type SectionCardProps = {
    number: number;
    title: string;
    children: ReactNode;
};

export default function SectionCard({
    number,
    title,
    children,
}: SectionCardProps) {
    return (
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex h-11 items-center bg-slate-900">
                <div className="flex h-full w-10 items-center justify-center bg-white text-sm font-bold text-slate-900">
                    {number}
                </div>
                <h3 className="px-4 text-sm font-semibold text-white">
                    {title}
                </h3>
            </div>
            <div className="p-4">{children}</div>
        </section>
    );
}
