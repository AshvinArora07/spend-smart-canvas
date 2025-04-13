
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useFinance } from "@/context/FinanceContext";

const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const ExpensePieChart = () => {
  const { getCategoryTotals } = useFinance();
  const expenseTotals = getCategoryTotals("expense");
  
  const data = Object.entries(expenseTotals).map(([name, value]) => ({
    name,
    value,
  })).sort((a, b) => b.value - a.value);
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded shadow-md border border-gray-200">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-finance-expense">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="w-full h-[300px] bg-finance-card p-4 rounded-lg card-shadow">
      <h3 className="text-lg font-medium mb-4 text-gray-700">Expense Breakdown</h3>
      {data.length === 0 ? (
        <div className="h-[220px] flex items-center justify-center text-muted-foreground">
          No expense data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ExpensePieChart;
