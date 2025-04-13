
import { useFinance, TransactionType } from "@/context/FinanceContext";
import { TrendData } from "./transaction/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

interface TrendComparisonChartProps {
  months?: number;
}

const TrendComparisonChart = ({ months = 3 }: TrendComparisonChartProps) => {
  const { getMonthlyData, getTrendData } = useFinance();
  
  const monthlyData = getMonthlyData().slice(-6); // Get last 6 months of data
  
  // Get trend data for each transaction type
  const incomeTrend: TrendData = getTrendData("income", months);
  const expenseTrend: TrendData = getTrendData("expense", months);
  const savingsTrend: TrendData = getTrendData("savings", months);
  
  // Format data for the chart
  const chartData = monthlyData.map(item => ({
    month: item.month,
    Income: item.income,
    Expense: item.expense,
    Savings: item.savings
  }));
  
  const renderTrendIndicator = (trend: TrendData, positiveIsGood: boolean) => {
    if (trend.previousTotal === 0 && trend.currentTotal === 0) {
      return <Minus className="h-4 w-4 text-gray-400" />;
    }
    
    const isPositive = trend.isIncrease;
    const isGood = (isPositive && positiveIsGood) || (!isPositive && !positiveIsGood);
    const color = isGood ? "text-green-500" : "text-red-500";
    const Icon = isPositive ? ArrowUpRight : ArrowDownRight;
    
    return (
      <div className={`flex items-center ${color}`}>
        <Icon className="h-4 w-4 mr-1" />
        <span>{trend.percentageChange}%</span>
      </div>
    );
  };
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded shadow-md border border-gray-200">
          <p className="font-medium mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Financial Trends Comparison</CardTitle>
        <CardDescription>
          Last {months} month{months > 1 ? 's' : ''} trends for income, expenses and savings
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-2">
        {/* Trend summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium text-gray-700">Income</h4>
              {renderTrendIndicator(incomeTrend, true)}
            </div>
            <p className="text-lg font-semibold mt-1">{formatCurrency(incomeTrend.currentTotal)}</p>
            <p className="text-xs text-muted-foreground">vs {formatCurrency(incomeTrend.previousTotal)}</p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium text-gray-700">Expenses</h4>
              {renderTrendIndicator(expenseTrend, false)}
            </div>
            <p className="text-lg font-semibold mt-1">{formatCurrency(expenseTrend.currentTotal)}</p>
            <p className="text-xs text-muted-foreground">vs {formatCurrency(expenseTrend.previousTotal)}</p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium text-gray-700">Savings</h4>
              {renderTrendIndicator(savingsTrend, true)}
            </div>
            <p className="text-lg font-semibold mt-1">{formatCurrency(savingsTrend.currentTotal)}</p>
            <p className="text-xs text-muted-foreground">vs {formatCurrency(savingsTrend.previousTotal)}</p>
          </div>
        </div>
        
        {/* Chart */}
        <div className="h-[250px] w-full">
          {chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No historical data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `$${value}`} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="Income" stroke="#4ade80" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Expense" stroke="#ea384c" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Savings" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendComparisonChart;
