
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useFinance } from "@/context/FinanceContext";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const MonthlyBarChart = () => {
  const { getMonthlyData } = useFinance();
  const data = getMonthlyData().slice(0, 6).reverse();
  
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
    <div className="w-full h-[350px] bg-finance-card p-4 rounded-lg card-shadow">
      <h3 className="text-lg font-medium mb-4 text-gray-700">Monthly Overview</h3>
      {data.length === 0 ? (
        <div className="h-[270px] flex items-center justify-center text-muted-foreground">
          No data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={270}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value) => `$${value}`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="income" name="Income" fill="#4ade80" />
            <Bar dataKey="expense" name="Expense" fill="#ea384c" />
            <Bar dataKey="savings" name="Savings" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default MonthlyBarChart;
