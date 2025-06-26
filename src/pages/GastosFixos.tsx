
import { useState, useEffect } from "react";
import {
  CreditCard,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  DollarSign,
  Home,
  Utensils,
  Gamepad2,
  Music,
  Car,
  Heart,
  Smartphone,
  Wifi,
  ShoppingBag,
  Coffee,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BackButton } from "@/components/BackButton";
import { useFinanceExtendedContext } from "@/contexts/FinanceExtendedContext";
import { FixedExpense } from "@/types/finance";
import { useToast } from "@/hooks/use-toast";

const categories = [
  { id: "alimentacao", name: "Alimentação", icon: Utensils, color: "#EF4444" },
  { id: "cartao", name: "Cartão de Crédito", icon: CreditCard, color: "#8B5CF6" },
  { id: "streaming", name: "Streaming", icon: Music, color: "#EC4899" },
  { id: "jogos", name: "Jogos", icon: Gamepad2, color: "#06B6D4" },
  { id: "assinaturas", name: "Assinaturas", icon: Smartphone, color: "#F59E0B" },
  { id: "moradia", name: "Moradia", icon: Home, color: "#10B981" },
  { id: "transporte", name: "Transporte", icon: Car, color: "#F97316" },
  { id: "saude", name: "Saúde", icon: Heart, color: "#84CC16" },
  { id: "internet", name: "Internet/Telefone", icon: Wifi, color: "#3B82F6" },
  { id: "outros", name: "Outros", icon: ShoppingBag, color: "#6B7280" },
];

