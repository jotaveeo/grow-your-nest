
import React, { createContext, useContext } from 'react'
import { useFinance } from '@/hooks/useFinance'

const FinanceContext = createContext<ReturnType<typeof useFinance> | null>(null)

export const useFinanceContext = () => {
  const context = useContext(FinanceContext)
  if (!context) {
    throw new Error('useFinanceContext must be used within a FinanceProvider')
  }
  return context
}

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const financeData = useFinance()
  
  return (
    <FinanceContext.Provider value={financeData}>
      {children}
    </FinanceContext.Provider>
  )
}
