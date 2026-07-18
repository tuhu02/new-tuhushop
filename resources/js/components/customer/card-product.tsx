import { Link } from '@inertiajs/react';
import { show } from '@/routes/product';
import type { CardProductProps } from '@/types';

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
            className="group text-decoration-none block h-full"
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

                <div className="flex flex-1 flex-col justify-center px-3 pt-1 pb-5 text-center">
                    <h3 className="line-clamp-2 text-sm leading-snug font-extrabold text-slate-950 dark:text-white">
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
