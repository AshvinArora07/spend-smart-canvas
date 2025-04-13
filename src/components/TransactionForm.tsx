
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useFinance, TransactionType } from "@/context/FinanceContext";
import { toast } from "sonner";
import { transactionSchema, TransactionFormValues } from "./transaction/types";
import { defaultCategoryOptions, CategoryOptions } from "./transaction/CategoryManager";
import TransactionTypeField from "./transaction/TransactionTypeField";
import CategoryField from "./transaction/CategoryField";
import AmountField from "./transaction/AmountField";
import DescriptionField from "./transaction/DescriptionField";
import DateField from "./transaction/DateField";

const TransactionForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { addTransaction } = useFinance();
  const [selectedType, setSelectedType] = useState<TransactionType>("expense");
  const [newCategory, setNewCategory] = useState("");
  const [categoryOptions, setCategoryOptions] = useState<CategoryOptions>(defaultCategoryOptions);
  const [showCustomCategoryInput, setShowCustomCategoryInput] = useState(false);
  
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "expense",
      amount: "",
      category: "",
      description: "",
      date: new Date(),
    },
  });
  
  const onSubmit = (values: TransactionFormValues) => {
    addTransaction({
      type: values.type,
      amount: Number(values.amount),
      category: values.category,
      description: values.description,
      date: values.date.toISOString(),
    });
    
    form.reset({
      type: selectedType,
      amount: "",
      category: "",
      description: "",
      date: new Date(),
    });
    
    toast.success("Transaction added successfully!");
    
    if (onSuccess) {
      onSuccess();
    }
  };

  const handleTypeChange = (type: TransactionType) => {
    setSelectedType(type);
    form.setValue("category", "");
    setShowCustomCategoryInput(false);
  };
  
  return (
    <div className="w-full bg-finance-card rounded-lg p-6 card-shadow">
      <h2 className="text-xl font-semibold mb-6">Add New Transaction</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <TransactionTypeField 
            form={form} 
            onTypeChange={handleTypeChange}
          />
          
          <CategoryField 
            form={form}
            selectedType={selectedType}
            categoryOptions={categoryOptions}
            setCategoryOptions={setCategoryOptions}
            newCategory={newCategory}
            setNewCategory={setNewCategory}
            showCustomCategoryInput={showCustomCategoryInput}
            setShowCustomCategoryInput={setShowCustomCategoryInput}
          />
          
          <AmountField form={form} />
          
          <DescriptionField form={form} />
          
          <DateField form={form} />
          
          <Button type="submit" className="w-full bg-finance-primary hover:bg-finance-secondary">
            Add Transaction
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default TransactionForm;
