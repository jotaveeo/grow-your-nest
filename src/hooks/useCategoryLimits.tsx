
import { useState, useEffect } from "react";
import { useFinanceExtendedContext } from "@/contexts/FinanceExtendedContext";

interface CategoryLimit {
  id: string;
  name: string;
  icon: string;
  type: string;
  spent: number;
  budget: number;
  percentage: number;
  remaining: number;
  transactions: number;
  status: "safe" | "warning" | "exceeded";
}

export const useCategoryLimits = () => {
  const { transactions, categories } = useFinanceExtendedContext();
  const [selectedMonth] = useState(new Date().getMonth());
  const [selectedYear] = useState(new Date().getFullYear());
  const [customLimits, setCustomLimits] = useState<{ [key: string]: number }>({});

  // Load custom limits from localStorage
  useEffect(() => {
    const loadCustomLimits = () => {
      const saved = localStorage.getItem("financeflow_custom_limits");
      setCustomLimits(saved ? JSON.parse(saved) : {});
    };

    loadCustomLimits();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "financeflow_custom_limits") {
        loadCustomLimits();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [categories]);

  // Update custom limits
  const updateCustomLimits = (newLimits: { [key: string]: number }) => {
    setCustomLimits(newLimits);
    localStorage.setItem("financeflow_custom_limits", JSON.stringify(newLimits));
  };

  // Get default limit for a category
  const getDefaultLimit = (categoryName: string) => {
    const defaultLimits: { [key: string]: number } = {
      Alimentação: 800,
      Supermercado: 600,
      Restaurantes: 300,
      Transporte: 400,
      Combustível: 300,
      Moradia: 1200,
      Aluguel: 1500,
      "Contas Básicas": 400,
      "Energia Elétrica": 200,
      Água: 100,
      Internet: 100,
      Telefone: 80,
      Gás: 80,
      Saúde: 300,
      Medicamentos: 150,
      "Plano de Saúde": 400,
      Academia: 100,
      Educação: 200,
      Cursos: 300,
      Livros: 100,
      Lazer: 250,
      Cinema: 100,
      Streaming: 50,
      Viagens: 500,
      Roupas: 200,
      Sapatos: 150,
      Cabeleireiro: 80,
      Cosméticos: 100,
      "Cartão de Crédito": 1000,
      Empréstimos: 500,
      Seguros: 200,
      Pets: 150,
      Presentes: 200,
    };

    return defaultLimits[categoryName] || 300;
  };

  // Calculate category limits
  const getCategoryLimits = (): CategoryLimit[] => {
    return categories
      .filter((cat) => cat.type === "expense")
      .map((category) => {
        const categoryTransactions = transactions.filter((t) => {
          const transactionDate = new Date(t.date);
          return (
            t.category === category.name &&
            t.type === "expense" &&
            transactionDate.getMonth() === selectedMonth &&
            transactionDate.getFullYear() === selectedYear
          );
        });

        const spent = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
        const budget = customLimits[category.name] ?? getDefaultLimit(category.name);
        const percentage = budget > 0 ? (spent / budget) * 100 : 0;
        const remaining = budget - spent;

        return {
          ...category,
          spent,
          budget,
          percentage: Math.min(percentage, 100),
          remaining,
          transactions: categoryTransactions.length,
          status:
            percentage >= 100
              ? "exceeded"
              : percentage >= 80
              ? "warning"
              : "safe",
        } as CategoryLimit;
      });
  };

  return {
    categoryLimits: getCategoryLimits(),
    customLimits,
    updateCustomLimits,
    selectedMonth,
    selectedYear,
  };
};
