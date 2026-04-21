import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Menu, Search } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import AppLogo from '@/components/ui/app-logo';
import AppLogoIcon from '@/components/ui/app-logo-icon';
import { Breadcrumbs } from '@/components/customer/breadcrumbs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { UserMenuContent } from '@/components/customer/user-menu-content';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { useInitials } from '@/hooks/use-initials';
import { cn, toUrl } from '@/lib/utils';
import { dashboard } from '@/routes';
import { show as showProduct } from '@/routes/product';
import type { BreadcrumbItem, NavItem } from '@/types';

type Props = {
    breadcrumbs?: BreadcrumbItem[];
};

type SearchProduct = {
    id: number;
    name: string;
    slug: string;
    thumbnail_url: string | null;
};

const mainNavItems: NavItem[] = [
    {
        title: 'Home',
        href: dashboard(),
    },
];

const activeItemStyles =
    'text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100';

export function AppHeader({ breadcrumbs = [] }: Props) {
    const page = usePage();
    const { auth } = page.props;
    const getInitials = useInitials();
    const { isCurrentUrl, whenCurrentUrl } = useCurrentUrl();
    const searchContainerRef = useRef<HTMLDivElement | null>(null);
    const [searchValue, setSearchValue] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const searchProducts =
        (page.props.headerSearchProducts as SearchProduct[] | undefined) ?? [];
    const normalizedQuery = searchValue.trim().toLowerCase();

    const filteredProducts = useMemo(() => {
        if (normalizedQuery === '') {
            return [];
        }

        return searchProducts
            .filter((product) =>
                product.name.toLowerCase().includes(normalizedQuery),
            )
            .slice(0, 8);
    }, [normalizedQuery, searchProducts]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent): void {
            if (
                searchContainerRef.current !== null &&
                !searchContainerRef.current.contains(event.target as Node)
            ) {
                setIsSearchOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
            <div className="border-b border-sidebar-border/80">
                <div className="mx-auto flex h-16 items-center px-4 md:max-w-7xl">
                    {/* Mobile Menu */}
                    <div className="lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="mr-2 h-8.5 w-8.5"
                                >
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent
                                side="left"
                                className="flex h-full w-64 flex-col items-stretch justify-between bg-sidebar"
                            >
                                <SheetTitle className="sr-only">
                                    Navigation menu
                                </SheetTitle>
                                <SheetHeader className="flex justify-start text-left">
                                    <AppLogoIcon className="h-6 w-6 fill-current text-black dark:text-white" />
                                </SheetHeader>
                                <div className="flex h-full flex-1 flex-col space-y-4 p-4">
                                    <div className="flex h-full flex-col justify-between text-sm">
                                        <div className="flex flex-col space-y-4">
                                            {mainNavItems.map((item) => (
                                                <Link
                                                    key={item.title}
                                                    href={item.href}
                                                    className="flex items-center space-x-2 font-medium"
                                                >
                                                    {item.icon && (
                                                        <item.icon className="h-5 w-5" />
                                                    )}
                                                    <span>{item.title}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <Link
                        href={dashboard()}
                        prefetch
                        className="flex items-center space-x-2"
                    >
                        <AppLogo />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="ml-6 hidden h-full items-center space-x-6 lg:flex">
                        <NavigationMenu className="flex h-full items-stretch">
                            <NavigationMenuList className="flex h-full items-stretch space-x-2">
                                {mainNavItems.map((item, index) => (
                                    <NavigationMenuItem
                                        key={index}
                                        className="relative flex h-full items-center"
                                    >
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                navigationMenuTriggerStyle(),
                                                whenCurrentUrl(
                                                    item.href,
                                                    activeItemStyles,
                                                ),
                                                'h-9 cursor-pointer px-3',
                                            )}
                                        >
                                            {item.icon && (
                                                <item.icon className="mr-2 h-4 w-4" />
                                            )}
                                            {item.title}
                                        </Link>
                                        {isCurrentUrl(item.href) && (
                                            <div className="absolute bottom-0 left-0 h-0.5 w-full translate-y-px bg-black dark:bg-white"></div>
                                        )}
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    <div className="ml-auto flex items-center space-x-2">
                        <div ref={searchContainerRef} className="relative">
                            <div className="hidden items-center md:flex">
                                <div className="relative">
                                    <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-500" />
                                    <input
                                        value={searchValue}
                                        onChange={(event) => {
                                            setSearchValue(event.target.value);
                                            setIsSearchOpen(true);
                                        }}
                                        onFocus={() => setIsSearchOpen(true)}
                                        type="text"
                                        placeholder="Cari produk..."
                                        className="h-10 w-72 rounded-full border border-slate-300 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-slate-500"
                                    />
                                </div>
                            </div>

                            <div className="md:hidden">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsSearchOpen((open) => !open)}
                                    className="group h-9 w-9 cursor-pointer"
                                >
                                    <Search className="size-5! opacity-80 group-hover:opacity-100" />
                                </Button>
                            </div>

                            {isSearchOpen && (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => setIsSearchOpen(false)}
                                        className="fixed inset-0 z-40 bg-black/10 md:hidden"
                                        aria-label="Tutup pencarian"
                                    />

                                    <div className="fixed inset-x-3 top-16 z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl md:absolute md:inset-x-auto md:top-full md:right-auto md:left-0 md:mt-2 md:w-full">
                                        <div className="border-b border-slate-100 p-3 md:hidden">
                                            <div className="relative">
                                                <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-500" />
                                                <input
                                                    value={searchValue}
                                                    onChange={(event) =>
                                                        setSearchValue(
                                                            event.target.value,
                                                        )
                                                    }
                                                    autoFocus
                                                    type="text"
                                                    placeholder="Cari produk..."
                                                    className="h-10 w-full rounded-full border border-slate-300 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-slate-500"
                                                />
                                            </div>
                                        </div>

                                        {normalizedQuery === '' ? (
                                            <p className="px-4 py-4 text-sm text-slate-500">
                                                Ketik nama game atau produk untuk mencari.
                                            </p>
                                        ) : filteredProducts.length > 0 ? (
                                            <div className="max-h-[min(60vh,20rem)] overflow-y-auto py-2 md:max-h-80">
                                                {filteredProducts.map((product) => (
                                                    <Link
                                                        key={product.id}
                                                        href={showProduct(product.slug).url}
                                                        onClick={() => {
                                                            setIsSearchOpen(false);
                                                            setSearchValue('');
                                                        }}
                                                        className="flex items-center gap-3 px-4 py-2.5 transition hover:bg-slate-50"
                                                    >
                                                        {product.thumbnail_url !== null ? (
                                                            <img
                                                                src={
                                                                    product.thumbnail_url
                                                                }
                                                                alt={product.name}
                                                                className="h-12 w-12 rounded-md object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-slate-100 text-xs font-semibold text-slate-500">
                                                                IMG
                                                            </div>
                                                        )}
                                                        <p className="text-sm font-semibold text-slate-800">
                                                            {product.name}
                                                        </p>
                                                    </Link>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="px-4 py-4">
                                                <p className="text-sm text-slate-500">
                                                    Game yang dicari tidak tersedia
                                                </p>
                                                <p className="mt-1 text-sm font-semibold text-blue-700">
                                                    Kasih saran game atau produk
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="size-10 rounded-full p-1"
                                >
                                    <Avatar className="size-8 overflow-hidden rounded-full">
                                        <AvatarImage
                                            src={auth.user.avatar}
                                            alt={auth.user.name}
                                        />
                                        <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                            {getInitials(auth.user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <UserMenuContent user={auth.user} />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
            {breadcrumbs.length > 1 && (
                <div className="flex w-full border-b border-sidebar-border/70">
                    <div className="mx-auto flex h-12 w-full items-center justify-start px-4 text-neutral-500 md:max-w-7xl">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </div>
    );
}
