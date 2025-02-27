import React from "react";

interface InformationProps {
  title: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: React.ReactNode;
}

export function Information({ title, value, icon, trend, trendUp }: InformationProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-blue-50 rounded-lg">{icon}</div>
        <div
          className={`text-sm font-medium ${
            trendUp ? "text-green-500" : "text-red-500"
          }`}
        >
          {trend}
        </div>
      </div>
      <h3 className="text-gray-500 font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-yellow-500">{value}</p>
    </div>
  );
}
