import { useState } from "react";
import {
  Calendar as CalendarIcon,
  Plus,
  Target,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BackButton } from "@/components/BackButton";

const months = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

type YearGoal = {
  id: string;
  month: string;
  description: string;
  targetAmount: string;
  currentAmount: string;
  category: string;
};

const categories = ["Economia", "Investimento", "Dívida", "Receita", "Outro"];

const Calendario = () => {
  const [yearGoals, setYearGoals] = useState<YearGoal[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(
    months[new Date().getMonth()]
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState<Omit<YearGoal, "id">>({
    month: "",
    description: "",
    targetAmount: "",
    currentAmount: "",
    category: "",
  });
  const [editingGoal, setEditingGoal] = useState<YearGoal | null>(null);

  // Função para abrir o modal para editar
  const handleEditGoal = (goal: YearGoal) => {
    setForm({ ...goal });
    setEditingGoal(goal);
    setIsDialogOpen(true);
  };

  // Função para remover meta
  const handleRemoveGoal = (id: string) => {
    setYearGoals((prev) => prev.filter((g) => g.id !== id));
  };

  // Atualize o handleSubmit para editar ou criar
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.month ||
      !form.category ||
      !form.description ||
      !form.targetAmount
    ) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }
    if (parseFloat(form.targetAmount) <= 0) {
      alert("O valor da meta deve ser maior que zero.");
      return;
    }
    if (editingGoal) {
      setYearGoals((prev) =>
        prev.map((g) =>
          g.id === editingGoal.id ? { ...editingGoal, ...form } : g
        )
      );
      setEditingGoal(null);
    } else {
      setYearGoals((prev) => [...prev, { ...form, id: Date.now().toString() }]);
    }
    setForm({
      month: "",
      description: "",
      targetAmount: "",
      currentAmount: "",
      category: "",
    });
    setIsDialogOpen(false);
  };

  const filteredGoals = yearGoals.filter(
    (goal) => goal.month === selectedMonth
  );

  const getProgressPercentage = (current: string, target: string) => {
    const currentVal = parseFloat(current) || 0;
    const targetVal = parseFloat(target) || 1;
    return Math.min((currentVal / targetVal) * 100, 100);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Economia":
        return "bg-green-100 text-green-800";
      case "Investimento":
        return "bg-blue-100 text-blue-800";
      case "Dívida":
        return "bg-red-100 text-red-800";
      case "Receita":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
                <CalendarIcon className="h-6 w-6 lg:h-8 lg:w-8 text-primary" />
                Controle do Ano
              </h1>
              <p className="text-sm lg:text-base text-muted-foreground">
                Defina e acompanhe suas metas mensais do ano
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Nova Meta
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingGoal
                      ? "Editar Meta do Ano"
                      : "Criar Nova Meta do Ano"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="month">Mês</Label>
                    <Select
                      value={form.month}
                      onValueChange={(value) =>
                        setForm((prev) => ({ ...prev, month: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o mês" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem key={month} value={month}>
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="description">Descrição da Meta</Label>
                    <Input
                      id="description"
                      value={form.description}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Ex: Economizar para viagem"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Categoria</Label>
                    <Select
                      value={form.category}
                      onValueChange={(value) =>
                        setForm((prev) => ({ ...prev, category: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="targetAmount">Meta (R$)</Label>
                      <Input
                        id="targetAmount"
                        type="number"
                        step="0.01"
                        value={form.targetAmount}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            targetAmount: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="currentAmount">Atual (R$)</Label>
                      <Input
                        id="currentAmount"
                        type="number"
                        step="0.01"
                        value={form.currentAmount}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            currentAmount: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    {editingGoal ? "Salvar Alterações" : "Criar Meta"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Month Selector */}
        <div
          className="flex flex-wrap gap-2 mb-6 animate-slide-in-left"
          style={{ animationDelay: "200ms" }}
        >
          {months.map((month) => (
            <Button
              key={month}
              variant={selectedMonth === month ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedMonth(month)}
              className="hover-scale"
            >
              {month}
            </Button>
          ))}
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredGoals.map((goal, index) => {
            const progress = getProgressPercentage(
              goal.currentAmount,
              goal.targetAmount
            );
            const isCompleted = progress >= 100;

            return (
              <Card
                key={goal.id}
                className={`animate-scale-in hover-lift ${
                  !isCompleted &&
                  new Date().getMonth() > months.indexOf(goal.month)
                    ? "ring-2 ring-orange-400"
                    : ""
                }`}
                style={{ animationDelay: `${300 + index * 100}ms` }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg line-clamp-2">
                      {goal.description}
                    </CardTitle>
                    <Badge className={getCategoryColor(goal.category)}>
                      {goal.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progresso</span>
                      <span className="font-medium">
                        {progress.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          isCompleted ? "bg-green-500" : "bg-primary"
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Atual</p>
                      <p className="font-semibold text-success">
                        R${" "}
                        {parseFloat(goal.currentAmount || "0").toLocaleString(
                          "pt-BR",
                          { minimumFractionDigits: 2 }
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Meta</p>
                      <p className="font-semibold">
                        R${" "}
                        {parseFloat(goal.targetAmount).toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>

                  {isCompleted && (
                    <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded-lg">
                      <Target className="h-4 w-4" />
                      <span className="font-medium">Meta atingida! 🎉</span>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditGoal(goal)}
                      aria-label="Editar meta"
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRemoveGoal(goal.id)}
                      aria-label="Remover meta"
                    >
                      Remover
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {filteredGoals.length === 0 && (
            <Card
              className="col-span-full animate-scale-in"
              style={{ animationDelay: "300ms" }}
            >
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Nenhuma meta para {selectedMonth}
                </h3>
                <p className="text-muted-foreground text-center mb-4">
                  Defina suas metas mensais para ter um controle anual
                  organizado
                </p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeira Meta
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Summary Card */}
        {yearGoals.length > 0 && (
          <Card
            className="mt-6 animate-scale-in"
            style={{ animationDelay: "400ms" }}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Resumo do Ano
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    {yearGoals.length}
                  </p>
                  <p className="text-sm text-muted-foreground">Metas Criadas</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {
                      yearGoals.filter(
                        (g) =>
                          getProgressPercentage(
                            g.currentAmount,
                            g.targetAmount
                          ) >= 100
                      ).length
                    }
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Metas Concluídas
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">
                    {
                      yearGoals.filter(
                        (g) =>
                          getProgressPercentage(
                            g.currentAmount,
                            g.targetAmount
                          ) < 100
                      ).length
                    }
                  </p>
                  <p className="text-sm text-muted-foreground">Em Andamento</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Calendario;
