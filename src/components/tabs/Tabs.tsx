// components/ui/Tabs.tsx
import React from "react";

interface TabsProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange, className }) => {
  return (
    <div
  className={`w-full overflow-x-auto no-scrollbar whitespace-nowrap gap-[1.5vw] border-b border-b-[#d8d8d8] ${className || ""}`}
>
  <div className="flex w-max gap-[20px] md:gap-[1.5vw]">
    {tabs.map((tab) => (
      <button
        key={tab}
        onClick={() => onTabChange(tab)}
        className={`flex-shrink-0 text-nowrap text-sm text-[1rem] pb-[1rem] border-b-4 transition-all duration-300 cursor-pointer ${
          activeTab === tab
            ? "border-primary text-primary"
            : "border-transparent text-lightGrey"
        }`}
      >
        {tab}
      </button>
    ))}
  </div>
</div>

  );
};

export default Tabs;
