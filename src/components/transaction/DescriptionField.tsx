
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { TransactionFormValues } from "./types";

interface DescriptionFieldProps {
  form: UseFormReturn<TransactionFormValues>;
  placeholder?: string;
  maxLength?: number;
}

const DescriptionField = ({ form, placeholder = "Enter transaction details", maxLength = 200 }: DescriptionFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Description</FormLabel>
          <FormControl>
            <Textarea 
              placeholder={placeholder} 
              className="resize-none" 
              maxLength={maxLength}
              {...field} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DescriptionField;
