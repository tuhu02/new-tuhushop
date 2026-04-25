type TransactionInfoCardProps = {
    statusLabel: string;
    showCountdown: boolean;
    countdown: string;
    reference: string;
    formattedAmount: string;
};

export default function TransactionInfoCard({
    statusLabel,
    showCountdown,
    countdown,
    reference,
    formattedAmount,
}: TransactionInfoCardProps) {
    return (
        <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
            <div>
                <p className="text-xs text-slate-500">Status</p>
                <p className="text-lg font-semibold text-slate-900">{statusLabel}</p>
            </div>
            <div>
                <p className="text-xs text-slate-500">Sisa waktu</p>
                <p className="text-lg font-semibold text-slate-900">
                    {showCountdown ? countdown : '-'}
                </p>
            </div>
            <div>
                <p className="text-xs text-slate-500">Referensi</p>
                <p className="font-mono text-sm text-slate-900">{reference}</p>
            </div>
            <div>
                <p className="text-xs text-slate-500">Total Bayar</p>
                <p className="text-lg font-semibold text-slate-900">{formattedAmount}</p>
            </div>
        </div>
    );
}
