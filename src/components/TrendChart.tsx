
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useFinanceContext } from '@/contexts/FinanceContext'

interface TrendChartProps {
  data?: any[]
  title?: string
}

export const TrendChart = ({ data: propData, title = "Evolução Mensal" }: TrendChartProps) => {
  const { transactions } = useFinanceContext()

  // Use prop data if provided, otherwise generate from transactions
  const chartData = propData || (() => {
    // Group transactions by month
    const monthlyData = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date)
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      
      if (!acc[monthYear]) {
        acc[monthYear] = {
          month: new Date(date.getFullYear(), date.getMonth(), 1).toLocaleDateString('pt-BR', { 
            month: 'short', 
            year: 'numeric' 
          }),
          receitas: 0,
          despesas: 0,
          saldo: 0
        }
      }
      
      if (transaction.type === 'income') {
        acc[monthYear].receitas += transaction.amount
      } else {
        acc[monthYear].despesas += transaction.amount
      }
      
      acc[monthYear].saldo = acc[monthYear].receitas - acc[monthYear].despesas
      
      return acc
    }, {} as Record<string, any>)

    return Object.values(monthlyData).sort((a: any, b: any) => 
      new Date(a.month).getTime() - new Date(b.month).getTime()
    )
  })()

  // Transform data format if needed (for backward compatibility)
  const transformedData = chartData.map((item: any) => {
    if (item.income !== undefined && item.expenses !== undefined) {
      return {
        month: item.month,
        receitas: item.income,
        despesas: item.expenses,
        saldo: item.income - item.expenses
      }
    }
    return item
  })

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: R$ {entry.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  if (!transformedData || transformedData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Nenhum dado disponível</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={transformedData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="month" 
              className="text-xs"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `R$ ${value.toLocaleString('pt-BR', { 
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              })}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="receitas" 
              stroke="#10B981" 
              strokeWidth={2}
              name="Receitas"
              dot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="despesas" 
              stroke="#EF4444" 
              strokeWidth={2}
              name="Despesas"
              dot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="saldo" 
              stroke="#3B82F6" 
              strokeWidth={2}
              name="Saldo"
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
