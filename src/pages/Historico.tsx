
import { useState } from "react"
import { useFinanceContext } from "@/contexts/FinanceContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Download, Eye, Trash2 } from "lucide-react"

const Historico = () => {
  const { transactions } = useFinanceContext()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || transaction.type === filterType
    const matchesCategory = filterCategory === "all" || transaction.category?.name === filterCategory
    
    return matchesSearch && matchesType && matchesCategory
  })

  const categories = Array.from(new Set(transactions.map(t => t.category?.name).filter(Boolean)))

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 lg:p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
            Histórico de Transações
          </h1>
          <p className="text-sm lg:text-base text-muted-foreground">
            Visualize e gerencie todas as suas transações
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader className="px-4 lg:px-6 py-4">
            <CardTitle className="text-base lg:text-lg flex items-center gap-2">
              <Filter className="h-4 w-4 lg:h-5 lg:w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 lg:px-6 pb-4 lg:pb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar transações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="income">Receitas</SelectItem>
                  <SelectItem value="expense">Despesas</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category!}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Exportar</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Card>
          <CardHeader className="px-4 lg:px-6 py-4">
            <CardTitle className="text-base lg:text-lg">
              Transações ({filteredTransactions.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 lg:px-6 pb-4 lg:pb-6">
            <div className="space-y-3">
              {filteredTransactions.map((transaction, index) => (
                <div
                  key={index}
                  className="flex flex-col lg:flex-row lg:items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="text-lg flex-shrink-0">
                      {transaction.category?.icon || '💰'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm lg:text-base truncate">
                        {transaction.description}
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs lg:text-sm text-muted-foreground">
                        <span>{transaction.category?.name || 'Sem categoria'}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>{transaction.date}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between lg:justify-end gap-3">
                    <span
                      className={`text-sm lg:text-base font-semibold ${
                        transaction.type === 'income'
                          ? 'text-success'
                          : 'text-destructive'
                      }`}
                    >
                      {transaction.type === 'income' ? '+' : '-'}R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredTransactions.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-base lg:text-lg mb-2">Nenhuma transação encontrada</p>
                  <p className="text-sm">Tente ajustar os filtros ou adicionar novas transações</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Historico
