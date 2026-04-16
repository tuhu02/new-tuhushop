import { CardProductProps } from '@/types';
import { Link } from '@inertiajs/react';
import { show } from '@/routes/product';

export default function CardProduct({
    title,
    brand,
    image,
    slug,
}: CardProductProps) {
    return (
        <Link
            href={show(slug).url}
            className="text-decoration-none group relative block aspect-3/4 w-full cursor-pointer overflow-hidden rounded-3xl"
        >
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[600ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.08]"
                style={{ backgroundImage: `url(${image})` }}
            />
            <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/70" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent" />
            <div className="pointer-events-none absolute inset-0 z-10 rounded-2xl border border-white/15" />
            <div className="absolute right-0 bottom-0 left-0 z-10 translate-y-1.5 p-3.5 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                <p className="mb-1 text-[9.5px] font-semibold tracking-[0.12em] text-white uppercase">
                    {brand}
                </p>
                <p className="text-[15px] leading-tight font-bold text-white">
                    {title}
                </p>
                <div className="mt-2 h-px w-5 bg-white/35 transition-all delay-100 duration-[400ms] group-hover:w-9" />
            </div>
        </Link>
    );
}
