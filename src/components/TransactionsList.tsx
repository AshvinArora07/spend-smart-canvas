
import { useState } from "react";
import { format } from "date-fns";
import { ArrowDownIcon, ArrowUpIcon, PiggyBankIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFinance, Transaction, TransactionType } from "@/context/FinanceContext";
import { cn } from "@/lib/utils";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const getTransactionIcon = (type: TransactionType) => {
  switch (type) {
    case "income":
      return <ArrowDownIcon className="h-5 w-5 text-finance-income" />;
    case "expense":
      return <ArrowUpIcon className="h-5 w-5 text-finance-expense" />;
    case "savings":
      return <PiggyBankIcon className="h-5 w-5 text-finance-savings" />;
  }
};

const TransactionsList = () => {
  const { transactions, deleteTransaction } = useFinance();
  const [filter, setFilter] = useState<TransactionType | "all">("all");
  
  const filteredTransactions = transactions
    .filter(transaction => filter === "all" || transaction.type === filter)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return (
    <div className="w-full bg-finance-card rounded-lg p-6 card-shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Recent Transactions</h2>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-8 px-3">
              {filter === "all" ? "All Transactions" : 
               filter === "income" ? "Income" : 
               filter === "expense" ? "Expenses" : "Savings"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setFilter("all")}>
              All Transactions
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("income")}>
              Income
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("expense")}>
              Expenses
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("savings")}>
              Savings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="space-y-1">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No transactions found
          </div>
        ) : (
          filteredTransactions.map((transaction) => (
            <TransactionItem 
              key={transaction.id} 
              transaction={transaction} 
              onDelete={deleteTransaction} 
            />
          ))
        )}
      </div>
    </div>
  );
};

interface TransactionItemProps {
  transaction: Transaction;
  onDelete: (id: string) => void;
}

const TransactionItem = ({ transaction, onDelete }: TransactionItemProps) => {
  const { id, type, amount, description, category, date } = transaction;
  
  return (
    <div className="flex items-center justify-between p-3 rounded-md transaction-item hover:transition-colors">
      <div className="flex items-center">
        <div className="mr-4">
          {getTransactionIcon(type)}
        </div>
        <div>
          <h4 className="font-medium text-gray-800">{description}</h4>
          <div className="flex text-sm text-gray-500">
            <span>{category}</span>
            <span className="mx-2">•</span>
            <span>{format(new Date(date), "MMM dd, yyyy")}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <span className={cn(
          "font-medium mr-4",
          type === "income" ? "text-finance-income" : 
          type === "expense" ? "text-finance-expense" : 
          "text-finance-savings"
        )}>
          {type === "income" ? "+" : type === "expense" ? "-" : ""}{formatCurrency(amount)}
        </span>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-gray-400 hover:text-destructive"
          onClick={() => onDelete(id)}
        >
          <Trash2Icon className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </div>
    </div>
  );
};

export default TransactionsList;
