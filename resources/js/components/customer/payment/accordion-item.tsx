import { ReactNode } from 'react';

function ChevronIcon({ open }: { open: boolean }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
            />
        </svg>
    );
}

export default function AccordionItem({
    instruction,
    isOpen,
    onToggle,
    renderStep,
}: {
    instruction: { title: string; steps: string[] };
    isOpen: boolean;
    onToggle: () => void;
    renderStep: (step: string) => ReactNode[];
}) {
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200">
            <button
                type="button"
                onClick={onToggle}
                className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-slate-50"
            >
                <h2 className="text-sm font-semibold text-slate-900">
                    {instruction.title}
                </h2>
                <ChevronIcon open={isOpen} />
            </button>

            <div
                className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
            >
                <div className="overflow-hidden">
                    <div className="border-t border-slate-100 p-5">
                        <ol className="space-y-3 text-sm text-slate-700">
                            {instruction.steps.map((step, index) => (
                                <li
                                    key={`${instruction.title}-${index}`}
                                    className="flex items-start gap-3 leading-relaxed"
                                >
                                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                                        {index + 1}
                                    </span>
                                    <span>{renderStep(step)}</span>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
}
