import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, PriceByCategory, User } from '@/types';
import { Head } from '@inertiajs/react';
import {
    ShieldCheck,
    Phone,
    CreditCard,
    Zap,
    Gem,
    Star,
    Headphones,
    ShoppingBag,
    Plus,
    Minus,
    TicketPercent,
    Coins,
    QrCode,
    Wallet,
    Landmark,
    Store,
    ChevronDown,
    MessageCircle,
    Info,
} from 'lucide-react';
import { useState } from 'react';

type ProductShowPageProps = {
    product: {
        id: number;
        name: string;
        slug: string;
        description: string | null;
        brand: string | null;
        categories: string[];
        thumbnail: string | null;
        thumbnail_url: string | null;
        banner: string | null;
        banner_url: string | null;
    };
    pricesByCategory: PriceByCategory[];
    user: User | null;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Product Show',
        href: '',
    },
];

const formatRupiah = (value: number) =>
    `Rp ${new Intl.NumberFormat('id-ID').format(value)}`;

const paymentLogos = {
    ewallet: ['GoPay', 'DANA', 'OVO', 'ShopeePay', 'LinkAja'],
    va: ['Mandiri', 'Permata', 'BNI', 'BRI', 'BCA'],
    store: ['Alfamart', 'Indomaret'],
};

