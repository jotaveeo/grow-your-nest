import { useState } from 'react'
import { useFinanceExtendedContext } from '@/contexts/FinanceExtendedContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Heart, Plus, Calendar, AlertTriangle, CheckCircle, X, ShoppingCart } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BackButton } from '@/components/BackButton'

const Wishlist = () => {
  const { wishlistItems, addWishlistItem, updateWishlistItem, deleteWishlistItem } = useFinanceExtendedContext()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    estimatedPrice: 0,
    reason: '',
    urgency: 'medium' as const,
    priority: 5,
    decisionDate: '',
    category: 'undefined' as const,
    status: 'thinking' as const
  })
  const [editingItem, setEditingItem] = useState<any>(null);

  const handleEdit = (item: any) => {
    setFormData({ ...item });
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || formData.estimatedPrice <= 0 || !formData.decisionDate) {
      // Exemplo de toast (adicione seu componente de toast)
      alert("Preencha todos os campos obrigatórios e insira um valor válido.");
      return;
    }
    if (formData.priority < 1 || formData.priority > 10) {
      alert("Prioridade deve ser entre 1 e 10.");
      return;
    }
    if (editingItem) {
      updateWishlistItem(editingItem.id, formData);
    } else {
      addWishlistItem(formData);
    }
    setFormData({
      title: "",
      estimatedPrice: 0,
      reason: "",
      urgency: "medium",
      priority: 5,
      decisionDate: "",
      category: "undefined",
      status: "thinking",
    });
    setEditingItem(null);
    setIsDialogOpen(false);
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'necessary': return 'bg-green-100 text-green-800'
      case 'superfluous': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'purchased': return 'bg-blue-100 text-blue-800'
      default: return 'bg-yellow-100 text-yellow-800'
    }
  }

  const getDaysToDecision = (decisionDate: string) => {
    const days = Math.ceil((new Date(decisionDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    return days
  }

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <div className="container mx-auto p-4 lg:p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4 animate-slide-in-left">
          <BackButton />
        </div>

        <div className="mb-6 lg:mb-8 animate-slide-in-left" style={{ animationDelay: "100ms" }}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
                <Heart className="h-6 w-6 lg:h-8 lg:w-8 text-primary" />
                Lista de Desejos
              </h1>
              <p className="text-sm lg:text-base text-muted-foreground">
                Controle seus desejos de consumo e tome decisões conscientes
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) setEditingItem(null);
            }}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Novo Item
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Adicionar Item à Wishlist</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Item Desejado</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Ex: iPhone 15"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="estimatedPrice">Preço Estimado (R$)</Label>
                    <Input
                      id="estimatedPrice"
                      type="number"
                      step="0.01"
                      value={formData.estimatedPrice}
                      onChange={(e) => setFormData(prev => ({ ...prev, estimatedPrice: parseFloat(e.target.value) || 0 }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="reason">Motivo do Desejo</Label>
                    <Textarea
                      id="reason"
                      value={formData.reason}
                      onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                      placeholder="Por que você quer isso?"
                      rows={3}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="urgency">Urgência</Label>
                      <Select value={formData.urgency} onValueChange={(value: any) => setFormData(prev => ({ ...prev, urgency: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Baixa</SelectItem>
                          <SelectItem value="medium">Média</SelectItem>
                          <SelectItem value="high">Alta</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="priority">Prioridade (1-10)</Label>
                      <Input
                        id="priority"
                        type="number"
                        min="1"
                        max="10"
                        value={formData.priority}
                        onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) || 5 }))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="decisionDate">Data Limite para Decisão</Label>
                    <Input
                      id="decisionDate"
                      type="date"
                      value={formData.decisionDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, decisionDate: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Análise</Label>
                    <Select value={formData.category} onValueChange={(value: any) => setFormData(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="undefined">Ainda não analisado</SelectItem>
                        <SelectItem value="necessary">Necessário</SelectItem>
                        <SelectItem value="superfluous">Supérfluo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full">Adicionar à Lista</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {wishlistItems.map((item, index) => {
            const daysToDecision = getDaysToDecision(item.decisionDate)
            const isDecisionTime = daysToDecision <= 0
            
            return (
              <Card key={item.id} className={`relative overflow-hidden animate-scale-in hover-lift ${isDecisionTime ? 'ring-2 ring-orange-300' : ''}`} style={{ animationDelay: `${200 + index * 100}ms` }}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status === 'thinking' ? 'Pensando' :
                       item.status === 'approved' ? 'Aprovado' :
                       item.status === 'rejected' ? 'Rejeitado' : 'Comprado'}
                    </Badge>
                  </div>
                  <div className="text-xl font-bold text-primary">
                    R$ {item.estimatedPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={getUrgencyColor(item.urgency)}>
                      {item.urgency === 'high' ? 'Alta Urgência' :
                       item.urgency === 'medium' ? 'Média Urgência' : 'Baixa Urgência'}
                    </Badge>
                    <Badge className={getCategoryColor(item.category)}>
                      {item.category === 'necessary' ? 'Necessário' :
                       item.category === 'superfluous' ? 'Supérfluo' : 'Não Analisado'}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Prioridade:</span>
                      <span className="font-medium">{item.priority}/10</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4" />
                      <span className={isDecisionTime ? 'text-orange-600 font-medium' : 'text-muted-foreground'}>
                        {isDecisionTime ? 'Hora de decidir!' : 
                         daysToDecision === 1 ? '1 dia para decidir' : 
                         `${daysToDecision} dias para decidir`}
                      </span>
                    </div>
                    {isDecisionTime && (
                      <div className="flex items-center gap-1 text-sm text-orange-600">
                        <AlertTriangle className="h-4 w-4" />
                        <span>Prazo de decisão chegou!</span>
                      </div>
                    )}
                  </div>

                  <div className="text-sm">
                    <p className="text-muted-foreground mb-1">Motivo:</p>
                    <p className="line-clamp-3">{item.reason}</p>
                  </div>

                  {item.status === 'thinking' && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() => updateWishlistItem(item.id, { status: 'approved' })}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Aprovar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => updateWishlistItem(item.id, { status: 'rejected' })}
                        className="flex-1"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Rejeitar
                      </Button>
                    </div>
                  )}

                  {item.status === 'approved' && (
                    <Button
                      size="sm"
                      onClick={() => updateWishlistItem(item.id, { status: 'purchased' })}
                      className="w-full"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Marcar como Comprado
                    </Button>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(item)}
                      aria-label="Editar item"
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        if (window.confirm("Tem certeza que deseja excluir este item?")) {
                          deleteWishlistItem(item.id);
                          // toast de sucesso
                        }
                      }}
                      aria-label="Excluir item"
                    >
                      Excluir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}

          {wishlistItems.length === 0 && (
            <Card className="col-span-full animate-scale-in" style={{ animationDelay: "200ms" }}>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Heart className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum item na lista</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Adicione seus desejos de consumo para tomar decisões mais conscientes
                </p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Primeiro Item
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default Wishlist