const GastosFixos = () => {
  const { fixedExpenses, addFixedExpense, updateFixedExpense, deleteFixedExpense } = useFinanceExtendedContext();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<FixedExpense | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  // Form states
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [dayOfMonth, setDayOfMonth] = useState("");

  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "July", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const resetForm = () => {
    setDescription("");
    setAmount("");
    setCategory("");
    setDayOfMonth("");
    setEditingExpense(null);
  };

  const handleSubmit = () => {
    if (!description || !amount || !category || !dayOfMonth) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const expenseData = {
      description,
      amount: parseFloat(amount),
      category,
      dayOfMonth: parseInt(dayOfMonth),
      isActive: true,
    };

    if (editingExpense) {
      updateFixedExpense(editingExpense.id, expenseData);
      toast({
        title: "Gasto fixo atualizado",
        description: "O gasto fixo foi atualizado com sucesso.",
      });
    } else {
      addFixedExpense(expenseData);
      toast({
        title: "Gasto fixo adicionado",
        description: "O novo gasto fixo foi adicionado com sucesso.",
      });
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (expense: FixedExpense) => {
    setEditingExpense(expense);
    setDescription(expense.description);
    setAmount(expense.amount.toString());
    setCategory(expense.category);
    setDayOfMonth(expense.dayOfMonth.toString());
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string, description: string) => {
    if (window.confirm(`Tem certeza que deseja excluir "${description}"?`)) {
      deleteFixedExpense(id);
      toast({
        title: "Gasto fixo excluído",
        description: "O gasto fixo foi excluído com sucesso.",
      });
    }
  };

  const toggleActiveStatus = (expense: FixedExpense) => {
    updateFixedExpense(expense.id, { isActive: !expense.isActive });
    toast({
      title: expense.isActive ? "Gasto desativado" : "Gasto ativado",
      description: `O gasto "${expense.description}" foi ${expense.isActive ? 'desativado' : 'ativado'}.`,
    });
  };

  // Calcular totais
  const activeExpenses = fixedExpenses.filter(expense => expense.isActive);
  const totalMonthly = activeExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalAnnual = totalMonthly * 12;

  // Agrupar por categoria
  const expensesByCategory = categories.map(cat => ({
    ...cat,
    expenses: activeExpenses.filter(expense => expense.category === cat.id),
    total: activeExpenses
      .filter(expense => expense.category === cat.id)
      .reduce((sum, expense) => sum + expense.amount, 0)
  })).filter(cat => cat.expenses.length > 0);

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.icon : ShoppingBag;
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.color : "#6B7280";
  };

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <div className="container mx-auto p-4 lg:p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4 animate-slide-in-left">
          <BackButton />
        </div>

        <div
          className="mb-6 lg:mb-8 animate-slide-in-left"
          style={{ animationDelay: "100ms" }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
                <Calendar className="h-6 w-6 lg:h-8 lg:w-8 text-primary" />
                Gastos Fixos
              </h1>
              <p className="text-sm lg:text-base text-muted-foreground">
                Acompanhe e gerencie seus gastos fixos mensais
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Adicionar Gasto Fixo
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingExpense ? "Editar Gasto Fixo" : "Novo Gasto Fixo"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingExpense 
                      ? "Edite as informações do gasto fixo."
                      : "Adicione um novo gasto fixo mensal."
                    }
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Input
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Ex: Netflix, Conta de luz..."
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="amount">Valor (R$)</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0,00"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            <div className="flex items-center gap-2">
                              <cat.icon className="h-4 w-4" style={{ color: cat.color }} />
                              {cat.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="dayOfMonth">Dia do Vencimento</Label>
                    <Input
                      id="dayOfMonth"
                      type="number"
                      min="1"
                      max="31"
                      value={dayOfMonth}
                      onChange={(e) => setDayOfMonth(e.target.value)}
                      placeholder="Ex: 15"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleSubmit}>
                    {editingExpense ? "Atualizar" : "Adicionar"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Summary Cards */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-scale-in"
          style={{ animationDelay: "200ms" }}
        >
          <Card className="hover-lift">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-blue-500" />
                Total Mensal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                R$ {totalMonthly.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {activeExpenses.length} gastos ativos
              </p>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4 text-purple-500" />
                Total Anual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                R$ {totalAnnual.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Projeção anual
              </p>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Coffee className="h-4 w-4 text-green-500" />
                Média por Dia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                R$ {(totalMonthly / 30).toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Custo diário médio
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Expenses by Category */}
        {expensesByCategory.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {expensesByCategory.map((categoryGroup) => {
              const CategoryIcon = categoryGroup.icon;
              return (
                <Card key={categoryGroup.id} className="animate-scale-in">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <CategoryIcon 
                        className="h-5 w-5" 
                        style={{ color: categoryGroup.color }} 
                      />
                      {categoryGroup.name}
                      <Badge variant="secondary" className="ml-auto">
                        R$ {categoryGroup.total.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {categoryGroup.expenses.map((expense) => (
                      <div
                        key={expense.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-muted/30"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{expense.description}</p>
                          <p className="text-sm text-muted-foreground">
                            Vence dia {expense.dayOfMonth}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm">
                            R$ {expense.amount.toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(expense)}
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(expense.id, expense.description)}
                          >
                            <Trash2 className="h-3 w-3 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* All Expenses Table */}
        <Card className="animate-scale-in" style={{ animationDelay: "300ms" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Todos os Gastos Fixos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {fixedExpenses.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fixedExpenses.map((expense) => {
                    const CategoryIcon = getCategoryIcon(expense.category);
                    return (
                      <TableRow key={expense.id}>
                        <TableCell className="font-medium">
                          {expense.description}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <CategoryIcon 
                              className="h-4 w-4" 
                              style={{ color: getCategoryColor(expense.category) }} 
                            />
                            {categories.find(cat => cat.id === expense.category)?.name || expense.category}
                          </div>
                        </TableCell>
                        <TableCell className="font-bold">
                          R$ {expense.amount.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell>Dia {expense.dayOfMonth}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={expense.isActive ? "default" : "secondary"}
                            className="cursor-pointer"
                            onClick={() => toggleActiveStatus(expense)}
                          >
                            {expense.isActive ? "Ativo" : "Inativo"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(expense)}
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(expense.id, expense.description)}
                            >
                              <Trash2 className="h-3 w-3 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="p-8 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum gasto fixo cadastrado</h3>
                <p className="text-muted-foreground mb-4">
                  Comece adicionando seus primeiros gastos fixos mensais.
                </p>
                <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Adicionar Primeiro Gasto
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GastosFixos;
