
import { useState } from "react";
import { format } from "date-fns";
import { ArrowDownIcon, ArrowUpIcon, PiggyBankIcon, Trash2Icon, SortAscIcon, SortDescIcon, CalendarIcon, DollarSignIcon, TagsIcon } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  const { transactions, deleteTransaction, sortTransactions } = useFinance();
  const [filter, setFilter] = useState<TransactionType | "all">("all");
  const [sortBy, setSortBy] = useState<"date" | "amount" | "category">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === "asc" ? "desc" : "asc");
  };

  const handleSortChange = (newSortBy: "date" | "amount" | "category") => {
    if (sortBy === newSortBy) {
      toggleSortOrder();
    } else {
      setSortBy(newSortBy);
      setSortOrder("desc");
    }
  };
  
  const sortedAndFilteredTransactions = sortTransactions(sortBy, sortOrder)
    .filter(transaction => filter === "all" || transaction.type === filter);
  
  return (
    <div className="w-full bg-finance-card rounded-lg p-6 card-shadow">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold">Recent Transactions</h2>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-8 px-3 w-full sm:w-auto">
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-8 px-3 w-full sm:w-auto">
                Sort: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)} {sortOrder === "asc" ? "↑" : "↓"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleSortChange("date")} className="flex justify-between">
                <span className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Date
                </span>
                {sortBy === "date" && (sortOrder === "asc" ? <SortAscIcon className="h-4 w-4" /> : <SortDescIcon className="h-4 w-4" />)}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange("amount")} className="flex justify-between">
                <span className="flex items-center">
                  <DollarSignIcon className="h-4 w-4 mr-2" />
                  Amount
                </span>
                {sortBy === "amount" && (sortOrder === "asc" ? <SortAscIcon className="h-4 w-4" /> : <SortDescIcon className="h-4 w-4" />)}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange("category")} className="flex justify-between">
                <span className="flex items-center">
                  <TagsIcon className="h-4 w-4 mr-2" />
                  Category
                </span>
                {sortBy === "category" && (sortOrder === "asc" ? <SortAscIcon className="h-4 w-4" /> : <SortDescIcon className="h-4 w-4" />)}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="space-y-1">
        {sortedAndFilteredTransactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No transactions found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead className="hidden sm:table-cell">Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAndFilteredTransactions.map((transaction) => (
                  <TransactionItem 
                    key={transaction.id} 
                    transaction={transaction} 
                    onDelete={deleteTransaction} 
                  />
                ))}
              </TableBody>
            </Table>
          </div>
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
    <TableRow>
      <TableCell>
        <div className="flex items-center">
          {getTransactionIcon(type)}
        </div>
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        {format(new Date(date), "MMM dd, yyyy")}
      </TableCell>
      <TableCell>
        <div>
          <p className="font-medium text-gray-800 truncate max-w-[150px]">{description}</p>
          <p className="text-sm text-gray-500 md:hidden">{category}</p>
          <p className="text-xs text-gray-400 sm:hidden">{format(new Date(date), "MMM dd")}</p>
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell">{category}</TableCell>
      <TableCell className="text-right">
        <span className={cn(
          "font-medium",
          type === "income" ? "text-finance-income" : 
          type === "expense" ? "text-finance-expense" : 
          "text-finance-savings"
        )}>
          {type === "income" ? "+" : type === "expense" ? "-" : ""}{formatCurrency(amount)}
        </span>
      </TableCell>
      <TableCell>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-gray-400 hover:text-destructive"
          onClick={() => onDelete(id)}
        >
          <Trash2Icon className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default TransactionsList;
