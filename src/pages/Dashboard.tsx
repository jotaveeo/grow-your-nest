
import { useFinanceExtendedContext } from "@/contexts/FinanceExtendedContext"
import { SummaryCard } from "@/components/SummaryCard"
import { ExpenseChart } from "@/components/ExpenseChart"
import { TrendChart } from "@/components/TrendChart"
import { TrendingUp, TrendingDown, DollarSign, CreditCard } from "lucide-react"

const Dashboard = () => {
  const { transactions, categories } = useFinanceExtendedContext()

  // Calculate balance
  const getBalance = () => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
    
    return income - expenses
  }

  // Get category expenses for charts
  const getCategoryExpenses = () => {
    const categoryTotals = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, transaction) => {
        const category = categories.find(c => c.name === transaction.category)
        if (!category) return acc
        
        if (!acc[transaction.category]) {
          acc[transaction.category] = {
            name: transaction.category,
            amount: 0,
            color: category.color,
            icon: category.icon,
            type: 'expense'
          }
        }
        
        acc[transaction.category].amount += transaction.amount
        return acc
      }, {} as Record<string, any>)

    return Object.values(categoryTotals)
  }

  // Get monthly expenses for trend chart
  const getMonthlyExpenses = () => {
    return [
      { month: 'Jan', income: 5000, expenses: 3200 },
      { month: 'Fev', income: 5200, expenses: 3100 },
      { month: 'Mar', income: 4800, expenses: 3400 },
      { month: 'Abr', income: 5100, expenses: 3300 },
      { month: 'Mai', income: 5300, expenses: 3500 },
      { month: 'Jun', income: 5000, expenses: 3200 }
    ]
  }

  const balance = getBalance()
  const monthlyExpenses = getMonthlyExpenses()
  const categoryExpenses = getCategoryExpenses()

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 lg:p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
            Dashboard Financeiro
          </h1>
          <p className="text-sm lg:text-base text-muted-foreground">
            Acompanhe suas finanças de forma inteligente
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <SummaryCard
            title="Saldo Total"
            value={`R$ ${balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            icon={DollarSign}
            className={balance >= 0 ? "border-l-4 border-l-success" : "border-l-4 border-l-destructive"}
          />
          <SummaryCard
            title="Receitas"
            value={`R$ ${totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            icon={TrendingUp}
            className="border-l-4 border-l-success"
          />
          <SummaryCard
            title="Despesas"
            value={`R$ ${totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            icon={TrendingDown}
            className="border-l-4 border-l-destructive"
          />
          <SummaryCard
            title="Transações"
            value={transactions.length.toString()}
            icon={CreditCard}
            className="border-l-4 border-l-primary"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <div className="w-full">
            <ExpenseChart
              data={categoryExpenses}
              title="Gastos por Categoria"
            />
          </div>
          <div className="w-full">
            <TrendChart
              data={monthlyExpenses}
              title="Evolução Mensal"
            />
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-card rounded-lg border shadow-sm">
          <div className="p-4 lg:p-6">
            <h3 className="text-lg lg:text-xl font-semibold mb-4">Transações Recentes</h3>
            <div className="space-y-3">
              {transactions.slice(0, 5).map((transaction, index) => {
                const category = categories.find(c => c.name === transaction.category)
                return (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 lg:p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-2 sm:mb-0">
                      <div className="text-lg">{category?.icon || '💰'}</div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm lg:text-base truncate">
                          {transaction.description}
                        </p>
                        <p className="text-xs lg:text-sm text-muted-foreground">
                          {category?.name || 'Sem categoria'} • {transaction.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-2">
                      <span
                        className={`text-sm lg:text-base font-semibold ${
                          transaction.type === 'income'
                            ? 'text-success'
                            : 'text-destructive'
                        }`}
                      >
                        {transaction.type === 'income' ? '+' : '-'}R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                )
              })}
              {transactions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Nenhuma transação encontrada</p>
                  <p className="text-sm mt-1">Comece adicionando uma nova transação</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
