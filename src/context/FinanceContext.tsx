
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
};

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const CATEGORIES = {
  income: ["Salary", "Freelance", "Investments", "Gift", "Other"],
  expense: ["Food", "Housing", "Transportation", "Entertainment", "Healthcare", "Shopping", "Utilities", "Other"],
  savings: ["Emergency Fund", "Retirement", "Investment", "Goal Saving", "Other"]
};

// Mock data for demo
const generateMockTransactions = (): Transaction[] => {
  const currentDate = new Date();
  const mockData: Transaction[] = [];
  
  // Generate 3 months of data
  for (let i = 0; i < 3; i++) {
    const month = new Date();
    month.setMonth(currentDate.getMonth() - i);
    
    // Income
    mockData.push({
      id: `income-${i}-1`,
      type: "income",
      amount: 3000 + Math.floor(Math.random() * 500),
      description: "Monthly salary",
      category: "Salary",
      date: new Date(month.getFullYear(), month.getMonth(), 1).toISOString(),
    });
    
    // Freelance income
    if (Math.random() > 0.3) {
      mockData.push({
        id: `income-${i}-2`,
        type: "income",
        amount: 500 + Math.floor(Math.random() * 300),
        description: "Freelance project",
        category: "Freelance",
        date: new Date(month.getFullYear(), month.getMonth(), 15).toISOString(),
      });
    }
    
    // Expenses - multiple per month
    for (let j = 0; j < 8; j++) {
      const day = Math.floor(Math.random() * 28) + 1;
      const category = CATEGORIES.expense[Math.floor(Math.random() * CATEGORIES.expense.length)];
      let amount = 0;
      
      switch (category) {
        case "Food":
          amount = 20 + Math.floor(Math.random() * 50);
          break;
        case "Housing":
          amount = 800 + Math.floor(Math.random() * 200);
          break;
        case "Transportation":
          amount = 40 + Math.floor(Math.random() * 60);
          break;
        default:
          amount = 30 + Math.floor(Math.random() * 100);
      }
      
      mockData.push({
        id: `expense-${i}-${j}`,
        type: "expense",
        amount,
        description: `${category} expense`,
        category,
        date: new Date(month.getFullYear(), month.getMonth(), day).toISOString(),
      });
    }
    
    // Savings
    mockData.push({
      id: `savings-${i}-1`,
      type: "savings",
      amount: 300 + Math.floor(Math.random() * 200),
      description: "Monthly savings",
      category: "Emergency Fund",
      date: new Date(month.getFullYear(), month.getMonth(), 5).toISOString(),
    });
  }
  
  return mockData;
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
      // Generate mock data for demo
      const mockTransactions = generateMockTransactions();
      setTransactions(mockTransactions);
      localStorage.setItem("financeTransactions", JSON.stringify(mockTransactions));
    }
    
    setIsLoading(false);
  }, []);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    if (transactions.length > 0) {
      localStorage.setItem("financeTransactions", JSON.stringify(transactions));
    }
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

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        addTransaction,
        deleteTransaction,
        getTotal,
        getCategoryTotals,
        getMonthlyData,
        isLoading
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
