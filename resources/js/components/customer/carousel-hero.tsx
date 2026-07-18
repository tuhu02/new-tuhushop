import { ShieldCheck, CircleDollarSign, Headphones } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type CarouselHeroProps = {
    carousels: Array<{
        id: number;
        title: string | null;
        image_url: string;
        description?: string | null;
    }>;
};

const trustBadges = [
    { icon: ShieldCheck, label: 'Official Supply Assurance' },
    { icon: CircleDollarSign, label: 'Money-Back Guarantee' },
    { icon: Headphones, label: '24/7 Customer Care' },
];

const AUTOPLAY_DELAY = 4000;

export default function CarouselHero({ carousels }: CarouselHeroProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const goTo = (index: number) => {
        setActiveIndex(index);

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        intervalRef.current = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % carousels.length);
        }, AUTOPLAY_DELAY);
    };

    useEffect(() => {
        if (carousels.length <= 1) {
            return;
        }

        intervalRef.current = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % carousels.length);
        }, AUTOPLAY_DELAY);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [carousels.length]);

    if (carousels.length === 0) {
        return null;
    }

    const active = carousels[activeIndex];

    const prevIndex = (activeIndex - 1 + carousels.length) % carousels.length;
    const nextIndex = (activeIndex + 1) % carousels.length;

    const thumbnails =
        carousels.length === 1
            ? [null, carousels[0], null]
            : carousels.length === 2
              ? [carousels[prevIndex], carousels[activeIndex], null]
              : [
                    carousels[prevIndex],
                    carousels[activeIndex],
                    carousels[nextIndex],
                ];

    return (
        <section className="relative py-8">
            <div className="relative mx-auto w-full max-w-[1345px] px-4 md:px-8 lg:px-14">
                <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
                    {/* Main banner */}
                    <div className="relative min-h-[260px] overflow-hidden rounded-xl bg-[#050532] md:min-h-[330px] lg:min-h-[360px]">
                        <img
                            key={active.id}
                            src={active.image_url}
                            alt=""
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                    </div>

                    {/* Right thumbnails */}
                    {carousels.length > 1 && (
                        <div className="hidden grid-rows-3 gap-3 lg:grid">
                            {thumbnails.map((item, i) => {
                                const isActive = i === 1;

                                const slideIndex =
                                    i === 0
                                        ? prevIndex
                                        : i === 1
                                          ? activeIndex
                                          : nextIndex;

                                if (!item) {
                                    return (
                                        <div
                                            key={`ghost-${i}`}
                                            className="flex items-center gap-4 rounded-lg bg-slate-100 px-3 py-3 dark:bg-slate-800/70"
                                        >
                                            <div className="h-[60px] w-[60px] shrink-0 rounded-lg bg-slate-200 dark:bg-slate-700" />
                                            <div className="min-w-0 flex-1 space-y-2">
                                                <div className="h-3 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
                                                <div className="h-2.5 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />
                                            </div>
                                        </div>
                                    );
                                }

                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => goTo(slideIndex)}
                                        className={cn(
                                            'flex items-center gap-4 rounded-lg border px-3 py-3 text-left transition',
                                            isActive
                                                ? 'border-[#ff3d5f] bg-white shadow-sm dark:bg-slate-900'
                                                : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800',
                                        )}
                                    >
                                        <div className="h-[60px] w-[60px] shrink-0 overflow-hidden rounded-lg">
                                            <img
                                                src={item.image_url}
                                                alt={
                                                    item.title ??
                                                    'carousel thumbnail'
                                                }
                                                className="h-full w-full object-cover"
                                            />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                                                {item.title ?? 'Promo'}
                                            </p>
                                            {item.description ? (
                                                <p className="mt-1 line-clamp-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                                                    {item.description}
                                                </p>
                                            ) : null}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Trust badges */}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
                    {trustBadges.map((badge) => {
                        const Icon = badge.icon;

                        return (
                            <div
                                key={badge.label}
                                className="flex items-center gap-3 text-slate-700 dark:text-slate-200"
                            >
                                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-500/20">
                                    <Icon className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                                </span>
                                <span className="text-sm font-medium md:text-base">
                                    {badge.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
