import { useState, useEffect } from "react";
import {
  Transaction,
  Category,
  FinancialGoal,
  WishlistItem,
  PiggyBankEntry,
  Debt,
  CreditCard,
  CategoryLimit,
  Investment,
  FixedExpense,
  IncomeSource,
} from "@/types/finance";

export const defaultCategories: Category[] = [
  {
    id: "1",
    name: "Salário",
    icon: "💰",
    color: "#10B981",
    type: "income",
  },
  {
    id: "2",
    name: "Freelance",
    icon: "💻",
    color: "#3B82F6",
    type: "income",
  },
  {
    id: "3",
    name: "Investimentos (Receita)",
    icon: "📈",
    color: "#8B5CF6",
    type: "income",
  },
  {
    id: "4",
    name: "Comissões",
    icon: "🤝",
    color: "#06B6D4",
    type: "income",
  },
  {
    id: "5",
    name: "Aluguel Recebido",
    icon: "🏠",
    color: "#84CC16",
    type: "income",
  },
  {
    id: "6",
    name: "Vendas",
    icon: "🛍️",
    color: "#F59E0B",
    type: "income",
  },
  {
    id: "7",
    name: "13º Salário",
    icon: "🎁",
    color: "#EC4899",
    type: "income",
  },
  {
    id: "8",
    name: "Férias",
    icon: "🏖️",
    color: "#14B8A6",
    type: "income",
  },
  {
    id: "9",
    name: "Bonificação",
    icon: "🏆",
    color: "#F97316",
    type: "income",
  },
  {
    id: "10",
    name: "Restituição IR",
    icon: "📋",
    color: "#6366F1",
    type: "income",
  },
  {
    id: "11",
    name: "Pensão Recebida",
    icon: "👨‍👩‍👧‍👦",
    color: "#8B5CF6",
    type: "income",
  },
  {
    id: "12",
    name: "Renda Extra",
    icon: "💪",
    color: "#10B981",
    type: "income",
  },
  {
    id: "13",
    name: "Recebimentos Gerais",
    icon: "🏦",
    color: "#0EA5E9",
    type: "income",
  },
  {
    id: "14",
    name: "Alimentação",
    icon: "🍽️",
    color: "#EF4444",
    type: "expense",
  },
  {
    id: "15",
    name: "Supermercado",
    icon: "🛒",
    color: "#DC2626",
    type: "expense",
  },
  {
    id: "16",
    name: "Transporte",
    icon: "🚗",
    color: "#F59E0B",
    type: "expense",
  },
  {
    id: "17",
    name: "Combustível",
    icon: "⛽",
    color: "#D97706",
    type: "expense",
  },
  {
    id: "18",
    name: "Moradia",
    icon: "🏠",
    color: "#F97316",
    type: "expense",
  },
  {
    id: "19",
    name: "Aluguel",
    icon: "🔑",
    color: "#EA580C",
    type: "expense",
  },
  {
    id: "20",
    name: "Contas Básicas",
    icon: "📄",
    color: "#7C2D12",
    type: "expense",
  },
  {
    id: "21",
    name: "Energia Elétrica",
    icon: "💡",
    color: "#FCD34D",
    type: "expense",
  },
  {
    id: "22",
    name: "Água",
    icon: "💧",
    color: "#0EA5E9",
    type: "expense",
  },
  {
    id: "23",
    name: "Internet",
    icon: "📶",
    color: "#3B82F6",
    type: "expense",
  },
  {
    id: "24",
    name: "Telefone",
    icon: "📱",
    color: "#6366F1",
    type: "expense",
  },
  {
    id: "25",
    name: "Gás",
    icon: "🔥",
    color: "#F59E0B",
    type: "expense",
  },
  {
    id: "26",
    name: "Saúde",
    icon: "🏥",
    color: "#06B6D4",
    type: "expense",
  },
  {
    id: "27",
    name: "Medicamentos",
    icon: "💊",
    color: "#0891B2",
    type: "expense",
  },
  {
    id: "28",
    name: "Plano de Saúde",
    icon: "🩺",
    color: "#0E7490",
    type: "expense",
  },
  {
    id: "29",
    name: "Academia",
    icon: "💪",
    color: "#DC2626",
    type: "expense",
  },
  {
    id: "30",
    name: "Terapia",
    icon: "🧠",
    color: "#7C3AED",
    type: "expense",
  },
  {
    id: "31",
    name: "Educação",
    icon: "📚",
    color: "#84CC16",
    type: "expense",
  },
  {
    id: "32",
    name: "Cursos",
    icon: "🎓",
    color: "#65A30D",
    type: "expense",
  },
  {
    id: "33",
    name: "Livros",
    icon: "📖",
    color: "#16A34A",
    type: "expense",
  },
  {
    id: "34",
    name: "Material Escolar",
    icon: "✏️",
    color: "#15803D",
    type: "expense",
  },
  {
    id: "35",
    name: "Lazer",
    icon: "🎮",
    color: "#EC4899",
    type: "expense",
  },
  {
    id: "36",
    name: "Cinema",
    icon: "🎬",
    color: "#DB2777",
    type: "expense",
  },
  {
    id: "37",
    name: "Streaming",
    icon: "📺",
    color: "#BE185D",
    type: "expense",
  },
  {
    id: "38",
    name: "Jogos",
    icon: "🎯",
    color: "#9D174D",
    type: "expense",
  },
  {
    id: "39",
    name: "Viagens",
    icon: "✈️",
    color: "#0EA5E9",
    type: "expense",
  },
  {
    id: "40",
    name: "Restaurantes",
    icon: "🍕",
    color: "#F97316",
    type: "expense",
  },
  {
    id: "41",
    name: "Bares",
    icon: "🍺",
    color: "#EA580C",
    type: "expense",
  },
  {
    id: "42",
    name: "Roupas",
    icon: "👕",
    color: "#8B5CF6",
    type: "expense",
  },
  {
    id: "43",
    name: "Sapatos",
    icon: "👟",
    color: "#7C3AED",
    type: "expense",
  },
  {
    id: "44",
    name: "Cabeleireiro",
    icon: "💇",
    color: "#EC4899",
    type: "expense",
  },
  {
    id: "45",
    name: "Cosméticos",
    icon: "💄",
    color: "#DB2777",
    type: "expense",
  },
  {
    id: "46",
    name: "Cartão de Crédito",
    icon: "💳",
    color: "#EF4444",
    type: "expense",
  },
  {
    id: "47",
    name: "Empréstimos",
    icon: "🏦",
    color: "#DC2626",
    type: "expense",
  },
  {
    id: "48",
    name: "Financiamentos",
    icon: "🏠",
    color: "#B91C1C",
    type: "expense",
  },
  {
    id: "49",
    name: "Taxas Bancárias (Específicas)",
    icon: "🏛️",
    color: "#991B1B",
    type: "expense",
  },
  {
    id: "50",
    name: "Seguros",
    icon: "🛡️",
    color: "#7F1D1D",
    type: "expense",
  },
  {
    id: "51",
    name: "Impostos",
    icon: "📊",
    color: "#374151",
    type: "expense",
  },
  {
    id: "52",
    name: "IPTU",
    icon: "🏘️",
    color: "#4B5563",
    type: "expense",
  },
  {
    id: "53",
    name: "IPVA",
    icon: "🚙",
    color: "#6B7280",
    type: "expense",
  },
  {
    id: "54",
    name: "Multas",
    icon: "⚠️",
    color: "#9CA3AF",
    type: "expense",
  },
  {
    id: "55",
    name: "Crianças",
    icon: "👶",
    color: "#FCD34D",
    type: "expense",
  },
  {
    id: "56",
    name: "Pets",
    icon: "🐕",
    color: "#FBBF24",
    type: "expense",
  },
  {
    id: "57",
    name: "Presentes",
    icon: "🎁",
    color: "#F59E0B",
    type: "expense",
  },
  {
    id: "58",
    name: "Poupança",
    icon: "🐷",
    color: "#10B981",
    type: "expense",
  },
  {
    id: "59",
    name: "Investimentos (Despesa)",
    icon: "📈",
    color: "#059669",
    type: "expense",
  },
  {
    id: "60",
    name: "Previdência",
    icon: "👴",
    color: "#047857",
    type: "expense",
  },
  {
    id: "61",
    name: "Doações",
    icon: "❤️",
    color: "#F87171",
    type: "expense",
  },
  {
    id: "62",
    name: "Assinaturas",
    icon: "📝",
    color: "#6366F1",
    type: "expense",
  },
  {
    id: "63",
    name: "iFood",
    icon: "🍔",
    color: "#F87171",
    type: "expense",
  },
  {
    id: "64",
    name: "Cartão de Débito",
    icon: "🏧",
    color: "#0EA5E9",
    type: "expense",
  },
  {
    id: "65",
    name: "Outros",
    icon: "📦",
    color: "#6B7280",
    type: "expense",
  },
];

