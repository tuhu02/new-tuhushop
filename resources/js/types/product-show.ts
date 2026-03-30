export type ProductSummary = {
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
