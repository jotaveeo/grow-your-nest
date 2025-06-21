
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Tag } from "lucide-react"

const Categorias = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: "Alimentação", icon: "🍕", color: "#ef4444", type: "expense" },
    { id: 2, name: "Transporte", icon: "🚗", color: "#3b82f6", type: "expense" },
    { id: 3, name: "Entretenimento", icon: "🎮", color: "#8b5cf6", type: "expense" },
    { id: 4, name: "Saúde", icon: "⚕️", color: "#10b981", type: "expense" },
    { id: 5, name: "Salário", icon: "💰", color: "#22c55e", type: "income" },
    { id: 6, name: "Freelance", icon: "💻", color: "#06b6d4", type: "income" },
  ])

  const [newCategory, setNewCategory] = useState({
    name: "",
    icon: "",
    color: "#3b82f6",
    type: "expense"
  })
  
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<number | null>(null)

  const handleAddCategory = () => {
    if (newCategory.name && newCategory.icon) {
      setCategories([
        ...categories,
        {
          id: Date.now(),
          ...newCategory
        }
      ])
      setNewCategory({ name: "", icon: "", color: "#3b82f6", type: "expense" })
      setIsDialogOpen(false)
    }
  }

  const handleDeleteCategory = (id: number) => {
    setCategories(categories.filter(cat => cat.id !== id))
  }

  const expenseCategories = categories.filter(cat => cat.type === "expense")
  const incomeCategories = categories.filter(cat => cat.type === "income")

  const CategoryCard = ({ category, onEdit, onDelete }: any) => (
    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
      <div className="flex items-center gap-3">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
          style={{ backgroundColor: category.color + '20' }}
        >
          {category.icon}
        </div>
        <div>
          <p className="font-medium text-sm lg:text-base">{category.name}</p>
          <p className="text-xs text-muted-foreground capitalize">{category.type === 'expense' ? 'Despesa' : 'Receita'}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onEdit(category.id)}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 text-destructive hover:text-destructive" 
          onClick={() => onDelete(category.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 lg:p-6 max-w-4xl">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                Gerenciar Categorias
              </h1>
              <p className="text-sm lg:text-base text-muted-foreground">
                Organize suas transações com categorias personalizadas
              </p>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2 w-full sm:w-auto">
                  <Plus className="h-4 w-4" />
                  Nova Categoria
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Criar Nova Categoria</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="name">Nome da Categoria</Label>
                    <Input
                      id="name"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                      placeholder="Ex: Alimentação"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="icon">Emoji/Ícone</Label>
                    <Input
                      id="icon"
                      value={newCategory.icon}
                      onChange={(e) => setNewCategory({...newCategory, icon: e.target.value})}
                      placeholder="🍕"
                      className="mt-1"
                      maxLength={2}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="color">Cor</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="color"
                        id="color"
                        value={newCategory.color}
                        onChange={(e) => setNewCategory({...newCategory, color: e.target.value})}
                        className="w-12 h-10 rounded border border-input"
                      />
                      <Input
                        value={newCategory.color}
                        onChange={(e) => setNewCategory({...newCategory, color: e.target.value})}
                        placeholder="#3b82f6"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label>Tipo</Label>
                    <div className="flex gap-2 mt-2">
                      <Button
                        type="button"
                        variant={newCategory.type === "expense" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setNewCategory({...newCategory, type: "expense"})}
                        className="flex-1"
                      >
                        Despesa
                      </Button>
                      <Button
                        type="button"
                        variant={newCategory.type === "income" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setNewCategory({...newCategory, type: "income"})}
                        className="flex-1"
                      >
                        Receita
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddCategory}>
                    Criar Categoria
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Expense Categories */}
          <Card>
            <CardHeader className="px-4 lg:px-6 py-4">
              <CardTitle className="text-base lg:text-lg flex items-center gap-2">
                <Tag className="h-4 w-4 lg:h-5 lg:w-5 text-destructive" />
                Categorias de Despesas ({expenseCategories.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 lg:px-6 pb-4 lg:pb-6">
              <div className="space-y-3">
                {expenseCategories.map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    onEdit={(id: number) => setEditingCategory(id)}
                    onDelete={handleDeleteCategory}
                  />
                ))}
                {expenseCategories.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Nenhuma categoria de despesa</p>
                    <p className="text-sm mt-1">Crie sua primeira categoria</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Income Categories */}
          <Card>
            <CardHeader className="px-4 lg:px-6 py-4">
              <CardTitle className="text-base lg:text-lg flex items-center gap-2">
                <Tag className="h-4 w-4 lg:h-5 lg:w-5 text-success" />
                Categorias de Receitas ({incomeCategories.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 lg:px-6 pb-4 lg:pb-6">
              <div className="space-y-3">
                {incomeCategories.map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    onEdit={(id: number) => setEditingCategory(id)}
                    onDelete={handleDeleteCategory}
                  />
                ))}
                {incomeCategories.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Nenhuma categoria de receita</p>
                    <p className="text-sm mt-1">Crie sua primeira categoria</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Usage Stats */}
        <Card className="mt-6">
          <CardHeader className="px-4 lg:px-6 py-4">
            <CardTitle className="text-base lg:text-lg">Estatísticas de Uso</CardTitle>
          </CardHeader>
          <CardContent className="px-4 lg:px-6 pb-4 lg:pb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-primary">{categories.length}</p>
                <p className="text-sm text-muted-foreground">Total de Categorias</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-destructive">{expenseCategories.length}</p>
                <p className="text-sm text-muted-foreground">Categorias de Despesa</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-success">{incomeCategories.length}</p>
                <p className="text-sm text-muted-foreground">Categorias de Receita</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-warning">0</p>
                <p className="text-sm text-muted-foreground">Categorias Não Utilizadas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Categorias
