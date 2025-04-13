
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  trend?: { value: number; label: string };
  className?: string;
}

const DashboardCard = ({ title, value, icon, trend, className }: DashboardCardProps) => {
  return (
    <div className={cn("bg-finance-card p-6 rounded-lg card-shadow", className)}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-medium text-gray-700">{title}</h3>
        <span className="text-gray-500">{icon}</span>
      </div>
      
      <div className="flex items-end">
        <p className="text-2xl font-bold">{value}</p>
        
        {trend && (
          <div className={cn(
            "ml-2 text-sm flex items-center", 
            trend.value >= 0 ? "text-green-500" : "text-red-500"
          )}>
            <span>
              {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}%
            </span>
            <span className="text-gray-500 ml-1">vs {trend.label}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardCard;
