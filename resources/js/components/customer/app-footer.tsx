import { Link } from '@inertiajs/react';
import * as React from 'react';
import AppLogoIcon from '../ui/app-logo-icon';

export function AppFooter() {
    const payments = [
        { name: 'BCA', image: '/images/payments/bca.png' },
        { name: 'BRI', image: '/images/payments/bri.png' },
        { name: 'DANA', image: '/images/payments/dana.png' },
        { name: 'OVO', image: '/images/payments/ovo.png' },
        { name: 'QRIS', image: '/images/payments/qris.png' },
    ];

    return (
        <footer className="w-full overflow-x-hidden border-t border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                    {/* Kiri: Logo + Deskripsi */}
                    <div className="flex flex-col items-center gap-2 md:max-w-xs md:items-start">
                        <div className="flex items-center gap-2">
                            <AppLogoIcon className="h-8 w-auto" />
                        </div>
                        <p className="text-center text-sm text-muted-foreground md:text-left">
                            Solusi terbaik untuk kebutuhan digital Anda. Cepat,
                            aman, dan terpercaya.
                        </p>
                        <p className="text-center text-sm text-muted-foreground md:text-left">
                            Tinawun Kecamatan Malo Kabupaten Bojonegoro
                        </p>
                    </div>

                    <div className="flex flex-col items-center gap-4 md:items-end">
                        <div className="flex w-full flex-col items-center gap-2 md:items-end">
                            <p className="text-sm font-medium text-foreground">
                                Payment Terpercaya
                            </p>
                            <div className="flex flex-wrap justify-center gap-2 md:justify-end">
                                {payments.map((payment) => (
                                    <div
                                        key={payment.name}
                                        className="flex h-9 items-center justify-center rounded-md border border-border bg-white px-3 py-1 dark:bg-slate-900"
                                    >
                                        <img
                                            src={payment.image}
                                            alt={payment.name}
                                            className="h-2.5 w-auto object-contain"
                                        />
                                    </div>
                                ))}
                                <span className="flex h-9 items-center text-sm text-muted-foreground">
                                    +20 Lainnya
                                </span>
                            </div>
                        </div>

                        {/* Navigasi */}
                        <nav className="flex flex-wrap justify-center gap-4 text-sm font-medium md:justify-end">
                            <Link
                                href="#"
                                className="text-muted-foreground transition-colors hover:text-foreground"
                            >
                                Syarat & Ketentuan
                            </Link>
                            <Link
                                href="#"
                                className="text-muted-foreground transition-colors hover:text-foreground"
                            >
                                Kebijakan Privasi
                            </Link>
                            <a
                                href="https://wa.me/6285171743947"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground transition-colors hover:text-foreground"
                            >
                                Hubungi Kami
                            </a>
                        </nav>

                        <p className="text-center text-sm text-muted-foreground md:text-right">
                            &copy; {new Date().getFullYear()} Tuhu Shop. All
                            rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
