export type * from './auth';
export type * from './admin';
export type * from './navigation';
export type * from './ui';


export type CardProductProps = {
    title: string;
    image: string;
    brand: string;  
    badge: string;
    slug: string;
};


export type Brand = {
    id: number;
    name: string;
}

export type PriceListCategory = {
    id: number;
    name: string;
    slug: string;
}

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

export type Product = {
    id: number;
    name: string;
    slug: string;
    brand: Brand;
}

export type ProductPriceIndexProps = {
    product: Product;
    prices: ProductPrice[];
}