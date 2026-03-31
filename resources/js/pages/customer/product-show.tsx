import {
    BottomCheckoutBar,
    ContactSection,
    NominalSection,
    PaymentSection,
    ProductInfoCard,
    PromoSection,
    QuantitySection,
    SupportAside,
} from '@/components/customer/product-show';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, PriceByCategory, User } from '@/types';
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
        instructions: {
            title: string;
            content: string;
        }[];
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

export default function ProductShow({
    product,
    pricesByCategory,
}: ProductShowPageProps) {
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
        pricesByCategory[0]?.category.id ?? null,
    );
    const [selectedPriceId, setSelectedPriceId] = useState<number | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [promoCode, setPromoCode] = useState<string>('');
    const [selectedPayment, setSelectedPayment] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');

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

    const categoryTitle =
        selectedCategoryGroup?.category.name ?? 'Instant Top Up';
    const totalPrice =
        selectedPrice !== null ? selectedPrice.price * quantity : 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={product.name} />

            <div className="px-4 pt-4">
                <div className="mx-auto grid max-w-5xl gap-3 xl:grid-cols-[minmax(260px,300px)_minmax(0,1fr)]">
                    <ProductInfoCard product={product} />
                    <NominalSection
                        categoryTitle={categoryTitle}
                        pricesByCategory={pricesByCategory}
                        selectedCategoryId={selectedCategoryId}
                        onSelectCategory={setSelectedCategoryId}
                        priceItems={priceItems}
                        selectedPriceId={selectedPriceId}
                        onSelectPrice={setSelectedPriceId}
                    />
                </div>
            </div>

            <div
                className={`mt-5 px-4 ${selectedPrice !== null ? 'pb-28' : 'pb-8'}`}
            >
                <div className="mx-auto grid max-w-5xl gap-3 xl:grid-cols-[minmax(260px,300px)_minmax(0,1fr)]">
                    <SupportAside instructions={product.instructions} />

                    <div className="space-y-4">
                        <QuantitySection
                            quantity={quantity}
                            onIncrease={() => setQuantity((prev) => prev + 1)}
                            onDecrease={() =>
                                setQuantity((prev) => Math.max(1, prev - 1))
                            }
                        />
                        <PromoSection
                            promoCode={promoCode}
                            onChangePromoCode={setPromoCode}
                        />
                        <PaymentSection
                            selectedPayment={selectedPayment}
                            onSelectPayment={setSelectedPayment}
                        />
                        <ContactSection
                            phoneNumber={phoneNumber}
                            onChangePhoneNumber={setPhoneNumber}
                        />
                    </div>
                </div>
            </div>

            <BottomCheckoutBar
                selectedPrice={selectedPrice}
                quantity={quantity}
                totalPrice={totalPrice}
            />
        </AppLayout>
    );
}
