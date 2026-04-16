export type Brand = {
    id: number;
    name: string;
};

export type Category = {
    id: number;
    name: string;
    slug: string;
    is_active: boolean;
};

export type CategoryOption = Pick<Category, 'id' | 'name'>;

export type Product = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    brand_id: number;
    thumbnail: string | null;
    thumbnail_url: string | null;
    banner: string | null;
    banner_url: string | null;
    is_active: boolean;
    brand: Brand | null;
    categories: CategoryOption[];
};

export type ProductOption = {
    id: number;
    name: string;
};

export type ProductInstruction = {
    id: number;
    product_id: number;
    title: string;
    content: string;
    product: ProductOption | null;
};

export type CustomerUser = {
    id: number;
    name: string;
    email: string;
};

export type Customer = {
    id: number;
    user_id: number;
    name: string;
    phone: string | null;
    address: string | null;
    created_at?: string;
    user: CustomerUser;
};

export type CarouselItem = {
    id: number;
    title: string | null;
    image_path: string;
    image_url: string;
    sort_order: number;
    is_active: boolean;
};

export type PriceListCategory = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    order: number;
    is_active: boolean;
}

export type PaginatedData = {
    data: PriceListCategory[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

// Price List Categories Pages
export type PriceListCategoryIndexProps = {
    categories: PaginatedData;
}

export type PriceListCategoryEditProps = {
    category: PriceListCategory;
}
export type PaymentMethod = {
    id: number;
    name: string;
    code: string;
    logo: string;
    is_active: boolean;
    channels_count?: number;
    channels: PaymentChannel[];
};

export type PaymentMethodOption = Pick<PaymentMethod, 'id' | 'name' | 'code'>;

export type PaymentChannel = {
    id: number;
    payment_method_id: number;
    name: string;
    code: string;
    logo: string;
    logo_url?: string;
    fee: number;
    fee_percent: number;
    min_amount: number | null;
    max_amount: number | null;
    is_active: boolean;
    payment_method?: PaymentMethodOption | null;
};

