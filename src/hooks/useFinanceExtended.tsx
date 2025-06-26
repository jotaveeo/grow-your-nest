
import { useState, useEffect } from 'react'
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
  IncomeSource 
} from '@/types/finance'

const defaultCategories: Category[] = [
  { id: '1', name: 'Salário', icon: '💰', color: '#10B981', type: 'income' },
  { id: '2', name: 'Freelance', icon: '💻', color: '#3B82F6', type: 'income' },
  { id: '3', name: 'Investimentos', icon: '📈', color: '#8B5CF6', type: 'income' },
  { id: '4', name: 'Alimentação', icon: '🍽️', color: '#EF4444', type: 'expense' },
  { id: '5', name: 'Transporte', icon: '🚗', color: '#F59E0B', type: 'expense' },
  { id: '6', name: 'Lazer', icon: '🎮', color: '#EC4899', type: 'expense' },
  { id: '7', name: 'Saúde', icon: '🏥', color: '#06B6D4', type: 'expense' },
  { id: '8', name: 'Educação', icon: '📚', color: '#84CC16', type: 'expense' },
  { id: '9', name: 'Casa', icon: '🏠', color: '#F97316', type: 'expense' },
]

export const useFinanceExtended = () => {
  // Existing states
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>(defaultCategories)
  
  // New states
  const [financialGoals, setFinancialGoals] = useState<FinancialGoal[]>([])
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [piggyBankEntries, setPiggyBankEntries] = useState<PiggyBankEntry[]>([])
  const [debts, setDebts] = useState<Debt[]>([])
  const [creditCards, setCreditCards] = useState<CreditCard[]>([])
  const [categoryLimits, setCategoryLimits] = useState<CategoryLimit[]>([])
  const [investments, setInvestments] = useState<Investment[]>([])
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([])
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([])

  // Load data from localStorage
  useEffect(() => {
    const loadData = (key: string, setter: Function) => {
      const saved = localStorage.getItem(`financeflow_${key}`)
      if (saved) setter(JSON.parse(saved))
    }

    loadData('transactions', setTransactions)
    loadData('categories', setCategories)
    loadData('goals', setFinancialGoals)
    loadData('wishlist', setWishlistItems)
    loadData('piggybank', setPiggyBankEntries)
    loadData('debts', setDebts)
    loadData('creditcards', setCreditCards)
    loadData('limits', setCategoryLimits)
    loadData('investments', setInvestments)
    loadData('fixedexpenses', setFixedExpenses)
    loadData('incomesources', setIncomeSources)
  }, [])

  // Save data to localStorage
  useEffect(() => localStorage.setItem('financeflow_transactions', JSON.stringify(transactions)), [transactions])
  useEffect(() => localStorage.setItem('financeflow_categories', JSON.stringify(categories)), [categories])
  useEffect(() => localStorage.setItem('financeflow_goals', JSON.stringify(financialGoals)), [financialGoals])
  useEffect(() => localStorage.setItem('financeflow_wishlist', JSON.stringify(wishlistItems)), [wishlistItems])
  useEffect(() => localStorage.setItem('financeflow_piggybank', JSON.stringify(piggyBankEntries)), [piggyBankEntries])
  useEffect(() => localStorage.setItem('financeflow_debts', JSON.stringify(debts)), [debts])
  useEffect(() => localStorage.setItem('financeflow_creditcards', JSON.stringify(creditCards)), [creditCards])
  useEffect(() => localStorage.setItem('financeflow_limits', JSON.stringify(categoryLimits)), [categoryLimits])
  useEffect(() => localStorage.setItem('financeflow_investments', JSON.stringify(investments)), [investments])
  useEffect(() => localStorage.setItem('financeflow_fixedexpenses', JSON.stringify(fixedExpenses)), [fixedExpenses])
  useEffect(() => localStorage.setItem('financeflow_incomesources', JSON.stringify(incomeSources)), [incomeSources])

  // Transaction management - Fixed to auto-generate createdAt
  const addTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    setTransactions(prev => [newTransaction, ...prev])
  }

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(prev => prev.map(transaction => 
      transaction.id === id ? { ...transaction, ...updates } : transaction
    ))
  }

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id))
  }

  // Category management
  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString()
    }
    setCategories(prev => [newCategory, ...prev])
  }

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories(prev => prev.map(category => 
      category.id === id ? { ...category, ...updates } : category
    ))
  }

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(category => category.id !== id))
  }

  // Financial Goals
  const addFinancialGoal = (goal: Omit<FinancialGoal, 'id' | 'createdAt'>) => {
    const newGoal: FinancialGoal = {
      ...goal,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    setFinancialGoals(prev => [newGoal, ...prev])
  }

  const updateFinancialGoal = (id: string, updates: Partial<FinancialGoal>) => {
    setFinancialGoals(prev => prev.map(goal => goal.id === id ? { ...goal, ...updates } : goal))
  }

  const deleteFinancialGoal = (id: string) => {
    setFinancialGoals(prev => prev.filter(goal => goal.id !== id))
  }

  // Wishlist
  const addWishlistItem = (item: Omit<WishlistItem, 'id' | 'createdAt'>) => {
    const newItem: WishlistItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    setWishlistItems(prev => [newItem, ...prev])
  }

  const updateWishlistItem = (id: string, updates: Partial<WishlistItem>) => {
    setWishlistItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item))
  }

  const deleteWishlistItem = (id: string) => {
    setWishlistItems(prev => prev.filter(item => item.id !== id))
  }

  // Piggy Bank
  const addPiggyBankEntry = (entry: Omit<PiggyBankEntry, 'id' | 'createdAt'>) => {
    const newEntry: PiggyBankEntry = {
      ...entry,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    setPiggyBankEntries(prev => [newEntry, ...prev])
  }

  const deletePiggyBankEntry = (id: string) => {
    setPiggyBankEntries(prev => prev.filter(entry => entry.id !== id))
  }

  // Debts
  const addDebt = (debt: Omit<Debt, 'id' | 'createdAt'>) => {
    const newDebt: Debt = {
      ...debt,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    setDebts(prev => [newDebt, ...prev])
  }

  const updateDebt = (id: string, updates: Partial<Debt>) => {
    setDebts(prev => prev.map(debt => debt.id === id ? { ...debt, ...updates } : debt))
  }

  const deleteDebt = (id: string) => {
    setDebts(prev => prev.filter(debt => debt.id !== id))
  }

  // Credit Cards
  const addCreditCard = (card: Omit<CreditCard, 'id' | 'createdAt'>) => {
    const newCard: CreditCard = {
      ...card,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    setCreditCards(prev => [newCard, ...prev])
  }

  const updateCreditCard = (id: string, updates: Partial<CreditCard>) => {
    setCreditCards(prev => prev.map(card => card.id === id ? { ...card, ...updates } : card))
  }

  const deleteCreditCard = (id: string) => {
    setCreditCards(prev => prev.filter(card => card.id !== id))
  }

  // Fixed Expenses
  const addFixedExpense = (expense: Omit<FixedExpense, 'id' | 'createdAt'>) => {
    const newExpense: FixedExpense = {
      ...expense,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    setFixedExpenses(prev => [newExpense, ...prev])
  }

  const updateFixedExpense = (id: string, updates: Partial<FixedExpense>) => {
    setFixedExpenses(prev => prev.map(expense => 
      expense.id === id ? { ...expense, ...updates } : expense
    ))
  }

  const deleteFixedExpense = (id: string) => {
    setFixedExpenses(prev => prev.filter(expense => expense.id !== id))
  }

  // Calculate totals
  const getPiggyBankTotal = () => {
    return piggyBankEntries.reduce((sum, entry) => sum + entry.amount, 0)
  }

  const getTotalDebt = () => {
    return debts.filter(debt => debt.status === 'active').reduce((sum, debt) => sum + debt.currentAmount, 0)
  }

  const getTotalInvestments = () => {
    return investments.reduce((sum, investment) => sum + investment.currentValue, 0)
  }

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
  }
}
