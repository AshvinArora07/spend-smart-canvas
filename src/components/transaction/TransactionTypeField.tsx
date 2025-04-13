
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { TransactionFormValues } from "./types";
import { TransactionType } from "@/context/FinanceContext";

interface TransactionTypeFieldProps {
  form: UseFormReturn<TransactionFormValues>;
  onTypeChange: (value: TransactionType) => void;
}

const TransactionTypeField = ({ form, onTypeChange }: TransactionTypeFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Transaction Type</FormLabel>
          <FormControl>
            <Select 
              onValueChange={(value) => {
                field.onChange(value);
                onTypeChange(value as TransactionType);
              }} 
              defaultValue={field.value}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select transaction type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income" className="text-finance-income">Income</SelectItem>
                <SelectItem value="expense" className="text-finance-expense">Expense</SelectItem>
                <SelectItem value="savings" className="text-finance-savings">Savings</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TransactionTypeField;
