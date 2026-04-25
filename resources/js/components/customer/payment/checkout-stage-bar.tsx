import { Check, Clock3, WalletCards } from 'lucide-react';

export type CheckoutStage = 1 | 2 | 3;

type CheckoutStageBarProps = {
    checkoutStage: CheckoutStage;
};

const stageSteps: Array<{
    label: string;
    icon: 'pay' | 'process' | 'done';
}> = [
    { label: 'Bayar', icon: 'pay' },
    { label: 'Diproses', icon: 'process' },
    { label: 'Selesai', icon: 'done' },
];

export default function CheckoutStageBar({ checkoutStage }: CheckoutStageBarProps) {
    return (
        <div className="rounded-2xl bg-slate-100 px-4 py-4">
            <div className="grid grid-cols-3 items-center">
                {stageSteps.map((step, index) => {
                    const stageIndex = (index + 1) as CheckoutStage;
                    const isActive = stageIndex === checkoutStage;
                    const iconClass = isActive
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-400 text-white';

                    return (
                        <div key={step.label} className="relative flex justify-center">
                            {index > 0 ? (
                                <span className="absolute top-1/2 left-0 h-1 w-1/2 -translate-y-1/2 rounded-full bg-slate-300" />
                            ) : null}
                            {index < stageSteps.length - 1 ? (
                                <span className="absolute top-1/2 right-0 h-1 w-1/2 -translate-y-1/2 rounded-full bg-slate-300" />
                            ) : null}
                            <span
                                className={`relative z-10 inline-flex h-7 w-7 items-center justify-center rounded-full ${iconClass}`}
                            >
                                {step.icon === 'pay' ? (
                                    <WalletCards className="h-3.5 w-3.5" />
                                ) : step.icon === 'process' ? (
                                    <Clock3 className="h-3.5 w-3.5" />
                                ) : (
                                    <Check className="h-3.5 w-3.5" />
                                )}
                            </span>
                        </div>
                    );
                })}
            </div>

            <div className="mt-2 grid grid-cols-3 text-sm font-medium text-slate-700">
                {stageSteps.map((step) => (
                    <p key={`${step.label}-label`} className="text-center">
                        {step.label}
                    </p>
                ))}
            </div>
        </div>
    );
}
