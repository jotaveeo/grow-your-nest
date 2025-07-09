import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Tag, Download } from "lucide-react";
import { BackButton } from "@/components/BackButton";
import { useFinanceExtendedContext } from "@/contexts/FinanceExtendedContext";
import { useToast } from "@/hooks/use-toast";
import { PlanSelector } from "@/components/PlanSelector";
import { PlanLimitWarning } from "@/components/PlanLimitWarning";
import { PlanUsageStats } from "@/components/PlanUsageStats";
import { PlanFeatureGate } from "@/components/PlanFeatureGate";
import { usePlan } from "@/contexts/PlanContext";

const defaultCategories = [
  // Categorias de Receita
  { id: '1', name: 'Salário', icon: '💰', color: '#10B981', type: 'income' },
  { id: '2', name: 'Freelance', icon: '💻', color: '#3B82F6', type: 'income' },
  { id: '3', name: 'Investimentos', icon: '📈', color: '#8B5CF6', type: 'income' },
  { id: '4', name: 'Comissões', icon: '🤝', color: '#06B6D4', type: 'income' },
  { id: '5', name: 'Aluguel Recebido', icon: '🏠', color: '#84CC16', type: 'income' },
  { id: '6', name: 'Vendas', icon: '🛍️', color: '#F59E0B', type: 'income' },
  { id: '7', name: '13º Salário', icon: '🎁', color: '#EC4899', type: 'income' },
  { id: '8', name: 'Férias', icon: '🏖️', color: '#14B8A6', type: 'income' },
  { id: '9', name: 'Bonificação', icon: '🏆', color: '#F97316', type: 'income' },
  { id: '10', name: 'Restituição IR', icon: '📋', color: '#6366F1', type: 'income' },
  { id: '11', name: 'Pensão Recebida', icon: '👨‍👩‍👧‍👦', color: '#8B5CF6', type: 'income' },
  { id: '12', name: 'Renda Extra', icon: '💪', color: '#10B981', type: 'income' },

  // Categorias de Despesa - Essenciais
  { id: '13', name: 'Alimentação', icon: '🍽️', color: '#EF4444', type: 'expense' },
  { id: '14', name: 'Supermercado', icon: '🛒', color: '#DC2626', type: 'expense' },
  { id: '15', name: 'Transporte', icon: '🚗', color: '#F59E0B', type: 'expense' },
  { id: '16', name: 'Combustível', icon: '⛽', color: '#D97706', type: 'expense' },
  { id: '17', name: 'Moradia', icon: '🏠', color: '#F97316', type: 'expense' },
  { id: '18', name: 'Aluguel', icon: '🔑', color: '#EA580C', type: 'expense' },
  { id: '19', name: 'Contas Básicas', icon: '📄', color: '#7C2D12', type: 'expense' },
  { id: '20', name: 'Energia Elétrica', icon: '💡', color: '#FCD34D', type: 'expense' },
  { id: '21', name: 'Água', icon: '💧', color: '#0EA5E9', type: 'expense' },
  { id: '22', name: 'Internet', icon: '📶', color: '#3B82F6', type: 'expense' },
  { id: '23', name: 'Telefone', icon: '📱', color: '#6366F1', type: 'expense' },
  { id: '24', name: 'Gás', icon: '🔥', color: '#F59E0B', type: 'expense' },

  // Saúde e Bem-estar
  { id: '25', name: 'Saúde', icon: '🏥', color: '#06B6D4', type: 'expense' },
  { id: '26', name: 'Medicamentos', icon: '💊', color: '#0891B2', type: 'expense' },
  { id: '27', name: 'Plano de Saúde', icon: '🩺', color: '#0E7490', type: 'expense' },
  { id: '28', name: 'Academia', icon: '💪', color: '#DC2626', type: 'expense' },
  { id: '29', name: 'Terapia', icon: '🧠', color: '#7C3AED', type: 'expense' },

  // Educação e Desenvolvimento
  { id: '30', name: 'Educação', icon: '📚', color: '#84CC16', type: 'expense' },
  { id: '31', name: 'Cursos', icon: '🎓', color: '#65A30D', type: 'expense' },
  { id: '32', name: 'Livros', icon: '📖', color: '#16A34A', type: 'expense' },
  { id: '33', name: 'Material Escolar', icon: '✏️', color: '#15803D', type: 'expense' },

  // Lazer e Entretenimento
  { id: '34', name: 'Lazer', icon: '🎮', color: '#EC4899', type: 'expense' },
  { id: '35', name: 'Cinema', icon: '🎬', color: '#DB2777', type: 'expense' },
  { id: '36', name: 'Streaming', icon: '📺', color: '#BE185D', type: 'expense' },
  { id: '37', name: 'Jogos', icon: '🎯', color: '#9D174D', type: 'expense' },
  { id: '38', name: 'Viagens', icon: '✈️', color: '#0EA5E9', type: 'expense' },
  { id: '39', name: 'Restaurantes', icon: '🍕', color: '#F97316', type: 'expense' },
  { id: '40', name: 'Bares', icon: '🍺', color: '#EA580C', type: 'expense' },

  // Vestuário e Cuidados Pessoais
  { id: '41', name: 'Roupas', icon: '👕', color: '#8B5CF6', type: 'expense' },
  { id: '42', name: 'Sapatos', icon: '👟', color: '#7C3AED', type: 'expense' },
  { id: '43', name: 'Cabeleireiro', icon: '💇', color: '#EC4899', type: 'expense' },
  { id: '44', name: 'Cosméticos', icon: '💄', color: '#DB2777', type: 'expense' },

  // Financeiro
  { id: '45', name: 'Cartão de Crédito', icon: '💳', color: '#EF4444', type: 'expense' },
  { id: '46', name: 'Empréstimos', icon: '🏦', color: '#DC2626', type: 'expense' },
  { id: '47', name: 'Financiamentos', icon: '🏠', color: '#B91C1C', type: 'expense' },
  { id: '48', name: 'Taxas Bancárias', icon: '🏛️', color: '#991B1B', type: 'expense' },
  { id: '49', name: 'Seguros', icon: '🛡️', color: '#7F1D1D', type: 'expense' },

  // Impostos e Obrigações
  { id: '50', name: 'Impostos', icon: '📊', color: '#374151', type: 'expense' },
  { id: '51', name: 'IPTU', icon: '🏘️', color: '#4B5563', type: 'expense' },
  { id: '52', name: 'IPVA', icon: '🚙', color: '#6B7280', type: 'expense' },
  { id: '53', name: 'Multas', icon: '⚠️', color: '#9CA3AF', type: 'expense' },

  // Família e Pets
  { id: '54', name: 'Crianças', icon: '👶', color: '#FCD34D', type: 'expense' },
  { id: '55', name: 'Pets', icon: '🐕', color: '#FBBF24', type: 'expense' },
  { id: '56', name: 'Presentes', icon: '🎁', color: '#F59E0B', type: 'expense' },

  // Investimentos e Poupança
  { id: '57', name: 'Poupança', icon: '🐷', color: '#10B981', type: 'expense' },
  { id: '58', name: 'Investimentos', icon: '📈', color: '#059669', type: 'expense' },
  { id: '59', name: 'Previdência', icon: '👴', color: '#047857', type: 'expense' },

  // Diversos
  { id: '60', name: 'Doações', icon: '❤️', color: '#F87171', type: 'expense' },
  { id: '61', name: 'Assinaturas', icon: '📝', color: '#6366F1', type: 'expense' },
  { id: '62', name: 'Outros', icon: '📦', color: '#6B7280', type: 'expense' },
];

