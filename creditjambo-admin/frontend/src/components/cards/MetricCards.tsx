import React from "react";

type MetricCardProps = {
  title: string;
  value: number;
  icon: React.ReactNode;
};
export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
}) => {
  return (
    <div className="flex items-center justify-between bg-white dark:bg-gray-800 shadow-lg rounded-xl p-5 border border-gray-100 dark:border-gray-700 transition duration-300 hover:shadow-2xl hover:translate-y-[-2px]">
      {/* Text Content: Title and Value */}
      <div>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider">
          {title}
        </p>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
          {value}
        </h3>
      </div>

      {/* Icon Element */}
      <div className="flex-shrink-0 w-8 h-8">
        {/* The icon is rendered directly from the 'icon' prop */}
        {icon}
      </div>
    </div>
  );
};
