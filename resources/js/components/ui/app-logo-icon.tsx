import type { ImgHTMLAttributes } from 'react';

type AppLogoIconProps = ImgHTMLAttributes<HTMLImageElement>;

export default function AppLogoIcon(props: AppLogoIconProps) {
    return (
        <img
            {...props}
            src="/images/logo/tuhu-shop.png"
            alt="Tuhu Shop"
            className={`object-contain ${props.className ?? ''}`}
        />
    );
}