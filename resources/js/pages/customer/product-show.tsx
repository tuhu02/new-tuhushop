import { Head } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';

interface Brand {
    id: number;
    name: string;
}

interface PriceListCategory {
    id: number;
    name: string;
    slug: string;
    description: string;
}

interface ProductPriceItem {
    id: number;
    product_id: number;
    price_list_category_id: number;
    display_name: string;
    code: string;
    price: number;
    category: PriceListCategory;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    thumbnail: string;
    brand: Brand;
}

interface PriceByCategory {
    category: PriceListCategory;
    prices: ProductPriceItem[];
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface ProductShowProps {
    product: Product;
    pricesByCategory: PriceByCategory[];
    user: User;
}

export default function ProductShow({
    product,
    pricesByCategory,
    user,
}: ProductShowProps) {
    const [selectedCategory, setSelectedCategory] = useState<number | null>(
        pricesByCategory.length > 0 ? pricesByCategory[0].category.id : null,
    );
    const [selectedPrice, setSelectedPrice] = useState<ProductPriceItem | null>(
        pricesByCategory.length > 0 && pricesByCategory[0].prices.length > 0
            ? pricesByCategory[0].prices[0]
            : null,
    );

    const [accountDetails, setAccountDetails] = useState({
        accountId: '',
        accountType: 'phone',
        details: '',
    });

    const [paymentDetails, setPaymentDetails] = useState({
        email: user?.email || '',
        promoCode: '',
    });

    const handleAccountDetailChange = (field: string, value: string) => {
        setAccountDetails((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handlePaymentChange = (field: string, value: string) => {
        setPaymentDetails((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleCategoryChange = (categoryId: number) => {
        setSelectedCategory(categoryId);
        const category = pricesByCategory.find(
            (c) => c.category.id === categoryId,
        );
        if (category && category.prices.length > 0) {
            setSelectedPrice(category.prices[0]);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log({
            product: product.id,
            selectedPrice,
            accountDetails,
            paymentDetails,
        });
    };

    const currentCategory = pricesByCategory.find(
        (c) => c.category.id === selectedCategory,
    );
    const currentCategoryPrices = currentCategory?.prices || [];

    const selectedPriceValue = selectedPrice?.price ?? 0;
    const promoDiscount = 0;
    const total = selectedPriceValue - promoDiscount;

    const hasNoPrices =
        pricesByCategory.length === 0 || currentCategoryPrices.length === 0;

    return (
        <AppLayout>
            <Head title={product.name} />

            <div className="space-y-8 py-8">
                {/* Product Header */}
                <div className="space-y-6">
                    {/* Product Image and Info */}
                    <div className="grid gap-8 lg:grid-cols-3">
                        <div className="lg:col-span-1">
                            <div className="space-y-4">
                                <img
                                    src={product.thumbnail}
                                    alt={product.name}
                                    className="h-80 w-full rounded-lg object-cover"
                                />
                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">
                                        {product.brand?.name}
                                    </p>
                                    <h1 className="text-3xl font-bold">
                                        {product.name}
                                    </h1>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="lg:col-span-2">
                            {product.description && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">
                                            Deskripsi Produk
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm leading-relaxed text-muted-foreground">
                                            {product.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>

                    {/* Price List Categories and Items */}
                    <div className="space-y-4">
                        {/* Category Tabs */}
                        {pricesByCategory.length > 0 && (
                            <div className="space-y-3">
                                <h2 className="text-xl font-bold">
                                    Pilih Nominal
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {pricesByCategory.map((categoryGroup) => (
                                        <Button
                                            key={categoryGroup.category.id}
                                            onClick={() =>
                                                handleCategoryChange(
                                                    categoryGroup.category.id,
                                                )
                                            }
                                            variant={
                                                selectedCategory ===
                                                categoryGroup.category.id
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            className="rounded-full"
                                        >
                                            {categoryGroup.category.name}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Price Items Grid */}
                        {currentCategoryPrices.length > 0 ? (
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                                {currentCategoryPrices.map((priceItem) => (
                                    <Card
                                        key={priceItem.id}
                                        className={`cursor-pointer transition-all ${
                                            selectedPrice?.id === priceItem.id
                                                ? 'border-primary ring-2 ring-primary'
                                                : 'hover:border-primary'
                                        }`}
                                        onClick={() =>
                                            setSelectedPrice(priceItem)
                                        }
                                    >
                                        <CardContent className="space-y-2 p-4 text-center">
                                            <div className="text-sm font-bold">
                                                {priceItem.display_name}
                                            </div>
                                            <div className="inline-block rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
                                                {priceItem.code}
                                            </div>
                                            <div className="text-lg font-bold text-green-600">
                                                Rp{' '}
                                                {priceItem.price.toLocaleString(
                                                    'id-ID',
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Card className="border-2 border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950">
                                <CardContent className="p-6">
                                    <p className="text-sm text-orange-700 dark:text-orange-300">
                                        Belum ada nominal untuk kategori ini
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Order Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Account Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Detail Akun Tujuan
                            </CardTitle>
                            <CardDescription>
                                Isi sesuai dengan data akun yang akan Anda
                                charge
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="accountType">Tipe Data</Label>
                                <select
                                    id="accountType"
                                    value={accountDetails.accountType}
                                    onChange={(e) =>
                                        handleAccountDetailChange(
                                            'accountType',
                                            e.target.value,
                                        )
                                    }
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="phone">Nomor Telepon</option>
                                    <option value="email">Email</option>
                                    <option value="username">Username</option>
                                    <option value="token">Nomor Token</option>
                                    <option value="serverid">ID Server</option>
                                    <option value="other">Lainnya</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="accountId">Nomor/ID Akun</Label>
                                <Input
                                    id="accountId"
                                    placeholder="Masukkan nomor atau ID akun Anda"
                                    value={accountDetails.accountId}
                                    onChange={(e) =>
                                        handleAccountDetailChange(
                                            'accountId',
                                            e.target.value,
                                        )
                                    }
                                    required
                                    disabled={hasNoPrices}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="details">
                                    Informasi Tambahan (Opsional)
                                </Label>
                                <Textarea
                                    id="details"
                                    placeholder="Misalnya: PIN, kata sandi, atau keterangan lainnya"
                                    value={accountDetails.details}
                                    onChange={(e) =>
                                        handleAccountDetailChange(
                                            'details',
                                            e.target.value,
                                        )
                                    }
                                    className="resize-none"
                                    rows={3}
                                    disabled={hasNoPrices}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Detail Pembayaran & Invoice
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">
                                    Email untuk Invoice
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={paymentDetails.email}
                                    onChange={(e) =>
                                        handlePaymentChange(
                                            'email',
                                            e.target.value,
                                        )
                                    }
                                    required
                                    disabled={hasNoPrices}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Invoice akan dikirim ke email ini
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="promoCode">
                                    Kode Promo{' '}
                                    <span className="text-xs text-muted-foreground">
                                        (Opsional)
                                    </span>
                                </Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="promoCode"
                                        placeholder="Masukkan kode promo Anda"
                                        value={paymentDetails.promoCode}
                                        onChange={(e) =>
                                            handlePaymentChange(
                                                'promoCode',
                                                e.target.value,
                                            )
                                        }
                                        disabled={hasNoPrices}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        disabled={hasNoPrices}
                                    >
                                        Cek
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Order Summary */}
                    {!hasNoPrices ? (
                        <Card className="border-2 border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Ringkasan Pesanan
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span>Nominal:</span>
                                    <span>{selectedPrice?.display_name}</span>
                                </div>
                                {selectedPrice?.code && (
                                    <div className="flex justify-between text-sm">
                                        <span>Kode:</span>
                                        <span className="rounded bg-white px-2 py-1 font-mono font-bold dark:bg-slate-800">
                                            {selectedPrice.code}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm">
                                    <span>Harga:</span>
                                    <span>
                                        Rp{' '}
                                        {selectedPriceValue.toLocaleString(
                                            'id-ID',
                                        )}
                                    </span>
                                </div>
                                {promoDiscount > 0 && (
                                    <div className="flex justify-between text-sm text-green-600">
                                        <span>Diskon:</span>
                                        <span>
                                            - Rp{' '}
                                            {promoDiscount.toLocaleString(
                                                'id-ID',
                                            )}
                                        </span>
                                    </div>
                                )}
                                <div className="border-t pt-3">
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total:</span>
                                        <span>
                                            Rp {total.toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="border-2 border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950">
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Informasi Harga
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-orange-700 dark:text-orange-300">
                                    Belum ada nominal untuk produk ini. Silakan
                                    hubungi admin untuk informasi lebih lanjut.
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        size="lg"
                        className="w-full"
                        disabled={hasNoPrices || !selectedPrice}
                    >
                        {hasNoPrices
                            ? 'Hubungi Admin untuk Nominal'
                            : 'Lanjutkan ke Pembayaran'}
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
