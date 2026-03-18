import { CardProductProps } from "@/types";

export default function CardProduct({ title, brand, image }: CardProductProps) {
  return (
    <div className="relative w-48 h-64 rounded-2xl overflow-hidden cursor-pointer group flex-shrink-0">

      {/* Background image dengan zoom on hover */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[600ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.08]"
        style={{ backgroundImage: `url(${image})` }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/85" />

      {/* Shine */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent pointer-events-none" />

      {/* Border halus */}
      <div className="absolute inset-0 rounded-2xl border border-white/15 pointer-events-none z-10" />

      {/* Content — muncul saat hover */}
      <div className="absolute bottom-0 left-0 right-0 p-3.5 z-10 translate-y-1.5 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
        <p className="text-[9.5px] font-medium tracking-[0.12em] uppercase text-white/55 mb-1">
          {brand}
        </p>
        <p className="font-serif text-[15px] font-medium text-white leading-tight">
          {title}
        </p>
        {/* Divider melebar saat hover */}
        <div className="w-5 h-px bg-white/35 mt-2 transition-all duration-[400ms] delay-100 group-hover:w-9" />
      </div>

    </div>
  );
}