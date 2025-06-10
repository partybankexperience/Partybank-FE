
import React from 'react';

// Event Card Skeleton
export const EventCardSkeleton = () => {
  return (
    <div className="relative rounded-[9px] border border-[#E1E1E1] h-[347px] min-w-[180px] w-full animate-pulse">
      {/* Image skeleton */}
      <div className="h-[150px] rounded-t-[9px] w-full bg-gray-200"></div>
      
      {/* Content skeleton */}
      <div className="grid">
        <div className="p-[15px] border-b border-[#E1E1E1] grid gap-[12px]">
          <div className="grid gap-[5px]">
            {/* Date and time skeleton */}
            <div className="h-3 bg-gray-200 rounded w-32"></div>
            {/* Event name skeleton */}
            <div className="h-5 bg-gray-200 rounded w-full"></div>
          </div>
          {/* Location skeleton */}
          <div className="flex items-center gap-[6px]">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
        
        {/* Progress section skeleton */}
        <div className="grid gap-[10px] p-[15px]">
          {/* Progress bar skeleton */}
          <div className="w-full h-[8px] bg-gray-200 rounded-full"></div>
          
          {/* Stats skeleton */}
          <div className="flex justify-between items-start">
            <div className="grid gap-1">
              <div className="h-3 bg-gray-200 rounded w-16"></div>
              <div className="h-4 bg-gray-200 rounded w-12"></div>
            </div>
            <div className="grid gap-1">
              <div className="h-3 bg-gray-200 rounded w-16"></div>
              <div className="h-4 bg-gray-200 rounded w-12"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Series Card Skeleton
export const SeriesCardSkeleton = () => {
  return (
    <div className="relative rounded-[9px] border border-[#E1E1E1] h-[280px] min-w-[180px] w-full animate-pulse">
      {/* Image skeleton */}
      <div className="h-[150px] rounded-t-[9px] w-full bg-gray-200"></div>
      
      {/* Content skeleton */}
      <div className="p-[15px] grid gap-[12px]">
        {/* Title skeleton */}
        <div className="h-5 bg-gray-200 rounded w-full"></div>
        {/* Description skeleton */}
        <div className="grid gap-2">
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    </div>
  );
};

// Dashboard Card Skeleton (for the stats cards)
export const DashboardCardSkeleton = () => {
  return (
    <div className="bg-gray-200 rounded-[15px] p-[.5rem] h-20 animate-pulse">
      <div className="flex items-center gap-[.5rem]">
        <div className="rounded-md w-12 h-12 bg-gray-300"></div>
        <div className="grid gap-2">
          <div className="h-4 bg-gray-300 rounded w-16"></div>
          <div className="h-3 bg-gray-300 rounded w-20"></div>
        </div>
      </div>
    </div>
  );
};

// Grid skeleton for multiple cards
export const CardGridSkeleton = ({ 
  count = 4, 
  CardComponent = EventCardSkeleton,
  gridCols = "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
}: {
  count?: number;
  CardComponent?: React.ComponentType;
  gridCols?: string;
}) => {
  return (
    <div className={`grid ${gridCols} gap-[20px]`}>
      {Array.from({ length: count }).map((_, index) => (
        <CardComponent key={index} />
      ))}
    </div>
  );
};
