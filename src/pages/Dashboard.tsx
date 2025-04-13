
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useFinance } from "@/context/FinanceContext";
import DashboardCard from "@/components/DashboardCard";
import TransactionForm from "@/components/TransactionForm";
import TransactionsList from "@/components/TransactionsList";
import ExpensePieChart from "@/components/ExpensePieChart";
import MonthlyBarChart from "@/components/MonthlyBarChart";
import TrendComparisonChart from "@/components/TrendComparisonChart";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  WalletIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PiggyBankIcon,
  PlusIcon,
  LogOutIcon,
  UserIcon,
  BarChart3Icon,
} from "lucide-react";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { getTotal, getTrendData } = useFinance();
  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);
  
  const income = getTotal("income");
  const expenses = getTotal("expense");
  const savings = getTotal("savings");
  const balance = income - expenses;
  
  // Get trend data for dashboard cards
  const incomeTrend = getTrendData("income", 1);
  const expenseTrend = getTrendData("expense", 1);
  const savingsTrend = getTrendData("savings", 1);
  const balanceTrend = {
    percentageChange: 0,
    isIncrease: false,
    previousTotal: 0,
    currentTotal: 0
  };
  
  // Calculate balance trend if we have previous data
  if (incomeTrend.previousTotal > 0 || expenseTrend.previousTotal > 0) {
    const previousBalance = incomeTrend.previousTotal - expenseTrend.previousTotal;
    balanceTrend.previousTotal = previousBalance;
    balanceTrend.currentTotal = balance;
    
    if (previousBalance !== 0) {
      balanceTrend.percentageChange = 
        parseFloat((Math.abs(balance - previousBalance) / Math.abs(previousBalance) * 100).toFixed(1));
      balanceTrend.isIncrease = balance > previousBalance;
    }
  }
  
  return (
    <div className="min-h-screen bg-finance-background pb-8">
      {/* Header */}
      <header className="bg-finance-card border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">SpendSmart</h1>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline"
              className="hidden sm:flex"
              onClick={() => setTransactionDialogOpen(true)}
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              New Transaction
            </Button>
            
            <Button 
              variant="default"
              size="icon"
              className="sm:hidden bg-finance-primary hover:bg-finance-secondary"
              onClick={() => setTransactionDialogOpen(true)}
            >
              <PlusIcon className="h-4 w-4" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 rounded-full">
                  <UserIcon className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuItem>
                  {user?.name || "User"}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  {user?.email || "user@example.com"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOutIcon className="h-4 w-4 mr-2" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 pt-6 space-y-6">
        {/* Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard
            title="Available Balance"
            value={formatCurrency(balance)}
            icon={<WalletIcon className="h-5 w-5" />}
            trend={{
              value: balanceTrend.percentageChange,
              label: "last month",
              direction: balanceTrend.isIncrease ? "up" : "down"
            }}
          />
          <DashboardCard
            title="Total Income"
            value={formatCurrency(income)}
            icon={<ArrowDownIcon className="h-5 w-5 text-finance-income" />}
            trend={{
              value: incomeTrend.percentageChange,
              label: "last month",
              direction: incomeTrend.isIncrease ? "up" : "down"
            }}
            className="border-l-4 border-finance-income"
          />
          <DashboardCard
            title="Total Expenses"
            value={formatCurrency(expenses)}
            icon={<ArrowUpIcon className="h-5 w-5 text-finance-expense" />}
            trend={{
              value: expenseTrend.percentageChange,
              label: "last month",
              direction: expenseTrend.isIncrease ? "up" : "down"
            }}
            className="border-l-4 border-finance-expense"
          />
          <DashboardCard
            title="Total Savings"
            value={formatCurrency(savings)}
            icon={<PiggyBankIcon className="h-5 w-5 text-finance-savings" />}
            trend={{
              value: savingsTrend.percentageChange,
              label: "last month",
              direction: savingsTrend.isIncrease ? "up" : "down"
            }}
            className="border-l-4 border-finance-savings"
          />
        </div>
        
        {/* Trend Comparison Chart */}
        <div>
          <TrendComparisonChart months={3} />
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MonthlyBarChart />
          <ExpensePieChart />
        </div>
        
        {/* Transactions List */}
        <div>
          <TransactionsList />
        </div>
      </main>
      
      {/* New Transaction Dialog */}
      <Dialog open={transactionDialogOpen} onOpenChange={setTransactionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Transaction</DialogTitle>
          </DialogHeader>
          <TransactionForm onSuccess={() => setTransactionDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
