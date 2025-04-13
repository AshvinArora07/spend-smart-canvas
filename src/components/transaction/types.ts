
import { z } from "zod";

export const transactionSchema = z.object({
  type: z.enum(["income", "expense", "savings"]),
  amount: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  category: z.string().min(1, "Please select a category"),
  description: z.string().min(3, "Description must be at least 3 characters"),
  date: z.date(),
});

export type TransactionFormValues = z.infer<typeof transactionSchema>;

export type SortField = "date" | "amount" | "category";
export type SortOrder = "asc" | "desc";

export interface SortOptions {
  field: SortField;
  order: SortOrder;
}
