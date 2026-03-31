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
            <div className="flex h-11 items-center gap-2 p-3.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-foreground text-accent">
                    {number}
                </div>
                <h3 className="text-sm font-semibold text-accent-foreground">
                    {title}
                </h3>
            </div>
            <div className="p-4">{children}</div>
        </section>
    );
}
