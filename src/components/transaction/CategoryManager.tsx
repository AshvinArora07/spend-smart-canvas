
import { useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TransactionType } from "@/context/FinanceContext";

export type CategoryOptions = {
  income: string[];
  expense: string[];
  savings: string[];
};

// Default categories
export const defaultCategoryOptions: CategoryOptions = {
  income: ["Salary", "Freelance", "Investments", "Gift", "Other"],
  expense: ["Food", "Housing", "Transportation", "Entertainment", "Healthcare", "Shopping", "Utilities", "Other"],
  savings: ["Emergency Fund", "Retirement", "Investment", "Goal Saving", "Other"]
};

interface CategoryInputProps {
  selectedType: TransactionType;
  categoryOptions: CategoryOptions;
  setCategoryOptions: React.Dispatch<React.SetStateAction<CategoryOptions>>;
  newCategory: string;
  setNewCategory: React.Dispatch<React.SetStateAction<string>>;
  setShowCustomCategoryInput: React.Dispatch<React.SetStateAction<boolean>>;
  onSelect: (category: string) => void;
}

export const CustomCategoryInput = ({ 
  selectedType, 
  categoryOptions, 
  setCategoryOptions, 
  newCategory, 
  setNewCategory, 
  setShowCustomCategoryInput,
  onSelect
}: CategoryInputProps) => {
  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    if (categoryOptions[selectedType].includes(newCategory.trim())) {
      toast.error("This category already exists");
      return;
    }

    setCategoryOptions((prev) => ({
      ...prev,
      [selectedType]: [...prev[selectedType], newCategory.trim()],
    }));

    // Select the newly added category
    onSelect(newCategory.trim());
    
    // Reset and hide the input
    setNewCategory("");
    setShowCustomCategoryInput(false);
    
    toast.success(`Added new ${selectedType} category: ${newCategory}`);
  };

  return (
    <div className="flex gap-2 items-center mt-2">
      <Input
        placeholder="Enter new category"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
        className="flex-1"
      />
      <Button 
        type="button" 
        size="sm" 
        onClick={handleAddCategory}
      >
        <Plus className="h-4 w-4 mr-1" /> Add
      </Button>
    </div>
  );
};
