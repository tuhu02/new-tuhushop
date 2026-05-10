import type { ImgHTMLAttributes } from 'react';

type AppLogoIconProps = ImgHTMLAttributes<HTMLImageElement>;

export default function AppLogoIcon(props: AppLogoIconProps) {
    const { className = '', src, alt = 'Tuhu Shop', ...restProps } = props;

    if (src !== undefined) {
        return (
            <img
                {...restProps}
                src={src}
                alt={alt}
                className={`object-contain ${className}`}
            />
        );
    }

    return (
        <>
            <img
                {...restProps}
                src="/images/logo/tuhu-shop.png"
                alt={alt}
                className={`object-contain dark:hidden ${className}`}
            />
            <img
                {...restProps}
                src="/images/logo/tuhu-shop-dark-mode.png"
                alt={alt}
                className={`hidden object-contain dark:block ${className}`}
            />
        </>
    );
}