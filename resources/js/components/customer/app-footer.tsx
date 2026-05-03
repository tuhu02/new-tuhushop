import * as React from 'react';
import { Link } from '@inertiajs/react';

export function AppFooter() {
    return (
        <footer className="w-full border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <div className="flex flex-col items-center gap-2 md:items-start">
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-bold tracking-tight text-foreground">
                                Tuhu Shop
                            </span>
                        </div>
                        <p className="text-center text-sm text-muted-foreground md:text-left">
                            Solusi terbaik untuk kebutuhan digital Anda. Cepat, aman, dan terpercaya.
                        </p>
                    </div>

                    <div className="flex flex-col items-center gap-4 md:items-end">
                        <nav className="flex gap-4 text-sm font-medium">
                            <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                                Syarat & Ketentuan
                            </Link>
                            <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                                Kebijakan Privasi
                            </Link>
                            <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                                Hubungi Kami
                            </Link>
                        </nav>
                        <p className="text-sm text-muted-foreground">
                            &copy; {new Date().getFullYear()} Tuhu Shop. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
