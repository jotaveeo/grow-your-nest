
import { ArrowDownIcon, ArrowUpIcon, PlusCircle, TrendingUp, Wallet } from "lucide-react"
import { SummaryCard } from "@/components/SummaryCard"
import { ExpenseChart } from "@/components/ExpenseChart"
import { TrendChart } from "@/components/TrendChart"
import { Button } from "@/components/ui/button"
import { useFinanceContext } from "@/contexts/FinanceContext"
import { Link } from "react-router-dom"

const Dashboard = () => {
  const { getSummary, getCategoryData } = useFinanceContext()
  
  // Get current month data
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]
  
  const summary = getSummary({ start: startOfMonth, end: endOfMonth })
  const categoryData = getCategoryData({ start: startOfMonth, end: endOfMonth })
  
  const expenseData = categoryData.filter(item => item.type === 'expense')
  const incomeData = categoryData.filter(item => item.type === 'income')

  return (
    <div className="p-6 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral das suas finanças em {new Date().toLocaleDateString('pt-BR', { 
              month: 'long', 
              year: 'numeric' 
            })}
          </p>
        </div>
        <Button asChild className="w-fit">
          <Link to="/lancamento">
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Lançamento
          </Link>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Receitas"
          value={`R$ ${summary.income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={ArrowUpIcon}
          className="border-l-4 border-l-success"
        />
        <SummaryCard
          title="Despesas"
          value={`R$ ${summary.expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={ArrowDownIcon}
          className="border-l-4 border-l-destructive"
        />
        <SummaryCard
          title="Saldo"
          value={`R$ ${summary.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={Wallet}
          className={`border-l-4 ${summary.balance >= 0 ? 'border-l-success' : 'border-l-destructive'}`}
        />
        <SummaryCard
          title="Transações"
          value={summary.transactionCount.toString()}
          icon={TrendingUp}
          className="border-l-4 border-l-primary"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ExpenseChart 
          data={expenseData} 
          title="Despesas por Categoria" 
        />
        <ExpenseChart 
          data={incomeData} 
          title="Receitas por Categoria" 
        />
      </div>

      {/* Trend Chart */}
      <TrendChart />

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Ações Rápidas</h3>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" asChild>
            <Link to="/lancamento">Adicionar Transação</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/importar">Importar Planilha</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/relatorios">Ver Relatórios</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/categorias">Gerenciar Categorias</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
