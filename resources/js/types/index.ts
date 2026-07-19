export type * from './auth';
export type * from './admin';
export type * from './navigation';
export type * from './ui';
import type { Product } from './admin';

export type CardProductProps = {
    title: string;
    image: string;
    brand: string;
    badge: string;
    slug: string;
    variant?: 'default' | 'popular';
};

export type IconData = {
    id: number;
    name: string;
    file_path: string;
};

export type ProductPrice = {
    id: number;
    product_id: number;
    price_list_category_id: number;
    icon_id?: number | null;
    display_name: string;
    code: string;
    price: number;
    order: number;
    is_active: boolean;
    category: PriceListCategory;
    icon?: IconData | null;
};

export type CursorPaginator<T> = {
    data: T[];
    next_page_url: string | null;
    prev_page_url: string | null;
    path: string;
    per_page: number;
    next_cursor: string | null;
    prev_cursor: string | null;
};

export type ProductPriceIndexProps = {
    product: Product;
    prices: CursorPaginator<ProductPrice>;
    categories: PriceListCategory[];
};

export type PriceListCategory = {
    id: number;
    name: string;
    slug: string;
    description: string;
};

export type ProductPriceItem = {
    id: number;
    product_id: number;
    price_list_category_id: number;
    icon_id?: number | null;
    display_name: string;
    code: string;
    price: number;
    category: PriceListCategory;
    icon?: IconData | null;
};

export type PriceByCategory = {
    category: PriceListCategory;
    prices: ProductPriceItem[];
};

export type User = {
    id: number;
    name: string;
    email: string;
    avatar?: string;
};

export type ProductShowProps = {
    product: Product;
    pricesByCategory: PriceByCategory[];
    user: User;
};
