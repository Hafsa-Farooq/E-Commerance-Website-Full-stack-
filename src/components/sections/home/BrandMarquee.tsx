import React from "react";
import Image from "next/image";

interface Brand {
  id: string;
  name: string;
  logo: string;
  width: number;
  height: number;
}

const brands: Brand[] = [
  {
    id: "versace",
    name: "Versace",
    logo: "/Home-hero-brand1.png",
    width: 166,
    height: 33,
  },
  {
    id: "zara",
    name: "Zara",
    logo: "/Home-hero-brand2.png",
    width: 91,
    height: 38,
  },
  {
    id: "gucci",
    name: "Gucci",
    logo: "/Home-hero-brand3.png",
    width: 156,
    height: 36,
  },
  {
    id: "prada",
    name: "Prada",
    logo: "/Home-hero-brand4.png",
    width: 194,
    height: 32,
  },
  {
    id: "calvin-klein",
    name: "Calvin Klein",
    logo: "/Home-hero-brand5.png",
    width: 206,
    height: 33,
  },
];

export default function BrandMarquee() {
  return (
    <section className="bg-black py-9 sm:py-11">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-around lg:justify-between gap-6 sm:gap-8 md:gap-10">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="flex items-center justify-center relative h-8 sm:h-10 transition-opacity hover:opacity-80"
            >
              <Image
                src={brand.logo}
                alt={`${brand.name} logo`}
                width={brand.width}
                height={brand.height}
                className="max-h-6 sm:max-h-8 md:max-h-10 w-auto object-contain brightness-0 invert"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}