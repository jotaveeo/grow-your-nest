
import { useState } from "react"
import { useFinanceExtendedContext } from "@/contexts/FinanceExtendedContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Plus, TrendingUp, TrendingDown, DollarSign, Receipt } from "lucide-react"

const Calendario = () => {
  const { transactions } = useFinanceExtendedContext()
  const [selectedYear, setSelectedYear] = useState("2024")

  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ]

  const getMonthlyData = () => {
    return months.map((month, index) => {
      const monthTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date)
        return transactionDate.getMonth() === index && transactionDate.getFullYear() === parseInt(selectedYear)
      })

      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)

      const expenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)

      const balance = income - expenses

      return {
        month: `${month} ${selectedYear}`,
        income,
        expenses,
        balance,
        transactions: monthTransactions.length
      }
    })
  }

  const monthlyData = getMonthlyData()
  const totalIncome = monthlyData.reduce((sum, data) => sum + data.income, 0)
  const totalExpenses = monthlyData.reduce((sum, data) => sum + data.expenses, 0)
  const totalBalance = totalIncome - totalExpenses

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 lg:p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="h-8 w-8 text-primary" />
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              Controle do Ano - Mês por mês
            </h1>
          </div>
          <p className="text-sm lg:text-base text-muted-foreground">
            Acompanhe sua evolução financeira mês a mês
          </p>
        </div>

        {/* Year Selector */}
        <Card className="mb-6">
          <CardHeader className="px-4 lg:px-6 py-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base lg:text-lg flex items-center gap-2">
                <Calendar className="h-4 w-4 lg:h-5 lg:w-5" />
                {selectedYear}
              </CardTitle>
              <div className="flex gap-2">
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Nova
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Monthly Summary Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Mês</TableHead>
                    <TableHead className="text-right font-semibold">Total de Ganhos</TableHead>
                    <TableHead className="text-right font-semibold">Total Gastos Fixos</TableHead>
                    <TableHead className="text-right font-semibold">Total Gastos Variáveis</TableHead>
                    <TableHead className="text-right font-semibold">Total Dívidas</TableHead>
                    <TableHead className="text-right font-semibold">Balanço</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {monthlyData.map((data, index) => (
                    <TableRow key={index} className="hover:bg-muted/30">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-primary"></div>
                          {data.month}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium text-success">
                        R$ {data.income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right">
                        R$ 0,00
                      </TableCell>
                      <TableCell className="text-right font-medium text-destructive">
                        R$ {data.expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right">
                        R$ 0,00
                      </TableCell>
                      <TableCell className={`text-right font-bold ${
                        data.balance >= 0 ? 'text-success' : 'text-destructive'
                      }`}>
                        R$ {data.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Totals */}
            <div className="border-t bg-muted/30 p-4">
              <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">SOMA</p>
                  <p className="font-bold text-success">
                    R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">SOMA</p>
                  <p className="font-bold">R$ 0,00</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">SOMA</p>
                  <p className="font-bold text-destructive">
                    R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">SOMA</p>
                  <p className="font-bold">R$ 0,00</p>
                </div>
                <div className="text-center lg:col-start-6">
                  <p className="text-xs text-muted-foreground">TOTAL</p>
                  <p className={`font-bold text-lg ${
                    totalBalance >= 0 ? 'text-success' : 'text-destructive'
                  }`}>
                    R$ {totalBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mt-6">
          <Card className="border-l-4 border-l-success">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs lg:text-sm font-medium text-muted-foreground">Receitas Totais</p>
                  <p className="text-lg lg:text-xl font-bold text-success">
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
                  <p className="text-xs lg:text-sm font-medium text-muted-foreground">Despesas Totais</p>
                  <p className="text-lg lg:text-xl font-bold text-destructive">
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
                  <p className="text-xs lg:text-sm font-medium text-muted-foreground">Saldo Final</p>
                  <p className={`text-lg lg:text-xl font-bold ${
                    totalBalance >= 0 ? 'text-success' : 'text-destructive'
                  }`}>
                    R$ {totalBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-warning">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs lg:text-sm font-medium text-muted-foreground">Transações</p>
                  <p className="text-lg lg:text-xl font-bold">
                    {transactions.length}
                  </p>
                </div>
                <Receipt className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Calendario
