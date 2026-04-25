type PayCodeSectionProps = {
    paymentMethodName: string | null;
    paymentChannelName: string | null;
    payCode: string | null;
    copied: boolean;
    onCopy: () => void;
    hasInstructions: boolean;
    onOpenInstructions: () => void;
};

export default function PayCodeSection({
    paymentMethodName,
    paymentChannelName,
    payCode,
    copied,
    onCopy,
    hasInstructions,
    onOpenInstructions,
}: PayCodeSectionProps) {
    return (
        <div className="rounded-2xl border border-slate-200 p-4">
            <p className="text-sm font-medium text-slate-900">
                Metode Pembayaran
            </p>
            <p className="mt-1 text-sm text-slate-600">
                {paymentMethodName ?? '-'}
                {paymentChannelName ? ` - ${paymentChannelName}` : ''}
            </p>
            <p className="mt-2 text-xs tracking-[0.2em] text-slate-500 uppercase">
                Kode pembayaran
            </p>
            <div className="mt-2 flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="font-mono text-2xl font-semibold tracking-wider text-slate-900">
                        {payCode ?? '-'}
                    </p>
                    <p className="text-xs text-slate-500">
                        Salin kode ini saat melakukan pembayaran.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onCopy}
                    disabled={!payCode}
                    className="inline-flex h-10 items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {copied ? 'Tersalin' : 'Salin kode'}
                </button>
            </div>

            {hasInstructions && (
                <button
                    type="button"
                    onClick={onOpenInstructions}
                    className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-slate-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                    </svg>
                    Lihat cara bayar
                </button>
            )}
        </div>
    );
}
