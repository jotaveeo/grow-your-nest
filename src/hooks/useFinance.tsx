
import { useState, useEffect } from 'react'

export interface Transaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  description: string
  category: string
  date: string
  createdAt: string
}

export interface Category {
  id: string
  name: string
  icon: string
  color: string
  type: 'income' | 'expense' | 'both'
}

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

export const useFinance = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>(defaultCategories)

  // Load data from localStorage on mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem('financeflow_transactions')
    const savedCategories = localStorage.getItem('financeflow_categories')
    
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions))
    }
    
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories))
    }
  }, [])

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('financeflow_transactions', JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    localStorage.setItem('financeflow_categories', JSON.stringify(categories))
  }, [categories])

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setTransactions(prev => [newTransaction, ...prev])
  }

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(prev => 
      prev.map(t => t.id === id ? { ...t, ...updates } : t)
    )
  }

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id))
  }

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
    }
    setCategories(prev => [...prev, newCategory])
  }

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories(prev => 
      prev.map(c => c.id === id ? { ...c, ...updates } : c)
    )
  }

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id))
  }

  // Calculate summary
  const getSummary = (period?: { start: string; end: string }) => {
    let filteredTransactions = transactions
    
    if (period) {
      filteredTransactions = transactions.filter(t => 
        t.date >= period.start && t.date <= period.end
      )
    }

    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const expenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
    
    return {
      income,
      expenses,
      balance: income - expenses,
      transactionCount: filteredTransactions.length
    }
  }

  const getCategoryData = (period?: { start: string; end: string }) => {
    let filteredTransactions = transactions
    
    if (period) {
      filteredTransactions = transactions.filter(t => 
        t.date >= period.start && t.date <= period.end
      )
    }

    const categoryTotals = filteredTransactions.reduce((acc, transaction) => {
      const category = categories.find(c => c.name === transaction.category)
      if (!category) return acc
      
      if (!acc[transaction.category]) {
        acc[transaction.category] = {
          name: transaction.category,
          amount: 0,
          color: category.color,
          icon: category.icon,
          type: transaction.type
        }
      }
      
      acc[transaction.category].amount += transaction.amount
      return acc
    }, {} as Record<string, any>)

    return Object.values(categoryTotals)
  }

  return {
    transactions,
    categories,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    updateCategory,
    deleteCategory,
    getSummary,
    getCategoryData,
  }
}
