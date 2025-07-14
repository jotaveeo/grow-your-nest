import { useState } from "react"
import { useFinanceExtendedContext } from "@/contexts/FinanceExtendedContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ExpenseChart } from "@/components/ExpenseChart"
import { TrendChart } from "@/components/TrendChart"
import { BarChart3, FileText, Download, Calendar, TrendingUp, TrendingDown } from "lucide-react"
import { BackButton } from "@/components/BackButton"
import { useToast } from "@/hooks/use-toast"

const Relatorios = () => {
  const { transactions, categories } = useFinanceExtendedContext()
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [selectedYear, setSelectedYear] = useState("2024")
  const [selectedMonth, setSelectedMonth] = useState("01")
  const { toast } = useToast()

  // Create getCategoryData function to match the expected format
  const getCategoryData = () => {
    const categoryData = categories.map(category => {
      const categoryTransactions = transactions.filter(t => t.category === category.name)
      const amount = categoryTransactions.reduce((sum, t) => sum + (t.type === 'expense' ? t.amount : 0), 0)
      return {
        ...category,
        amount,
        type: category.type
      }
    }).filter(item => item.amount > 0)
    
    return categoryData
  }

  const categoryExpenses = getCategoryData().filter(item => item.type === 'expense')

  const monthlyExpenses = [
    { month: 'Jan', income: 5000, expenses: 3200 },
    { month: 'Fev', income: 5200, expenses: 3100 },
    { month: 'Mar', income: 4800, expenses: 3400 },
    { month: 'Abr', income: 5100, expenses: 3300 },
    { month: 'Mai', income: 5300, expenses: 3500 },
    { month: 'Jun', income: 5000, expenses: 3200 }
  ]

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const generateReport = () => {
    // Simular geração de relatório com feedback
    toast({
      title: "Relatório Gerado com Sucesso!",
      description: `Relatório ${selectedPeriod === 'month' ? 'mensal' : selectedPeriod === 'quarter' ? 'trimestral' : 'anual'} de ${selectedYear} foi processado.`,
    })
    
    // Simular download
    const reportContent = `
Relatório Financeiro - ${selectedPeriod} ${selectedYear}
==========================================

Total de Receitas: R$ ${totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
Total de Despesas: R$ ${totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
Saldo Líquido: R$ ${(totalIncome - totalExpenses).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
Total de Transações: ${transactions.length}

Gerado em: ${new Date().toLocaleDateString('pt-BR')}
    `
    
    const blob = new Blob([reportContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `relatorio-${selectedPeriod}-${selectedYear}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const exportCSV = () => {
    const csv = [
      "Categoria,Valor",
      ...categoryExpenses.map(c => `"${c.name}",${c.amount}`)
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relatorio-${selectedPeriod}-${selectedYear}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 lg:p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <BackButton />
        </div>

        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
            Relatórios Financeiros
          </h1>
          <p className="text-sm lg:text-base text-muted-foreground">
            Análise detalhada das suas finanças
          </p>
        </div>

        {/* Controls */}
        <Card className="mb-6">
          <CardHeader className="px-4 lg:px-6 py-4">
            <CardTitle className="text-base lg:text-lg flex items-center gap-2">
              <Calendar className="h-4 w-4 lg:h-5 lg:w-5" />
              Período do Relatório
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 lg:px-6 pb-4 lg:pb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 sm:flex-none">
                <label className="text-sm font-medium mb-2 block">Período</label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">Mensal</SelectItem>
                    <SelectItem value="quarter">Trimestral</SelectItem>
                    <SelectItem value="year">Anual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 sm:flex-none">
                <label className="text-sm font-medium mb-2 block">Ano</label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 sm:flex-none">
                <label className="text-sm font-medium mb-2 block">Mês</label>
                <Select
                  value={selectedMonth}
                  onValueChange={setSelectedMonth}
                  disabled={selectedPeriod !== "month"}
                >
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="Mês" />
                  </SelectTrigger>
                  <SelectContent>
                    {["01","02","03","04","05","06","07","08","09","10","11","12"].map(m => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={generateReport} className="flex items-center gap-2 w-full sm:w-auto hover-scale">
                <Download className="h-4 w-4" />
                <span>Gerar Relatório</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <Card className="border-l-4 border-l-success">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs lg:text-sm font-medium text-muted-foreground">Total Receitas</p>
                  <p className="text-lg lg:text-2xl font-bold text-success">
                    R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-destructive">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs lg:text-sm font-medium text-muted-foreground">Total Despesas</p>
                  <p className="text-lg lg:text-2xl font-bold text-destructive">
                    R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <TrendingDown className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs lg:text-sm font-medium text-muted-foreground">Saldo Líquido</p>
                  <p className={`text-lg lg:text-2xl font-bold ${
                    totalIncome - totalExpenses >= 0 ? 'text-success' : 'text-destructive'
                  }`}>
                    R$ {(totalIncome - totalExpenses).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-warning">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs lg:text-sm font-medium text-muted-foreground">Transações</p>
                  <p className="text-lg lg:text-2xl font-bold">
                    {transactions.length}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <div>
            <ExpenseChart
              data={categoryExpenses}
              title="Despesas por Categoria"
            />
          </div>
          <div>
            <TrendChart
              data={monthlyExpenses}
              title="Evolução Temporal"
            />
          </div>
        </div>

        {/* Detailed Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <Card>
            <CardHeader className="px-4 lg:px-6 py-4">
              <CardTitle className="text-base lg:text-lg">Top Categorias de Gastos</CardTitle>
            </CardHeader>
            <CardContent className="px-4 lg:px-6 pb-4 lg:pb-6">
              <div className="space-y-3">
                {categoryExpenses.slice(0, 5).map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{category.icon}</span>
                      <span className="font-medium text-sm lg:text-base">{category.name}</span>
                    </div>
                    <span className="text-sm lg:text-base font-semibold text-destructive">
                      R$ {category.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="px-4 lg:px-6 py-4">
              <CardTitle className="text-base lg:text-lg">Insights Financeiros</CardTitle>
            </CardHeader>
            <CardContent className="px-4 lg:px-6 pb-4 lg:pb-6">
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    💡 Dica de Economia
                  </p>
                  <p className="text-xs lg:text-sm text-blue-700 dark:text-blue-200 mt-1">
                    Suas maiores despesas estão em alimentação. Considere planejar refeições.
                  </p>
                </div>

                <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-sm font-medium text-green-900 dark:text-green-100">
                    ✅ Ponto Positivo
                  </p>
                  <p className="text-xs lg:text-sm text-green-700 dark:text-green-200 mt-1">
                    Você conseguiu manter um saldo positivo este mês!
                  </p>
                </div>

                <div className="p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200 dark:border-orange-800">
                  <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
                    ⚠️ Atenção
                  </p>
                  <p className="text-xs lg:text-sm text-orange-700 dark:text-orange-200 mt-1">
                    Gastos com entretenimento aumentaram 15% em relação ao mês anterior.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Relatorios
