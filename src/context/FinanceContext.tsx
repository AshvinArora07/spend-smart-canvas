
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { toast } from "sonner";

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
  sortTransactions: (by: "date" | "amount" | "category", order: "asc" | "desc") => Transaction[];
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
      // Initialize with empty array instead of mock data
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
      const [aYear, aMonth] = a.month.split('-');
      const [bYear, bMonth] = b.month.split('-');
      return new Date(Number(bYear), Number(bMonth) - 1).getTime() - 
             new Date(Number(aYear), Number(aMonth) - 1).getTime();
    });
  };

  // New sorting function
  const sortTransactions = (by: "date" | "amount" | "category" = "date", order: "asc" | "desc" = "desc") => {
    return [...transactions].sort((a, b) => {
      let comparison = 0;
      
      switch (by) {
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
        sortTransactions
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
