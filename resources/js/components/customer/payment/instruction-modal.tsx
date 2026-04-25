import { useEffect, useRef, useState, type ReactNode } from 'react';
import AccordionItem from '@/components/customer/payment/accordion-item';

type PaymentInstruction = {
    title: string;
    steps: string[];
};

type InstructionModalProps = {
    open: boolean;
    onClose: () => void;
    title: string;
    instructions: PaymentInstruction[];
    renderStep: (step: string) => ReactNode[];
};

export default function InstructionModal({
    open,
    onClose,
    title,
    instructions,
    renderStep,
}: InstructionModalProps) {
    const [openIndex, setOpenIndex] = useState<number>(0);
    const backdropRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [open, onClose]);

    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    if (!open) return null;

    return (
        <div
            ref={backdropRef}
            onClick={(e) => {
                if (e.target === backdropRef.current) onClose();
            }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
        >
            <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                    <h2 className="text-base font-semibold text-slate-900">
                        Cara Pembayaran {title}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                        aria-label="Tutup"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <div className="max-h-[70vh] space-y-2 overflow-y-auto p-5">
                    {instructions.map((instruction, index) => (
                        <AccordionItem
                            key={instruction.title}
                            instruction={instruction}
                            isOpen={openIndex === index}
                            onToggle={() =>
                                setOpenIndex((prev) =>
                                    prev === index ? -1 : index,
                                )
                            }
                            renderStep={renderStep}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
