import * as React from 'react';
import { Link } from '@inertiajs/react';
import AppLogoIcon from '../ui/app-logo-icon';

export function AppFooter() {
    const payments = [
        {
            name: 'BCA',
            image: '/images/payments/bca.png',
        },
        {
            name: 'BRI',
            image: '/images/payments/bri.png',
        },
        {
            name: 'DANA',
            image: '/images/payments/dana.png',
        },
        {
            name: 'OVO',
            image: '/images/payments/ovo.png',
        },
        {
            name: 'QRIS',
            image: '/images/payments/qris.png',
        },
    ];

    return (
        <footer className="w-full border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <div className="flex flex-col items-center gap-2 md:items-start">
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
                        <div className="flex w-full flex-col items-end gap-2">
                            <p className="text-sm font-medium text-foreground">
                                Payment Terpercaya
                            </p>

                            <div className="flex flex-wrap justify-start gap-2">
                                {payments.map((payment) => (
                                    <div
                                        key={payment.name}
                                        className="flex h-9 items-center justify-center rounded-md border border-border bg-white px-3 py-1"
                                    >
                                        <img
                                            src={payment.image}
                                            alt={payment.name}
                                            className="h-2.5 w-auto object-contain"
                                        />
                                    </div>
                                ))}
                                +20 Lainnya
                            </div>
                        </div>

                        <nav className="flex flex-wrap justify-start gap-4 text-sm font-medium md:justify-end">
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

                        <p className="text-sm text-muted-foreground">
                            &copy; {new Date().getFullYear()} Tuhu Shop. All
                            rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
