import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

type PayCodeSectionProps = {
    paymentMethodName: string | null;
    paymentChannelName: string | null;
    paymentChannelCode: string | null;
    payCode: string | null;
    payUrl: string | null;
    qrString: string | null;
    copied: boolean;
    onCopy: () => void;
    hasInstructions: boolean;
    onOpenInstructions: () => void;
};

const QRIS_CODES = ['QRIS', 'QRIS2', 'QRISC'];

function QrCanvas({
    qrString,
    size = 224,
}: {
    qrString: string;
    size?: number;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        QRCode.toCanvas(canvasRef.current, qrString, {
            width: size,
            margin: 1,
            color: { dark: '#0f172a', light: '#ffffff' },
        }).catch(() => {});
    }, [qrString, size]);

    return (
        <canvas
            ref={canvasRef}
            className="rounded-lg"
            style={{ width: size, height: size }}
        />
    );
}

export default function PayCodeSection({
    paymentMethodName,
    paymentChannelName,
    paymentChannelCode,
    payCode,
    payUrl,
    qrString,
    copied,
    onCopy,
    hasInstructions,
    onOpenInstructions,
}: PayCodeSectionProps) {
    const [qrModalOpen, setQrModalOpen] = useState(false);

    const isQris =
        paymentChannelCode !== null &&
        QRIS_CODES.includes(paymentChannelCode.toUpperCase());

    const hasQrString = qrString !== null && qrString.trim() !== '';
    const hasQrUrl = payUrl !== null && payUrl.trim() !== '';

    return (
        <div className="rounded-2xl border border-slate-200 p-4">
            <p className="text-sm font-medium text-slate-900">
                Metode Pembayaran
            </p>

            <p className="mt-1 text-sm text-slate-600">
                {paymentMethodName ?? '-'}
                {paymentChannelName ? ` - ${paymentChannelName}` : ''}
            </p>

            {isQris ? (
                <div className="mt-3 flex flex-col items-center gap-3">
                    <p className="self-start text-xs tracking-[0.2em] text-slate-500 uppercase">
                        QR Code Pembayaran
                    </p>

                    <button
                        type="button"
                        onClick={() => {
                            if (hasQrString || hasQrUrl) {
                                setQrModalOpen(true);
                            }
                        }}
                        disabled={!hasQrString && !hasQrUrl}
                        className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        {hasQrString ? (
                            <QrCanvas qrString={qrString!} />
                        ) : hasQrUrl ? (
                            <img
                                src={payUrl!}
                                alt="QR Code QRIS"
                                className="h-56 w-56 object-contain"
                            />
                        ) : (
                            <div className="flex h-56 w-56 flex-col items-center justify-center text-center text-xs text-slate-400">
                                <svg
                                    className="mb-2 h-8 w-8 text-slate-300"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                                    />
                                </svg>
                                QR Code belum tersedia
                            </div>
                        )}
                    </button>

                    {(hasQrString || hasQrUrl) && (
                        <p className="text-xs text-slate-400">
                            Klik QR untuk memperbesar tampilan.
                        </p>
                    )}

                    <p className="max-w-xs text-center text-xs text-slate-500">
                        Scan QR Code menggunakan aplikasi e-wallet atau mobile
                        banking yang mendukung QRIS.
                    </p>
                </div>
            ) : (
                <>
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
                </>
            )}

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

            {qrModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
                    onClick={() => setQrModalOpen(false)}
                >
                    <div
                        className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-slate-900">
                                    QR Code Pembayaran
                                </p>
                                <p className="text-xs text-slate-500">
                                    Scan QRIS untuk menyelesaikan pembayaran
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setQrModalOpen(false)}
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-lg text-slate-600 transition hover:bg-slate-200"
                            >
                                ×
                            </button>
                        </div>

                        <div className="flex justify-center rounded-2xl border border-slate-200 bg-white p-3">
                            {hasQrString ? (
                                <QrCanvas qrString={qrString!} size={320} />
                            ) : hasQrUrl ? (
                                <img
                                    src={payUrl!}
                                    alt="QR Code QRIS"
                                    className="h-80 w-80 object-contain"
                                />
                            ) : null}
                        </div>

                        <p className="mt-4 text-center text-xs text-slate-500">
                            Ketuk area luar atau tombol × untuk menutup.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
