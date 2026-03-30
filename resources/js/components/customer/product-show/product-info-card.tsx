import type { ProductSummary } from '@/types/product-show';

type ProductInfoCardProps = {
    product: ProductSummary;
};

export default function ProductInfoCard({ product }: ProductInfoCardProps) {
    return (
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                {product.banner_url !== null ? (
                    <img
                        src={product.banner_url}
                        alt={product.name}
                        className="h-24 w-full object-cover"
                    />
                ) : (
                    <div className="flex h-24 items-center justify-center bg-slate-900 text-sm font-semibold text-white">
                        {product.name}
                    </div>
                )}
            </div>

            <div className="mt-2.5 flex items-start gap-2.5">
                {product.thumbnail_url !== null ? (
                    <img
                        src={product.thumbnail_url}
                        alt={`${product.name} thumbnail`}
                        className="h-12 w-12 rounded-lg border border-slate-200 object-cover"
                    />
                ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-xs font-semibold text-slate-500">
                        IMG
                    </div>
                )}

                <div className="min-w-0 flex-1">
                    {product.categories.length > 0 && (
                        <div className="mb-1">
                            <span className="inline-flex rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white uppercase">
                                {product.categories[0]}
                            </span>
                        </div>
                    )}
                    <h1 className="truncate text-sm font-bold text-slate-900">
                        {product.name}
                    </h1>
                    {product.brand !== null && (
                        <p className="mt-0.5 text-xs text-slate-500">
                            {product.brand}
                        </p>
                    )}
                    {product.description !== null && (
                        <p className="mt-1 line-clamp-2 text-[11px] text-slate-600">
                            {product.description}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
