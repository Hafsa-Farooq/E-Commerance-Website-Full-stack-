import React from "react";
import Image from "next/image";
import Link from "next/link";

interface DressStyle {
  id: string;
  name: string;
  image: string;
  link: string;
  colSpan: string; // Tailwind column span for asymmetric layout
}

const dressStylesData: DressStyle[] = [
  {
    id: "casual",
    name: "Casual",
    image: "/Home-browser-img1.png",
    link: "/shop?category=casual",
    colSpan: "md:col-span-1",
  },
  {
    id: "formal",
    name: "Formal",
    image: "/Home-browser-img2.png",
    link: "/shop?category=formal",
    colSpan: "md:col-span-2",
  },
  {
    id: "party",
    name: "Party",
    image: "/Home-browser-img3.png",
    link: "/shop?category=party",
    colSpan: "md:col-span-2",
  },
  {
    id: "gym",
    name: "Gym",
    image: "/Home-browser-img4.png",
    link: "/shop?category=gym",
    colSpan: "md:col-span-1",
  },
];

export default function BrowseByStyle() {
  return (
    <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Outer Container with Light Gray Background and Rounded Corners */}
      <div className="bg-[#F0F0F0] rounded-[40px] py-10 px-6 sm:py-16 sm:px-12 lg:px-16">
        {/* Section Heading */}
        <h2 className="text-center text-3xl sm:text-4xl md:text-[48px] font-bold tracking-tight text-black mb-8 sm:mb-14 font-integral uppercase">
          BROWSE BY DRESS STYLE
        </h2>

        {/* Asymmetric Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {dressStylesData.map((style) => (
            <Link
              key={style.id}
              href={style.link}
              className={`relative bg-white rounded-[20px] overflow-hidden h-[190px] sm:h-[289px] block ${style.colSpan}`}
            >
              {/* Style Image */}
              <Image
                src={style.image}
                alt={style.name}
                fill
                className="object-cover md:object-cover object-left sm:object-center"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}