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
};

export type ProductPrice = {
    id: number;
    product_id: number;
    price_list_category_id: number;
    display_name: string;
    code: string;
    price: number;
    order: number;
    is_active: boolean;
    category: PriceListCategory;
}

export type ProductPriceIndexProps = {
    product: Product;
    prices: ProductPrice[];
}


export type PriceListCategory = {
    id: number;
    name: string;
    slug: string;
    description: string;
}

export type ProductPriceItem = {
    id: number;
    product_id: number;
    price_list_category_id: number;
    display_name: string;
    code: string;
    price: number;
    category: PriceListCategory;
}

export type PriceByCategory = {
    category: PriceListCategory;
    prices: ProductPriceItem[];
}

export type User = {
    id: number;
    name: string;
    email: string;
}

export type ProductShowProps = {
    product: Product;
    pricesByCategory: PriceByCategory[];
    user: User;
}