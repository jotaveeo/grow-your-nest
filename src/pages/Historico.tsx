
import { useState } from "react"
import { useFinanceExtendedContext } from "@/contexts/FinanceExtendedContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Search, Filter, Trash2, Edit, Calendar } from "lucide-react"
import { BackButton } from "@/components/BackButton"
import { useToast } from "@/hooks/use-toast"

const Historico = () => {
  const { transactions, categories, deleteTransaction, updateTransaction } = useFinanceExtendedContext()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const [editingTransaction, setEditingTransaction] = useState<any>(null)
  const [editForm, setEditForm] = useState({
    type: "expense" as "income" | "expense",
    amount: "",
    description: "",
    category: "",
    date: "",
  })

  const filteredTransactions = transactions.filter(transaction => {
    const category = categories.find(c => c.name === transaction.category)
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (category?.name.toLowerCase().includes(searchTerm.toLowerCase()) || false)
    const matchesType = filterType === "all" || transaction.type === filterType
    const matchesCategory = filterCategory === "all" || transaction.category === filterCategory

    return matchesSearch && matchesType && matchesCategory
  })

  const handleDelete = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta transação?")) {
      deleteTransaction(id)
      toast({
        title: "Transação excluída",
        description: "A transação foi removida com sucesso.",
      })
    }
  }

  const handleEdit = (transaction: any) => {
    setEditingTransaction(transaction)
    setEditForm({
      type: transaction.type,
      amount: transaction.amount.toString(),
      description: transaction.description,
      category: transaction.category,
      date: transaction.date,
    })
  }

  const handleUpdateTransaction = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, {
        type: editForm.type,
        amount: parseFloat(editForm.amount),
        description: editForm.description,
        category: editForm.category,
        date: editForm.date,
      })
      setEditingTransaction(null)
      toast({
        title: "Transação atualizada",
        description: "A transação foi editada com sucesso.",
      })
    }
  }

  const filteredCategories = categories.filter(
    (cat) => cat.type === editForm.type || cat.type === "both"
  )

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <div className="container mx-auto p-4 lg:p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4 animate-slide-in-left">
          <BackButton />
        </div>

        <div className="mb-6 lg:mb-8 animate-slide-in-left" style={{ animationDelay: "100ms" }}>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
            Histórico de Transações
          </h1>
          <p className="text-sm lg:text-base text-muted-foreground">
            Visualize e gerencie todas as suas transações
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6 animate-scale-in" style={{ animationDelay: "200ms" }}>
          <CardHeader className="px-4 lg:px-6 py-4">
            <CardTitle className="text-base lg:text-lg flex items-center gap-2">
              <Filter className="h-4 w-4 lg:h-5 lg:w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 lg:px-6 pb-4 lg:pb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.icon} {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Card className="animate-scale-in" style={{ animationDelay: "300ms" }}>
          <CardHeader className="px-4 lg:px-6 py-4">
            <CardTitle className="text-base lg:text-lg flex items-center gap-2">
              <Calendar className="h-4 w-4 lg:h-5 lg:w-5" />
              Transações ({filteredTransactions.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 lg:px-6 pb-4 lg:pb-6">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhuma transação encontrada</p>
                <p className="text-sm mt-1">Tente ajustar os filtros ou adicione uma nova transação</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTransactions.map((transaction) => {
                  const category = categories.find(c => c.name === transaction.category)
                  return (
                    <div
                      key={transaction.id}
                      className="flex flex-col lg:flex-row lg:items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors border hover-lift"
                    >
                      <div className="flex items-start lg:items-center gap-3 mb-3 lg:mb-0 flex-1">
                        <div className="text-xl mt-1 lg:mt-0">{category?.icon || '💰'}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                            <h3 className="font-medium text-sm lg:text-base truncate">
                              {transaction.description}
                            </h3>
                            <Badge 
                              variant={transaction.type === 'income' ? 'default' : 'destructive'}
                              className="text-xs w-fit"
                            >
                              {transaction.type === 'income' ? 'Receita' : 'Despesa'}
                            </Badge>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs lg:text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              {category?.name || 'Sem categoria'}
                            </span>
                            <span>{transaction.date}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between lg:justify-end gap-3">
                        <span
                          className={`text-lg lg:text-xl font-bold ${
                            transaction.type === 'income'
                              ? 'text-success'
                              : 'text-destructive'
                          }`}
                        >
                          {transaction.type === 'income' ? '+' : '-'}R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleEdit(transaction)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleDelete(transaction.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={!!editingTransaction} onOpenChange={() => setEditingTransaction(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Transação</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateTransaction} className="space-y-4 py-2">
              <div>
                <Label htmlFor="edit-type">Tipo</Label>
                <Select
                  value={editForm.type}
                  onValueChange={(value: "income" | "expense") =>
                    setEditForm(prev => ({ ...prev, type: value, category: "" }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Receita</SelectItem>
                    <SelectItem value="expense">Despesa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-amount">Valor</Label>
                <Input
                  id="edit-amount"
                  type="number"
                  step="0.01"
                  value={editForm.amount}
                  onChange={(e) => setEditForm(prev => ({ ...prev, amount: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-category">Categoria</Label>
                <Select
                  value={editForm.category}
                  onValueChange={(value) => setEditForm(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCategories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.icon} {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-description">Descrição</Label>
                <Textarea
                  id="edit-description"
                  value={editForm.description}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-date">Data</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={editForm.date}
                  onChange={(e) => setEditForm(prev => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">Salvar</Button>
                <Button type="button" variant="outline" onClick={() => setEditingTransaction(null)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default Historico