export const useFinanceExtended = () => {
  // Existing states
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // New states
  const [financialGoals, setFinancialGoals] = useState<FinancialGoal[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [piggyBankEntries, setPiggyBankEntries] = useState<PiggyBankEntry[]>(
    []
  );
  const [debts, setDebts] = useState<Debt[]>([]);
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
  const [categoryLimits, setCategoryLimits] = useState<CategoryLimit[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([]);
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([]);

  // Load data from localStorage
  useEffect(() => {
    const loadData = (
      key: string,
      setter: Function,
      defaultValue: any = []
    ) => {
      try {
        const saved = localStorage.getItem(`financeflow_${key}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          setter(parsed);
        } else if (key === "categories") {
          setter(defaultCategories);
        } else {
          setter(defaultValue);
        }
      } catch (error) {
        console.error(`Error loading ${key}:`, error);
        if (key === "categories") {
          setter(defaultCategories);
        } else {
          setter(defaultValue);
        }
      }
    };

    loadData("transactions", setTransactions);
    loadData("categories", setCategories, defaultCategories);
    loadData("goals", setFinancialGoals);
    loadData("wishlist", setWishlistItems);
    loadData("piggybank", setPiggyBankEntries);
    loadData("debts", setDebts);
    loadData("creditcards", setCreditCards);
    loadData("limits", setCategoryLimits);
    loadData("investments", setInvestments);
    loadData("fixedexpenses", setFixedExpenses);
    loadData("incomesources", setIncomeSources);
  }, []);

  // Save data to localStorage - with error handling
  const saveToLocalStorage = (key: string, data: any) => {
    try {
      localStorage.setItem(`financeflow_${key}`, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
    }
  };

  useEffect(
    () => saveToLocalStorage("transactions", transactions),
    [transactions]
  );
  useEffect(() => saveToLocalStorage("categories", categories), [categories]);
  useEffect(
    () => saveToLocalStorage("goals", financialGoals),
    [financialGoals]
  );
  useEffect(
    () => saveToLocalStorage("wishlist", wishlistItems),
    [wishlistItems]
  );
  useEffect(
    () => saveToLocalStorage("piggybank", piggyBankEntries),
    [piggyBankEntries]
  );
  useEffect(() => saveToLocalStorage("debts", debts), [debts]);
  useEffect(
    () => saveToLocalStorage("creditcards", creditCards),
    [creditCards]
  );
  useEffect(
    () => saveToLocalStorage("limits", categoryLimits),
    [categoryLimits]
  );
  useEffect(
    () => saveToLocalStorage("investments", investments),
    [investments]
  );
  useEffect(
    () => saveToLocalStorage("fixedexpenses", fixedExpenses),
    [fixedExpenses]
  );
  useEffect(
    () => saveToLocalStorage("incomesources", incomeSources),
    [incomeSources]
  );

  // Transaction management - Fixed to auto-generate createdAt and force re-render
  const addTransaction = (
    transaction: Omit<Transaction, "id" | "createdAt">
  ) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };

    console.log("Adding transaction:", newTransaction);

    setTransactions((prev) => {
      const updated = [newTransaction, ...prev];
      console.log("Updated transactions count:", updated.length);
      return updated;
    });
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((transaction) =>
        transaction.id === id ? { ...transaction, ...updates } : transaction
      )
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) =>
      prev.filter((transaction) => transaction.id !== id)
    );
  };

  // Category management
  const addCategory = (category: Omit<Category, "id">) => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
    };
    setCategories((prev) => [newCategory, ...prev]);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((category) =>
        category.id === id ? { ...category, ...updates } : category
      )
    );
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((category) => category.id !== id));
  };

  // Financial Goals
  const addFinancialGoal = (goal: Omit<FinancialGoal, "id" | "createdAt">) => {
    const newGoal: FinancialGoal = {
      ...goal,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setFinancialGoals((prev) => [newGoal, ...prev]);
  };

  const updateFinancialGoal = (id: string, updates: Partial<FinancialGoal>) => {
    setFinancialGoals((prev) =>
      prev.map((goal) => (goal.id === id ? { ...goal, ...updates } : goal))
    );
  };

  const deleteFinancialGoal = (id: string) => {
    setFinancialGoals((prev) => prev.filter((goal) => goal.id !== id));
  };

  // Wishlist
  const addWishlistItem = (item: Omit<WishlistItem, "id" | "createdAt">) => {
    const newItem: WishlistItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setWishlistItems((prev) => [newItem, ...prev]);
  };

  const updateWishlistItem = (id: string, updates: Partial<WishlistItem>) => {
    setWishlistItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteWishlistItem = (id: string) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Piggy Bank
  const addPiggyBankEntry = (
    entry: Omit<PiggyBankEntry, "id" | "createdAt">
  ) => {
    const newEntry: PiggyBankEntry = {
      ...entry,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setPiggyBankEntries((prev) => [newEntry, ...prev]);
  };

  const deletePiggyBankEntry = (id: string) => {
    setPiggyBankEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  // Debts
  const addDebt = (debt: Omit<Debt, "id" | "createdAt">) => {
    const newDebt: Debt = {
      ...debt,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setDebts((prev) => [newDebt, ...prev]);
  };

  const updateDebt = (id: string, updates: Partial<Debt>) => {
    setDebts((prev) =>
      prev.map((debt) => (debt.id === id ? { ...debt, ...updates } : debt))
    );
  };

  const deleteDebt = (id: string) => {
    setDebts((prev) => prev.filter((debt) => debt.id !== id));
  };

  // Credit Cards
  const addCreditCard = (card: Omit<CreditCard, "id" | "createdAt">) => {
    const newCard: CreditCard = {
      ...card,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setCreditCards((prev) => [newCard, ...prev]);
  };

  const updateCreditCard = (id: string, updates: Partial<CreditCard>) => {
    setCreditCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, ...updates } : card))
    );
  };

  const deleteCreditCard = (id: string) => {
    setCreditCards((prev) => prev.filter((card) => card.id !== id));
  };

  // Fixed Expenses
  const addFixedExpense = (expense: Omit<FixedExpense, "id" | "createdAt">) => {
    const newExpense: FixedExpense = {
      ...expense,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setFixedExpenses((prev) => [newExpense, ...prev]);
  };

  const updateFixedExpense = (id: string, updates: Partial<FixedExpense>) => {
    setFixedExpenses((prev) =>
      prev.map((expense) =>
        expense.id === id ? { ...expense, ...updates } : expense
      )
    );
  };

  const deleteFixedExpense = (id: string) => {
    setFixedExpenses((prev) => prev.filter((expense) => expense.id !== id));
  };

  // Calculate totals
  const getPiggyBankTotal = () => {
    return piggyBankEntries.reduce((sum, entry) => sum + entry.amount, 0);
  };

  const getTotalDebt = () => {
    return debts
      .filter((debt) => debt.status === "active")
      .reduce((sum, debt) => sum + debt.currentAmount, 0);
  };

  const getTotalInvestments = () => {
    return investments.reduce(
      (sum, investment) => sum + investment.currentValue,
      0
    );
  };

  return {
    // Existing
    transactions,
    categories,

    // Transaction management
    addTransaction,
    updateTransaction,
    deleteTransaction,

    // Category management
    addCategory,
    updateCategory,
    deleteCategory,

    // New data
    financialGoals,
    wishlistItems,
    piggyBankEntries,
    debts,
    creditCards,
    categoryLimits,
    investments,
    fixedExpenses,
    incomeSources,

    // Financial Goals
    addFinancialGoal,
    updateFinancialGoal,
    deleteFinancialGoal,

    // Wishlist
    addWishlistItem,
    updateWishlistItem,
    deleteWishlistItem,

    // Piggy Bank
    addPiggyBankEntry,
    deletePiggyBankEntry,

    // Debts
    addDebt,
    updateDebt,
    deleteDebt,

    // Credit Cards
    addCreditCard,
    updateCreditCard,
    deleteCreditCard,

    // Fixed Expenses
    addFixedExpense,
    updateFixedExpense,
    deleteFixedExpense,

    // Calculations
    getPiggyBankTotal,
    getTotalDebt,
    getTotalInvestments,
  };
};
