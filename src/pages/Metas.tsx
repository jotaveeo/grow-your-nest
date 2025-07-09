import { useState } from "react";
import { useFinanceExtendedContext } from "@/contexts/FinanceExtendedContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Target,
  Plus,
  Calendar,
  TrendingUp,
  Archive,
  CheckCircle,
  Edit,
} from "lucide-react";
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
import { BackButton } from "@/components/BackButton";
import { toast } from "@/components/ui/use-toast";
import { usePlan } from "@/contexts/PlanContext";
import { PlanLimitWarning } from "@/components/PlanLimitWarning";
import { UpgradeModal } from "@/components/UpgradeModal";
import { PlanSelector } from "@/components/PlanSelector";

const Metas = () => {
  const {
    financialGoals,
    addFinancialGoal,
    updateFinancialGoal,
    deleteFinancialGoal,
  } = useFinanceExtendedContext();
  const { hasReachedLimit, features, currentPlan } = usePlan();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<any>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    targetAmount: 0,
    currentAmount: 0,
    deadline: "",
    description: "",
    status: "active" as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check goal limit
    if (!editingGoal && hasReachedLimit("goals", financialGoals.length)) {
      setShowUpgradeModal(true);
      return;
    }

    if (!formData.title.trim() || !formData.targetAmount || !formData.deadline) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    if (formData.targetAmount <= 0) {
      toast({
        title: "Valor alvo inválido",
        description: "O valor alvo deve ser maior que zero.",
        variant: "destructive",
      });
      return;
    }
    if (formData.currentAmount < 0) {
      toast({
        title: "Valor atual inválido",
        description: "O valor atual não pode ser negativo.",
        variant: "destructive",
      });
      return;
    }
    if (editingGoal) {
      updateFinancialGoal(editingGoal.id, formData);
    } else {
      addFinancialGoal(formData);
    }
    setFormData({
      title: "",
      targetAmount: 0,
      currentAmount: 0,
      deadline: "",
      description: "",
      status: "active",
    });
    setEditingGoal(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (goal: any) => {
    setFormData({ ...goal });
    setEditingGoal(goal);
    setIsDialogOpen(true);
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 lg:p-6 max-w-7xl">
        {/* Plan Selector for Dev Mode */}
        <PlanSelector />

        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <BackButton />
        </div>

        <div
          className="mb-6 lg:mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
                <Target className="h-6 w-6 lg:h-8 lg:w-8 text-primary" />
                Metas Financeiras
              </h1>
              <p className="text-sm lg:text-base text-muted-foreground">
                Defina e acompanhe seus objetivos financeiros
              </p>
            </div>
            <Dialog
              open={isDialogOpen}
              onOpenChange={(open) => {
                if (open && hasReachedLimit("goals", financialGoals.length)) {
                  setShowUpgradeModal(true);
                  return;
                }
                setIsDialogOpen(open);
                if (!open) setEditingGoal(null);
              }}
            >
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Nova Meta
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingGoal ? "Editar Meta" : "Criar Nova Meta"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Título da Meta</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      placeholder="Ex: Comprar um carro"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="targetAmount">Valor Alvo (R$)</Label>
                      <Input
                        id="targetAmount"
                        type="number"
                        step="0.01"
                        value={formData.targetAmount}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            targetAmount: parseFloat(e.target.value) || 0,
                          }))
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="currentAmount">Valor Atual (R$)</Label>
                      <Input
                        id="currentAmount"
                        type="number"
                        step="0.01"
                        value={formData.currentAmount}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            currentAmount: parseFloat(e.target.value) || 0,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="deadline">Prazo</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          deadline: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Descreva sua meta..."
                      rows={3}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    {editingGoal ? "Salvar Alterações" : "Criar Meta"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Plan Usage Warning */}
        <PlanLimitWarning
          currentCount={financialGoals.length}
          limit={features.maxGoals}
          itemName="metas"
          requiredPlan="essencial"
          onUpgrade={() => setShowUpgradeModal(true)}
        />

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {financialGoals.map((goal, index) => {
            const progress = getProgressPercentage(
              goal.currentAmount,
              goal.targetAmount
            );
            const isCompleted = progress >= 100;
            const daysLeft = Math.ceil(
              (new Date(goal.deadline).getTime() - new Date().getTime()) /
                (1000 * 60 * 60 * 24)
            );

            return (
              <Card
                key={goal.id}
                className="relative overflow-hidden"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg line-clamp-2">
                      {goal.title}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(goal.status)}>
                        {goal.status === "completed"
                          ? "Concluída"
                          : goal.status === "archived"
                          ? "Arquivada"
                          : "Ativa"}
                      </Badge>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(goal)}
                        aria-label="Editar meta"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
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
                    <Progress value={progress} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Atual</p>
                      <p className="font-semibold text-success">
                        R${" "}
                        {goal.currentAmount.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Meta</p>
                      <p className="font-semibold">
                        R${" "}
                        {goal.targetAmount.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {daysLeft > 0
                        ? `${daysLeft} dias restantes`
                        : daysLeft === 0
                        ? "Vence hoje"
                        : `${Math.abs(daysLeft)} dias em atraso`}
                    </span>
                  </div>

                  {goal.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {goal.description}
                    </p>
                  )}

                  <div className="flex gap-2 pt-2">
                    {!isCompleted && goal.status === "active" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          updateFinancialGoal(goal.id, { status: "completed" })
                        }
                        className="flex-1"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Concluir
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        updateFinancialGoal(goal.id, {
                          status:
                            goal.status === "archived" ? "active" : "archived",
                        })
                      }
                      className="flex-1"
                    >
                      <Archive className="h-4 w-4 mr-1" />
                      {goal.status === "archived" ? "Desarquivar" : "Arquivar"}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        if (window.confirm("Tem certeza que deseja excluir esta meta?")) {
                          deleteFinancialGoal(goal.id);
                          toast({
                            title: "Meta excluída",
                            description: "A meta foi removida com sucesso.",
                          });
                        }
                      }}
                      aria-label="Excluir meta"
                      className="flex-1"
                    >
                      Excluir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {financialGoals.length === 0 && (
            <Card
              className="col-span-full"
            >
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Target className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Nenhuma meta cadastrada
                </h3>
                <p className="text-muted-foreground text-center mb-4">
                  Comece definindo suas metas financeiras para alcançar seus
                  objetivos
                </p>
                <Button onClick={() => {
                  if (hasReachedLimit("goals", financialGoals.length)) {
                    setShowUpgradeModal(true);
                    return;
                  }
                  setIsDialogOpen(true);
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeira Meta
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        requiredPlan="essencial"
        feature="Metas Financeiras"
      />
    </div>
  );
};

export default Metas;


