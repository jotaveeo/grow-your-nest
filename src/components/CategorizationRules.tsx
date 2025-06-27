
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Plus, Edit, Trash2, Target, TrendingUp } from 'lucide-react'
import { useAutoCategorization } from '@/hooks/useAutoCategorization'
import { useFinanceExtendedContext } from '@/contexts/FinanceExtendedContext'
import { useToast } from '@/hooks/use-toast'

export const CategorizationRules = () => {
  const { rules, historyPatterns, addRule, updateRule, deleteRule } = useAutoCategorization()
  const { categories } = useFinanceExtendedContext()
  const { toast } = useToast()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRule, setEditingRule] = useState<string | null>(null)
  const [newRule, setNewRule] = useState({
    name: '',
    keywords: '',
    category: '',
    type: 'expense' as 'income' | 'expense' | 'both',
    isActive: true,
    priority: 1
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newRule.name || !newRule.keywords || !newRule.category) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha todos os campos obrigatórios.',
        variant: 'destructive'
      })
      return
    }

    const keywordsArray = newRule.keywords.split(',').map(k => k.trim()).filter(k => k.length > 0)
    
    if (editingRule) {
      updateRule(editingRule, {
        ...newRule,
        keywords: keywordsArray
      })
      toast({
        title: 'Regra atualizada',
        description: 'A regra foi editada com sucesso.'
      })
    } else {
      addRule({
        ...newRule,
        keywords: keywordsArray
      })
      toast({
        title: 'Regra criada',
        description: 'A nova regra foi adicionada com sucesso.'
      })
    }

    setNewRule({ name: '', keywords: '', category: '', type: 'expense', isActive: true, priority: 1 })
    setEditingRule(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (rule: any) => {
    setNewRule({
      name: rule.name,
      keywords: rule.keywords.join(', '),
      category: rule.category,
      type: rule.type,
      isActive: rule.isActive,
      priority: rule.priority
    })
    setEditingRule(rule.id)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    deleteRule(id)
    toast({
      title: 'Regra excluída',
      description: 'A regra foi removida com sucesso.'
    })
  }

  const toggleRuleStatus = (id: string, isActive: boolean) => {
    updateRule(id, { isActive })
  }

  return (
    <div className="space-y-6">
      {/* Header com botão de nova regra */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Regras de Categorização</h3>
          <p className="text-sm text-muted-foreground">
            Configure regras automáticas baseadas em palavras-chave
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Regra
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingRule ? 'Editar Regra' : 'Nova Regra de Categorização'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Nome da Regra</Label>
                <Input
                  value={newRule.name}
                  onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Uber e 99"
                />
              </div>
              
              <div>
                <Label>Palavras-chave (separadas por vírgula)</Label>
                <Input
                  value={newRule.keywords}
                  onChange={(e) => setNewRule(prev => ({ ...prev, keywords: e.target.value }))}
                  placeholder="uber, 99, taxi"
                />
              </div>
              
              <div>
                <Label>Categoria</Label>
                <Select
                  value={newRule.category}
                  onValueChange={(value) => setNewRule(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.icon} {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Tipo</Label>
                <Select
                  value={newRule.type}
                  onValueChange={(value: 'income' | 'expense' | 'both') => 
                    setNewRule(prev => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expense">Apenas Despesas</SelectItem>
                    <SelectItem value="income">Apenas Receitas</SelectItem>
                    <SelectItem value="both">Ambos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={newRule.isActive}
                  onCheckedChange={(checked) => setNewRule(prev => ({ ...prev, isActive: checked }))}
                />
                <Label>Regra ativa</Label>
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingRule ? 'Salvar' : 'Criar Regra'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Regras */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Regras Configuradas ({rules.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {rules.map(rule => (
              <div key={rule.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{rule.name}</span>
                    <Badge variant={rule.isActive ? 'default' : 'secondary'}>
                      {rule.isActive ? 'Ativa' : 'Inativa'}
                    </Badge>
                    <Badge variant="outline">{rule.category}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Palavras-chave: {rule.keywords.join(', ')}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch
                    checked={rule.isActive}
                    onCheckedChange={(checked) => toggleRuleStatus(rule.id, checked)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(rule)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(rule.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            {rules.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Nenhuma regra configurada</p>
                <p className="text-sm">Crie sua primeira regra de categorização</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Padrões do Histórico */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Padrões do Histórico ({historyPatterns.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 max-h-60 overflow-y-auto">
            {historyPatterns
              .sort((a, b) => b.count - a.count)
              .slice(0, 10)
              .map((pattern, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                  <div>
                    <div className="font-medium text-sm truncate max-w-60">
                      {pattern.description}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {pattern.category} • Usado {pattern.count}x
                    </div>
                  </div>
                  <Badge variant="outline">{pattern.count}</Badge>
                </div>
              ))}
              
            {historyPatterns.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                <p className="text-sm">Nenhum padrão encontrado no histórico</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
