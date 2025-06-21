
import { useState } from "react"
import { useFinanceExtendedContext } from "@/contexts/FinanceExtendedContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Shield, AlertTriangle } from "lucide-react"

const Limites = () => {
  const { transactions, categories } = useFinanceExtendedContext()
  const [selectedMonth] = useState(new Date().getMonth())
  const [selectedYear] = useState(new Date().getFullYear())

  // Calcular gastos por categoria no mês atual
  const getCategoryLimits = () => {
    return categories.filter(cat => cat.type === 'expense').map(category => {
      const categoryTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date)
        return t.category === category.name && 
               t.type === 'expense' &&
               transactionDate.getMonth() === selectedMonth &&
               transactionDate.getFullYear() === selectedYear
      })

      const spent = categoryTransactions.reduce((sum, t) => sum + t.amount, 0)
      
      // Definir limites fictícios para demonstração (em uma aplicação real, isso viria do estado)
      const limits = {
        'Alimentação': 800,
        'Transporte': 400,
        'Lazer': 300,
        'Saúde': 200,
        'Educação': 150,
        'Casa': 500
      }

      const budget = limits[category.name as keyof typeof limits] || 300
      const percentage = budget > 0 ? (spent / budget) * 100 : 0
      const remaining = budget - spent

      return {
        ...category,
        spent,
        budget,
        percentage: Math.min(percentage, 100),
        remaining,
        transactions: categoryTransactions.length,
        status: percentage >= 100 ? 'exceeded' : percentage >= 80 ? 'warning' : 'safe'
      }
    })
  }

  const categoryLimits = getCategoryLimits()
  const safeCategories = categoryLimits.filter(cat => cat.status === 'safe')
  const warningCategories = categoryLimits.filter(cat => cat.status === 'warning')
  const exceededCategories = categoryLimits.filter(cat => cat.status === 'exceeded')

  const KanbanColumn = ({ title, categories, bgColor, textColor, icon: Icon }) => (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className={`text-base flex items-center gap-2 ${textColor}`}>
          <Icon className="h-4 w-4" />
          {title}
          <Badge variant="secondary" className="ml-auto">
            {categories.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {categories.map((category) => (
          <Card key={category.id} className={`border-l-4 ${bgColor} hover:shadow-md transition-shadow`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{category.icon}</span>
                  <div>
                    <h3 className="font-semibold text-sm">{category.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {category.transactions} transações
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Gasto total:</span>
                  <span className="font-semibold text-destructive">
                    R$ {category.spent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Orçamento:</span>
                  <span className="font-semibold">
                    R$ {category.budget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <Progress 
                  value={category.percentage} 
                  className="h-2"
                />
                <div className="flex justify-between text-xs">
                  <span className={category.remaining >= 0 ? 'text-success' : 'text-destructive'}>
                    {category.remaining >= 0 ? 'Restante:' : 'Excesso:'}
                  </span>
                  <span className={`font-semibold ${category.remaining >= 0 ? 'text-success' : 'text-destructive'}`}>
                    R$ {Math.abs(category.remaining).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="text-center">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    category.status === 'safe' ? 'bg-green-100 text-green-800' :
                    category.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {category.percentage.toFixed(0)}% utilizado
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {categories.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">Nenhuma categoria neste status</p>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 lg:p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              Gerenciar Categorias
            </h1>
          </div>
          <p className="text-sm lg:text-base text-muted-foreground">
            Organize suas transações com categorias personalizadas e acompanhe seus limites
          </p>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-muted-foreground">
            Período: {new Date(selectedYear, selectedMonth).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nova Categoria
          </Button>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <KanbanColumn
            title="Dentro do Limite"
            categories={safeCategories}
            bgColor="border-l-green-500"
            textColor="text-green-700"
            icon={Shield}
          />
          
          <KanbanColumn
            title="Atenção (80%+)"
            categories={warningCategories}
            bgColor="border-l-yellow-500"
            textColor="text-yellow-700"
            icon={AlertTriangle}
          />
          
          <KanbanColumn
            title="Limite Excedido"
            categories={exceededCategories}
            bgColor="border-l-red-500"
            textColor="text-red-700"
            icon={AlertTriangle}
          />
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{safeCategories.length}</p>
                <p className="text-xs text-muted-foreground">Dentro do Limite</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{warningCategories.length}</p>
                <p className="text-xs text-muted-foreground">Em Atenção</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{exceededCategories.length}</p>
                <p className="text-xs text-muted-foreground">Limite Excedido</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {categoryLimits.reduce((sum, cat) => sum + cat.budget, 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
                <p className="text-xs text-muted-foreground">Orçamento Total</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Limites
