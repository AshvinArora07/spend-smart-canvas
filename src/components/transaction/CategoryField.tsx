
import { useState } from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { TransactionFormValues } from "./types";
import { TransactionType } from "@/context/FinanceContext";
import { CategoryOptions, CustomCategoryInput } from "./CategoryManager";

interface CategoryFieldProps {
  form: UseFormReturn<TransactionFormValues>;
  selectedType: TransactionType;
  categoryOptions: CategoryOptions;
  setCategoryOptions: React.Dispatch<React.SetStateAction<CategoryOptions>>;
  newCategory: string;
  setNewCategory: React.Dispatch<React.SetStateAction<string>>;
  showCustomCategoryInput: boolean;
  setShowCustomCategoryInput: React.Dispatch<React.SetStateAction<boolean>>;
}

const CategoryField = ({
  form,
  selectedType,
  categoryOptions,
  setCategoryOptions,
  newCategory,
  setNewCategory,
  showCustomCategoryInput,
  setShowCustomCategoryInput
}: CategoryFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="category"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Category</FormLabel>
          <div className="space-y-2">
            <FormControl>
              <Select 
                onValueChange={(value) => {
                  if (value === "custom") {
                    setShowCustomCategoryInput(true);
                  } else {
                    field.onChange(value);
                    setShowCustomCategoryInput(false);
                  }
                }} 
                value={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions[selectedType].map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom" className="text-primary font-medium">
                    + Add custom category
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            {showCustomCategoryInput && (
              <CustomCategoryInput
                selectedType={selectedType}
                categoryOptions={categoryOptions}
                setCategoryOptions={setCategoryOptions}
                newCategory={newCategory}
                setNewCategory={setNewCategory}
                setShowCustomCategoryInput={setShowCustomCategoryInput}
                onSelect={(category) => form.setValue("category", category)}
              />
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CategoryField;
