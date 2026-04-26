import {
    BottomCheckoutBar,
    NominalSection,
    PaymentSection,
    ProductInfoCard,
    PromoSection,
    QuantitySection,
    SupportAside,
} from '@/components/customer/product-show';
import DataTargetSection from '@/components/customer/product-show/data-target-section';
import AppLayout from '@/layouts/app-layout';
import type {
    BreadcrumbItem,
    PriceByCategory,
    User,
    PaymentMethod,
} from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

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
        input_fields: {
            fields: {
                name: string;
                label: string;
                type?: string;
                required?: boolean;
                placeholder?: string;
            }[];
        } | null;

        instructions: {
            title: string;
            content: string;
        }[];
    };
    pricesByCategory: PriceByCategory[];
    paymentMethods: (PaymentMethod & { logo_url?: string })[];
    user: User | null;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Product Show',
        href: '',
    },
];

export default function ProductShow({
    product,
    pricesByCategory,
    paymentMethods,
}: ProductShowPageProps) {
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
        pricesByCategory[0]?.category.id ?? null,
    );
    const [selectedPriceId, setSelectedPriceId] = useState<number | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [promoCode, setPromoCode] = useState<string>('');
    const [selectedPayment, setSelectedPayment] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');

    const [customerInputs, setCustomerInputs] = useState<
        Record<string, string>
    >({});

    const handleCustomerInputChange = (name: string, value: string) => {
        setCustomerInputs((previousInputs) => ({
            ...previousInputs,
            [name]: value,
        }));
    };

    const selectedCategoryGroup =
        pricesByCategory.find(
            (group) => group.category.id === selectedCategoryId,
        ) ?? pricesByCategory[0];

    const priceItems = selectedCategoryGroup?.prices ?? [];

    useEffect(() => {
        if (
            selectedCategoryId === null &&
            pricesByCategory[0]?.category.id !== undefined
        ) {
            setSelectedCategoryId(pricesByCategory[0].category.id);
        }
    }, [pricesByCategory, selectedCategoryId]);

    useEffect(() => {
        setSelectedPriceId(null);
    }, [selectedCategoryId]);

    const selectedPrice =
        selectedPriceId !== null
            ? (priceItems.find((price) => price.id === selectedPriceId) ?? null)
            : null;

    const selectedChannel = paymentMethods
        .flatMap((method) => method.channels)
        .find((channel) => channel.code === selectedPayment);

    const categoryTitle =
        selectedCategoryGroup?.category.name ?? 'Instant Top Up';

    const basePrice =
        selectedPrice !== null ? selectedPrice.price * quantity : 0;

    const feeFlat = selectedChannel?.fee ?? 0;
    const feePercent = selectedChannel?.fee_percent ?? 0;
    const feePercentAmount = Math.ceil(basePrice * (feePercent / 100));
    const totalPrice = basePrice + feeFlat + feePercentAmount;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={product.name} />

            <div className="px-4 pt-4">
                <div className="mx-auto grid max-w-5xl items-start gap-3 xl:grid-cols-[minmax(260px,300px)_minmax(0,1fr)]">
                    <div className="space-y-3">
                        <ProductInfoCard product={product} />
                        <SupportAside instructions={product.instructions} />
                    </div>

                    <div className="space-y-3">
                        <DataTargetSection
                            fields={product.input_fields?.fields}
                            customerInputs={customerInputs}
                            onChange={handleCustomerInputChange}
                        />
                        <NominalSection
                            categoryTitle={categoryTitle}
                            pricesByCategory={pricesByCategory}
                            selectedCategoryId={selectedCategoryId}
                            onSelectCategory={setSelectedCategoryId}
                            priceItems={priceItems}
                            selectedPriceId={selectedPriceId}
                            onSelectPrice={setSelectedPriceId}
                        />

                        <div
                            className={`space-y-4 ${
                                selectedPrice !== null
                                    ? 'pb-44 sm:pb-40'
                                    : 'pb-8'
                            }`}
                        >
                            <QuantitySection
                                quantity={quantity}
                                onIncrease={() =>
                                    setQuantity((prev) => prev + 1)
                                }
                                onDecrease={() =>
                                    setQuantity((prev) => Math.max(1, prev - 1))
                                }
                            />

                            <PromoSection
                                promoCode={promoCode}
                                onChangePromoCode={setPromoCode}
                            />

                            <PaymentSection
                                paymentMethods={paymentMethods}
                                selectedPayment={selectedPayment}
                                onSelectPayment={setSelectedPayment}
                            />
                            <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
                                <div className="mb-3 flex gap-2 text-sm font-semibold">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-foreground text-accent">
                                        5
                                    </div>
                                    <span>Nomor WhatsApp</span>
                                </div>

                                <input
                                    type="text"
                                    value={phoneNumber}
                                    onChange={(e) =>
                                        setPhoneNumber(e.target.value)
                                    }
                                    placeholder="08xxxxxxxxxx"
                                    className="h-10 w-full rounded-md border px-3"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <BottomCheckoutBar
                selectedPrice={selectedPrice}
                selectedChannel={selectedChannel ?? null}
                quantity={quantity}
                feeFlat={feeFlat}
                feePercent={feePercent}
                feePercentAmount={feePercentAmount}
                totalPrice={totalPrice}
                productId={product.id}
                phoneNumber={phoneNumber}
                customerInputs={customerInputs}
                promoCode={promoCode}
            />
        </AppLayout>
    );
}
