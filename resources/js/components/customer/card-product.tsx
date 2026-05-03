import { CardProductProps } from '@/types';
import { Link } from '@inertiajs/react';
import { show } from '@/routes/product';

export default function CardProduct({
    title,
    brand,
    image,
    slug,
    variant = 'default',
}: CardProductProps) {
    return (
        <Link
            href={show(slug).url}
            className="group block h-full text-decoration-none"
        >
            <div
                className={`flex h-full flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md dark:bg-slate-900 ${
                    variant === 'popular'
                        ? 'border-blue-200'
                        : 'border-slate-200 dark:border-slate-800'
                }`}
            >
                <div className="p-3">
                    <div className="aspect-square overflow-hidden rounded-lg bg-slate-50 dark:bg-slate-800">
                        <img
                            src={image}
                            alt={title}
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                            loading="lazy"
                        />
                    </div>
                </div>

                <div className="flex flex-1 flex-col justify-center px-3 pb-5 pt-1 text-center">
                    {variant === 'popular' && (
                        <div className="mb-2 flex justify-center">
                            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-600 dark:bg-blue-950 dark:text-blue-300">
                                🔥 Populer
                            </span>
                        </div>
                    )}

                    <h3 className="line-clamp-2 text-sm font-extrabold leading-snug text-slate-950 dark:text-white">
                        {title}
                    </h3>

                    {brand && (
                        <p className="mt-1 line-clamp-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                            {brand}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
}