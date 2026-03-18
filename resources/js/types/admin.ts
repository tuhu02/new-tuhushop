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
    brand_id: number;
    thumbnail: string | null;
    thumbnail_url: string | null;
    is_active: boolean;
    brand: Brand | null;
    categories: CategoryOption[];
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