export default function ProductShow({
    product,
    pricesByCategory,
}: ProductShowPageProps) {
    const [selectedPriceId, setSelectedPriceId] = useState<number | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [promoCode, setPromoCode] = useState<string>('');
    const [selectedPayment, setSelectedPayment] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const priceItems = pricesByCategory.flatMap((group) => group.prices);
    const selectedPrice =
        selectedPriceId !== null
            ? (priceItems.find((price) => price.id === selectedPriceId) ?? null)
            : null;
    const categoryTitle =
        pricesByCategory[0]?.category.name ?? 'Instant Top Up';
    const totalPrice =
        selectedPrice !== null ? selectedPrice.price * quantity : 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={product.name} />

            <div className="space-y-4 p-4">
                {product.banner_url !== null ? (
                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70">
                        <img
                            src={product.banner_url}
                            alt={product.name}
                            className="h-52 w-full object-cover md:h-72"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-black/10" />

                        <div className="absolute right-4 bottom-4 left-4 z-10 flex items-end gap-4">
                            {product.thumbnail_url !== null && (
                                <img
                                    src={product.thumbnail_url}
                                    alt={`${product.name} thumbnail`}
                                    className="h-28 w-20 transform-[perspective(400px)_rotateY(15deg)_rotateX(-5deg)] rounded-xl border border-white/20 object-cover shadow-xl md:h-40 md:w-28"
                                />
                            )}

                            <div className="pb-2 text-white">
                                {product.categories.length > 0 && (
                                    <div className="mb-1 flex flex-wrap gap-2">
                                        {product.categories.map((category) => (
                                            <span
                                                key={category}
                                                className="rounded-3xl bg-white/50 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur-sm"
                                            >
                                                {category}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <h1 className="text-lg font-extrabold tracking-wide md:text-3xl">
                                    {product.name}
                                </h1>
                                {product.brand !== null && (
                                    <p className="mt-1 text-sm text-white/85 md:text-base">
                                        {product.brand}
                                    </p>
                                )}

                                {product.description !== null && (
                                    <p className="mt-1 text-sm text-white/85">
                                        {' '}
                                        {product.description}{' '}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-xl border border-sidebar-border/70 bg-sidebar-accent/20 p-6">
                        <h1 className="text-xl font-bold">{product.name}</h1>
                        {product.brand !== null && (
                            <p className="text-sm text-muted-foreground">
                                {product.brand}
                            </p>
                        )}
                    </div>
                )}
            </div>

            <div className="mt-4 px-4">
                <div className="mx-auto max-w-5xl rounded-lg bg-linear-to-r from-gray-600 to-gray-800 px-6 py-3">
                    <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/90">
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={16} />
                            <span>Jaminan Layanan</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone size={16} />
                            <span>Jaminan Layanan 24 Jam</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CreditCard size={16} />
                            <span>Pembayaran Aman & Terpercaya</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Zap size={16} />
                            <span>Proses Cepat & Otomatis</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-5 px-4 pb-8">
                <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
                    <div className="space-y-4">
                        <section className="rounded-xl bg-[#5c5c63] p-4 shadow-lg">
                            <h2 className="text-base font-semibold text-yellow-300">
                                ⚡ {categoryTitle}
                            </h2>

                            <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {priceItems.map((price) => {
                                    const isSelected =
                                        selectedPriceId === price.id;

                                    return (
                                        <button
                                            key={price.id}
                                            type="button"
                                            onClick={() =>
                                                setSelectedPriceId(price.id)
                                            }
                                            className={`overflow-hidden rounded-xl border text-left transition hover:-translate-y-px hover:border-cyan-300 ${
                                                isSelected
                                                    ? 'border-cyan-300 bg-[#605c79] ring-2 ring-cyan-300/40'
                                                    : 'border-transparent bg-[#59526a]'
                                            }`}
                                        >
                                            <div className="px-3 pt-3 pb-4">
                                                <p className="text-sm font-semibold text-gray-100">
                                                    {price.display_name}
                                                </p>
                                                <div className="mt-2 flex items-center gap-2">
                                                    <Gem className="h-4 w-4 text-cyan-300" />
                                                    <p className="text-2xl font-bold text-yellow-300">
                                                        {formatRupiah(
                                                            price.price,
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex justify-end bg-[#787295] px-3 py-2">
                                                <span className="rounded bg-white/90 px-2 py-1 text-[10px] font-bold text-emerald-700">
                                                    INSTAN
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}

                                {priceItems.length === 0 && (
                                    <div className="col-span-full rounded-xl border border-dashed border-white/30 p-4 text-sm text-white/80">
                                        Belum ada pilihan diamond untuk produk
                                        ini.
                                    </div>
                                )}
                            </div>
                        </section>

                        <section className="overflow-hidden rounded-xl bg-[#332f3f] shadow-lg">
                            <div className="flex h-11 items-center bg-[#272430]">
                                <div className="flex h-full w-10 items-center justify-center bg-yellow-300 text-sm font-bold text-gray-900">
                                    3
                                </div>
                                <h3 className="px-4 text-sm font-semibold text-white">
                                    Masukkan Jumlah Pembelian
                                </h3>
                            </div>
                            <div className="p-4">
                                <div className="flex items-center gap-2">
                                    <input
                                        value={quantity}
                                        readOnly
                                        className="h-10 flex-1 rounded-md border-none bg-[#5a5668] px-3 text-sm text-white outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setQuantity((prev) => prev + 1)
                                        }
                                        className="flex h-9 w-9 items-center justify-center rounded-md bg-yellow-300 text-gray-900 transition hover:bg-yellow-200"
                                        aria-label="Tambah jumlah"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setQuantity((prev) =>
                                                Math.max(1, prev - 1),
                                            )
                                        }
                                        className="flex h-9 w-9 items-center justify-center rounded-md bg-yellow-300/60 text-gray-900 transition hover:bg-yellow-300"
                                        aria-label="Kurangi jumlah"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </section>

                        <section className="overflow-hidden rounded-xl bg-[#332f3f] shadow-lg">
                            <div className="flex h-11 items-center bg-[#272430]">
                                <div className="flex h-full w-10 items-center justify-center bg-yellow-300 text-sm font-bold text-gray-900">
                                    4
                                </div>
                                <h3 className="px-4 text-sm font-semibold text-white">
                                    Kode Promo
                                </h3>
                            </div>
                            <div className="space-y-3 p-4">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={promoCode}
                                        onChange={(event) =>
                                            setPromoCode(event.target.value)
                                        }
                                        placeholder="Ketik Kode Promo Kamu"
                                        className="h-10 flex-1 rounded-md border-none bg-[#5a5668] px-3 text-sm text-white outline-none placeholder:text-gray-300"
                                    />
                                    <button
                                        type="button"
                                        className="rounded-md bg-yellow-300 px-4 text-xs font-semibold text-gray-900 transition hover:bg-yellow-200"
                                    >
                                        Gunakan
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-2 rounded-md bg-yellow-300 px-3 py-2 text-xs font-semibold text-gray-900 transition hover:bg-yellow-200"
                                >
                                    <TicketPercent className="h-3.5 w-3.5" />
                                    Pakai Promo Yang Tersedia
                                </button>
                            </div>
                        </section>

                        <section className="overflow-hidden rounded-xl bg-[#332f3f] shadow-lg">
                            <div className="flex h-11 items-center bg-[#272430]">
                                <div className="flex h-full w-10 items-center justify-center bg-yellow-300 text-sm font-bold text-gray-900">
                                    5
                                </div>
                                <h3 className="px-4 text-sm font-semibold text-white">
                                    Pilih Pembayaran
                                </h3>
                            </div>
                            <div className="space-y-3 p-4 text-white">
                                <button
                                    type="button"
                                    onClick={() => setSelectedPayment('qris')}
                                    className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-left transition ${
                                        selectedPayment === 'qris'
                                            ? 'bg-[#847f9a] ring-2 ring-yellow-300/70'
                                            : 'bg-[#6f6986]'
                                    }`}
                                >
                                    <span className="flex items-center gap-2 text-sm font-semibold">
                                        <QrCode className="h-5 w-5 text-gray-200" />
                                        QRIS (All Payment)
                                    </span>
                                    <span className="text-xs text-pink-300">
                                        Min. 100,00
                                    </span>
                                </button>

                                <div className="rounded-lg bg-[#6f6986] px-4 py-3">
                                    <div className="flex items-center justify-between text-sm font-medium">
                                        <span className="flex items-center gap-2">
                                            <Wallet className="h-4 w-4" />
                                            E-Wallet
                                        </span>
                                        <ChevronDown className="h-4 w-4 text-white/70" />
                                    </div>
                                    <p className="mt-2 text-[11px] text-white/70">
                                        {paymentLogos.ewallet.join(' • ')}
                                    </p>
                                </div>

                                <div className="rounded-lg bg-[#6f6986] px-4 py-3">
                                    <div className="flex items-center justify-between text-sm font-medium">
                                        <span className="flex items-center gap-2">
                                            <Landmark className="h-4 w-4" />
                                            Virtual Account
                                        </span>
                                        <ChevronDown className="h-4 w-4 text-white/70" />
                                    </div>
                                    <p className="mt-2 text-[11px] text-white/70">
                                        {paymentLogos.va.join(' • ')}
                                    </p>
                                </div>

                                <div className="rounded-lg bg-[#6f6986] px-4 py-3">
                                    <div className="flex items-center justify-between text-sm font-medium">
                                        <span className="flex items-center gap-2">
                                            <Store className="h-4 w-4" />
                                            Convenience Store
                                        </span>
                                        <ChevronDown className="h-4 w-4 text-white/70" />
                                    </div>
                                    <p className="mt-2 text-[11px] text-white/70">
                                        {paymentLogos.store.join(' • ')}
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="overflow-hidden rounded-xl bg-[#332f3f] shadow-lg">
                            <div className="flex h-11 items-center bg-[#272430]">
                                <div className="flex h-full w-10 items-center justify-center bg-yellow-300 text-sm font-bold text-gray-900">
                                    6
                                </div>
                                <h3 className="px-4 text-sm font-semibold text-white">
                                    Detail Kontak
                                </h3>
                            </div>
                            <div className="space-y-3 p-4 text-white">
                                <div>
                                    <label className="mb-1 block text-xs text-white/80">
                                        No. WhatsApp
                                    </label>
                                    <div className="flex h-10 items-center rounded-md bg-[#5a5668] px-3">
                                        <span className="mr-2 text-sm">🇮🇩</span>
                                        <span className="mr-2 text-sm text-white/80">
                                            +62
                                        </span>
                                        <input
                                            type="tel"
                                            value={phoneNumber}
                                            onChange={(event) =>
                                                setPhoneNumber(
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="89xxxxxx"
                                            className="w-full border-none bg-transparent text-sm text-white outline-none placeholder:text-gray-300"
                                        />
                                    </div>
                                    <p className="mt-2 text-[11px] text-white/60 italic">
                                        Nomor ini akan dihubungi jika terjadi
                                        masalah.
                                    </p>
                                </div>
                                <div className="flex items-start gap-2 rounded-md bg-[#262331] px-3 py-2 text-[11px] text-white/80">
                                    <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                                    Pastikan nomor WhatsApp benar, agar kami
                                    bisa menghubungi jika transaksi bermasalah.
                                </div>
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-2 rounded-md border border-white/20 px-3 py-2 text-xs text-white/85 transition hover:bg-white/10"
                                >
                                    <MessageCircle className="h-3.5 w-3.5" />
                                    Hubungi CS
                                </button>
                            </div>
                        </section>
                    </div>

                    <aside className="space-y-4 rounded-xl bg-[#4d4b59] p-4 shadow-lg">
                        <div className="rounded-xl bg-[#3f3d4b] p-4 text-white">
                            <p className="text-sm font-semibold">
                                Ulasan dan rating
                            </p>
                            <div className="mt-1 flex items-end gap-3">
                                <p className="text-5xl leading-none font-bold">
                                    4.99
                                </p>
                                <div className="mb-1 flex items-center gap-1 text-yellow-300">
                                    {Array.from({ length: 5 }).map(
                                        (_, index) => (
                                            <Star
                                                key={index}
                                                className="h-5 w-5 fill-current"
                                            />
                                        ),
                                    )}
                                </div>
                            </div>
                            <p className="mt-1 text-sm text-white/85">
                                Berdasarkan total 20.55jt rating
                            </p>
                        </div>

                        <div className="rounded-xl bg-[#3f3d4b] p-4 text-white">
                            <div className="flex items-center gap-3">
                                <Headphones className="h-5 w-5 text-white/80" />
                                <div>
                                    <p className="font-semibold">
                                        Butuh Bantuan?
                                    </p>
                                    <p className="text-sm text-white/80">
                                        Kamu bisa hubungi admin disini.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl bg-black p-5 text-center text-white">
                            {selectedPrice !== null ? (
                                <div>
                                    <p className="text-sm text-white/75">
                                        Item dipilih
                                    </p>
                                    <p className="mt-2 font-semibold">
                                        {selectedPrice.display_name}
                                    </p>
                                    <p className="mt-1 text-xs text-white/70">
                                        Jumlah: {quantity}
                                    </p>
                                    <p className="mt-1 text-lg font-bold text-yellow-300">
                                        {formatRupiah(totalPrice)}
                                    </p>
                                </div>
                            ) : (
                                <p>Belum ada item produk yang dipilih.</p>
                            )}
                        </div>

                        <button
                            type="button"
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-yellow-300 py-2.5 font-semibold text-gray-800 transition hover:bg-yellow-200"
                        >
                            <ShoppingBag className="h-4 w-4" />
                            Pesan Sekarang!
                        </button>
                    </aside>
                </div>
            </div>
        </AppLayout>
    );
}