const Categorias = () => {
  const { categories, addCategory, updateCategory, deleteCategory, transactions } = useFinanceExtendedContext();
  const { toast } = useToast();
  const { hasReachedLimit, features, currentPlan } = usePlan();

  const [newCategory, setNewCategory] = useState({
    name: "",
    icon: "",
    color: "#3b82f6",
    type: "expense" as "income" | "expense",
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleImportDefaultCategories = () => {
    let importedCount = 0;
    let skippedCount = 0;

    defaultCategories.forEach((defaultCategory) => {
      // Check if category already exists (by name and type)
      const exists = categories.some(
        (cat) =>
          cat.name.toLowerCase() === defaultCategory.name.toLowerCase() &&
          cat.type === defaultCategory.type
      );

      if (!exists) {
        // Check limit before adding
        if (hasReachedLimit('categories', categories.length + importedCount)) {
          toast({
            title: "Limite atingido",
            description: `Você atingiu o limite de ${features.maxCategories} categorias do plano ${currentPlan}.`,
            variant: "destructive",
          });
          return;
        }

        addCategory({
          name: defaultCategory.name,
          icon: defaultCategory.icon,
          color: defaultCategory.color,
          type: defaultCategory.type as "income" | "expense",
        });
        importedCount++;
      } else {
        skippedCount++;
      }
    });

    toast({
      title: "Importação concluída",
      description: `${importedCount} categorias importadas, ${skippedCount} já existiam.`,
    });
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();

    // Check category limit
    if (!editingCategory && hasReachedLimit('categories', categories.length)) {
      setShowUpgradeModal(true);
      return;
    }

    // Validação de nome duplicado para o mesmo tipo
    if (
      categories.some(
        (cat) =>
          cat.name.trim().toLowerCase() === newCategory.name.trim().toLowerCase() &&
          cat.type === newCategory.type &&
          cat.id !== editingCategory
      )
    ) {
      toast({
        title: "Nome de categoria já existe",
        description: "Escolha um nome diferente para esta categoria.",
        variant: "destructive",
      });
      return;
    }
    // Validação de emoji/ícone
    if (!/^\p{Emoji}|.{1}$/u.test(newCategory.icon)) {
      toast({
        title: "Emoji/ícone inválido",
        description: "Use apenas um emoji ou caractere.",
        variant: "destructive",
      });
      return;
    }
    // Validação de cor
    if (!/^#[0-9A-Fa-f]{6}$/.test(newCategory.color)) {
      toast({
        title: "Cor inválida",
        description: "Use um código hexadecimal válido.",
        variant: "destructive",
      });
      return;
    }
    if (editingCategory) {
      updateCategory(editingCategory, newCategory);
      toast({
        title: "Categoria atualizada",
        description: "A categoria foi editada com sucesso.",
      });
    } else {
      addCategory(newCategory);
      toast({
        title: "Categoria criada",
        description: "A nova categoria foi adicionada com sucesso.",
      });
    }
    setNewCategory({ name: "", icon: "", color: "#3b82f6", type: "expense" });
    setEditingCategory(null);
    setIsDialogOpen(false);
  };

  const handleEditCategory = (category: any) => {
    setNewCategory({
      name: category.name,
      icon: category.icon,
      color: category.color,
      type: category.type,
    });
    setEditingCategory(category.id);
    setIsDialogOpen(true);
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta categoria?")) {
      deleteCategory(id);
      toast({
        title: "Categoria excluída",
        description: "A categoria foi removida com sucesso.",
      });
    }
  };

  const expenseCategories = categories.filter((cat) => cat.type === "expense");
  const incomeCategories = categories.filter((cat) => cat.type === "income");
  const unusedCategories = categories.filter(
    cat => !transactions.some(t => t.category === cat.name)
  );

  const CategoryCard = ({ category, onEdit, onDelete }: any) => (
    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
          style={{ backgroundColor: category.color + "20" }}
        >
          {category.icon}
        </div>
        <div>
          <p className="font-medium text-sm lg:text-base">{category.name}</p>
          <p className="text-xs text-muted-foreground capitalize">
            {category.type === "expense" ? "Despesa" : "Receita"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => onEdit(category)}
          aria-label={`Editar categoria ${category.name}`}
          title="Editar categoria"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          onClick={() => onDelete(category.id)}
          aria-label={`Excluir categoria ${category.name}`}
          title="Excluir categoria"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 lg:p-6 max-w-6xl">
        {/* Plan Selector for Dev Mode */}
        <PlanSelector />

        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <BackButton />
        </div>

        <div
          className="mb-6 lg:mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                Gerenciar Categorias
              </h1>
              <p className="text-sm lg:text-base text-muted-foreground">
                Organize suas transações com categorias personalizadas
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <PlanFeatureGate
                requiredPlan="free"
                featureName="Importar Categorias Padrão"
                description="Importe categorias pré-definidas para começar rapidamente"
              >
                <Button
                  variant="outline"
                  onClick={handleImportDefaultCategories}
                  className="flex items-center gap-2 w-full sm:w-auto"
                >
                  <Download className="h-4 w-4" />
                  Importar Categorias Padrão
                </Button>
              </PlanFeatureGate>

              <Dialog
                open={isDialogOpen}
                onOpenChange={(open) => {
                  if (open && hasReachedLimit('categories', categories.length)) {
                    setShowUpgradeModal(true);
                    return;
                  }
                  setIsDialogOpen(open);
                  if (!open) {
                    setEditingCategory(null);
                    setNewCategory({
                      name: "",
                      icon: "",
                      color: "#3b82f6",
                      type: "expense",
                    });
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2 w-full sm:w-auto">
                    <Plus className="h-4 w-4" />
                    Nova Categoria
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      {editingCategory
                        ? "Editar Categoria"
                        : "Criar Nova Categoria"}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddCategory} className="space-y-4 py-4">
                    <div>
                      <Label htmlFor="name">Nome da Categoria</Label>
                      <Input
                        id="name"
                        value={newCategory.name}
                        onChange={(e) =>
                          setNewCategory({ ...newCategory, name: e.target.value })
                        }
                        placeholder="Ex: Alimentação"
                        className="mt-1"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="icon">Emoji/Ícone</Label>
                      <Input
                        id="icon"
                        value={newCategory.icon}
                        onChange={(e) =>
                          setNewCategory({ ...newCategory, icon: e.target.value })
                        }
                        placeholder="🍕"
                        className="mt-1"
                        maxLength={2}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="color">Cor</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="color"
                          id="color"
                          value={newCategory.color}
                          onChange={(e) =>
                            setNewCategory({
                              ...newCategory,
                              color: e.target.value,
                            })
                          }
                          className="w-12 h-10 rounded border border-input"
                        />
                        <Input
                          value={newCategory.color}
                          onChange={(e) =>
                            setNewCategory({
                              ...newCategory,
                              color: e.target.value,
                            })
                          }
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
                          variant={
                            newCategory.type === "expense" ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            setNewCategory({ ...newCategory, type: "expense" })
                          }
                          className="flex-1"
                        >
                          Despesa
                        </Button>
                        <Button
                          type="button"
                          variant={
                            newCategory.type === "income" ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            setNewCategory({ ...newCategory, type: "income" })
                          }
                          className="flex-1"
                        >
                          Receita
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit">
                        {editingCategory
                          ? "Salvar Alterações"
                          : "Criar Categoria"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Plan Usage Warning */}
        <PlanLimitWarning
          currentCount={categories.length}
          limit={features.maxCategories}
          itemName="categorias"
          requiredPlan="essencial"
          onUpgrade={() => setShowUpgradeModal(true)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Categories Grid */}
          <div className="lg:col-span-2 space-y-6">
            {/* Expense Categories */}
            <Card
              className=""
            >
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
                      onEdit={handleEditCategory}
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
            <Card
              className=""
            >
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
                      onEdit={handleEditCategory}
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

          {/* Sidebar with Plan Info */}
          <div className="space-y-6">
            <PlanUsageStats />

            {/* Usage Stats */}
            <Card
              className=""
            >
              <CardHeader className="px-4 lg:px-6 py-4">
                <CardTitle className="text-base lg:text-lg">
                  Estatísticas de Uso
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 lg:px-6 pb-4 lg:pb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-primary">
                      {categories.length}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Total de Categorias
                    </p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-destructive">
                      {expenseCategories.length}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Categorias de Despesa
                    </p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-success">
                      {incomeCategories.length}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Categorias de Receita
                    </p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-warning">
                      {unusedCategories.length}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Categorias Não Utilizadas
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categorias;
