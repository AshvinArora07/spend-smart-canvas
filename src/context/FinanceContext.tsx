
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { toast } from "sonner";
import { SortOptions } from "@/components/transaction/types";

export type TransactionType = "income" | "expense" | "savings";

export type Transaction = {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  category: string;
  date: string;
};

export type CategoryTotals = {
  [key: string]: number;
};

type FinanceContextType = {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  deleteTransaction: (id: string) => void;
  getTotal: (type: TransactionType) => number;
  getCategoryTotals: (type: TransactionType) => CategoryTotals;
  getMonthlyData: () => { month: string; income: number; expense: number; savings: number }[];
  isLoading: boolean;
  sortTransactions: (sortOptions: SortOptions) => Transaction[];
  getTrendData: (type: TransactionType, months: number) => { 
    percentageChange: number; 
    isIncrease: boolean;
    previousTotal: number;
    currentTotal: number;
  };
};

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const CATEGORIES = {
  income: ["Salary", "Freelance", "Investments", "Gift", "Other"],
  expense: ["Food", "Housing", "Transportation", "Entertainment", "Healthcare", "Shopping", "Utilities", "Other"],
  savings: ["Emergency Fund", "Retirement", "Investment", "Goal Saving", "Other"]
};

export const FinanceProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load initial data
  useEffect(() => {
    setIsLoading(true);
    
    // Check if we have stored transactions
    const storedTransactions = localStorage.getItem("financeTransactions");
    
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    } else {
      // Initialize with empty array
      setTransactions([]);
      localStorage.setItem("financeTransactions", JSON.stringify([]));
    }
    
    setIsLoading(false);
  }, []);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("financeTransactions", JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction = {
      ...transaction,
      id: crypto.randomUUID()
    };
    
    setTransactions(prev => [...prev, newTransaction]);
    toast.success("Transaction added successfully!");
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
    toast.success("Transaction deleted!");
  };

  const getTotal = (type: TransactionType) => {
    return transactions
      .filter(transaction => transaction.type === type)
      .reduce((sum, transaction) => sum + transaction.amount, 0);
  };

  const getCategoryTotals = (type: TransactionType) => {
    const categoryTotals: CategoryTotals = {};
    
    transactions
      .filter(transaction => transaction.type === type)
      .forEach(transaction => {
        if (!categoryTotals[transaction.category]) {
          categoryTotals[transaction.category] = 0;
        }
        categoryTotals[transaction.category] += transaction.amount;
      });
    
    return categoryTotals;
  };

  const getMonthlyData = () => {
    const monthlyData: { [key: string]: { month: string; income: number; expense: number; savings: number } } = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleString('default', { month: 'short' });
      
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = {
          month: monthName,
          income: 0,
          expense: 0,
          savings: 0
        };
      }
      
      monthlyData[monthYear][transaction.type] += transaction.amount;
    });
    
    return Object.values(monthlyData).sort((a, b) => {
      // Sort by month-year descending
      const aMonth = new Date(Date.parse(`${a.month} 1, 2000`)).getMonth();
      const bMonth = new Date(Date.parse(`${b.month} 1, 2000`)).getMonth();
      return aMonth - bMonth;
    });
  };

  // New sorting function with better TypeScript typing
  const sortTransactions = (sortOptions: SortOptions) => {
    const { field, order } = sortOptions;
    
    return [...transactions].sort((a, b) => {
      let comparison = 0;
      
      switch (field) {
        case "date":
          comparison = new Date(b.date).getTime() - new Date(a.date).getTime();
          break;
        case "amount":
          comparison = b.amount - a.amount;
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        default:
          comparison = new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      
      return order === "asc" ? -comparison : comparison;
    });
  };

  // New function to get trend data comparing current month with previous periods
  const getTrendData = (type: TransactionType, months: number = 1) => {
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - months, 1);
    
    // Get current month total
    const currentTotal = transactions
      .filter(t => t.type === type && new Date(t.date) >= currentMonthStart)
      .reduce((sum, t) => sum + t.amount, 0);
    
    // Get previous month(s) total
    const previousTotal = transactions
      .filter(
        t => t.type === type && 
        new Date(t.date) >= previousMonthStart && 
        new Date(t.date) < currentMonthStart
      )
      .reduce((sum, t) => sum + t.amount, 0);
    
    // Calculate percentage change
    let percentageChange = 0;
    let isIncrease = false;
    
    if (previousTotal > 0) {
      percentageChange = ((currentTotal - previousTotal) / previousTotal) * 100;
      isIncrease = percentageChange > 0;
      percentageChange = Math.abs(percentageChange);
    } else if (currentTotal > 0) {
      // If previousTotal is 0 but currentTotal has value, it's a 100% increase
      percentageChange = 100;
      isIncrease = true;
    }
    
    return { 
      percentageChange: parseFloat(percentageChange.toFixed(1)), 
      isIncrease,
      previousTotal,
      currentTotal
    };
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        addTransaction,
        deleteTransaction,
        getTotal,
        getCategoryTotals,
        getMonthlyData,
        isLoading,
        sortTransactions,
        getTrendData
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
};
