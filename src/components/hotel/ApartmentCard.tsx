"use client";

import type { HotelListing } from "@/@types/hotel";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { AiOutlineHeart } from "react-icons/ai";
import { FaFireAlt } from "react-icons/fa";
import AmenityIcons from "./AmenityIcons";
import { formatListingPrice } from "./formatListingPrice";

interface ApartmentCardProps {
  apartment: HotelListing;
  onClick?: () => void;
}

export default function ApartmentCard({
  apartment,
  onClick,
}: ApartmentCardProps) {
  return (
    <div
      onClick={onClick}
      className="group w-full overflow-hidden rounded-[16px] border border-gray-200 bg-white text-left transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] dark:border-slate-700 dark:bg-slate-800"
    >
      <div className="relative">
        <Image
          src={apartment.images[0]}
          alt={apartment.name}
          width={420}
          height={280}
          className="h-[170px] w-full object-cover"
        />
        {apartment.promoted ? (
          <span className="absolute bottom-0 left-0 inline-flex items-center gap-1 rounded-tr-[10px] bg-orange-500 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.02em] text-white">
            <FaFireAlt className="h-3.5 w-3.5" />
            Promoted
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-end gap-2">
            <span className="text-[30px] font-semibold leading-none text-green-600 dark:text-green-400">
              {formatListingPrice(apartment.price)}
            </span>
            <span className="pb-1 text-xs text-gray-500 dark:text-gray-400">Per month</span>
          </div>
          <AiOutlineHeart
            className={cn(
              "h-5 w-5",
              apartment.favorite
                ? 'fill-red-500 text-red-500'
                : 'text-red-500 dark:text-red-500',
            )}
          />
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            {apartment.name}
          </h3>
          <p className="line-clamp-1 text-xs text-gray-500 dark:text-gray-400">
            {apartment.address}
          </p>
        </div>

        {/* Fixed-height amenities zone keeps Book button aligned across all cards */}
        <div className="mt-3 min-h-[56px]">
          <AmenityIcons
            bedrooms={apartment.bedrooms}
            bathrooms={apartment.bathrooms}
            petFriendly={apartment.petFriendly}
            compact
          />
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="mt-auto w-full rounded-lg bg-orange-500 py-2 px-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-orange-600"
        >
          Book
        </button>
      </div>
    </div>
  );
}

