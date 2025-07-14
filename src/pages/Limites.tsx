import { useState } from "react";
import { Shield } from "lucide-react";
import { AlertTriangle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { KanbanColumn } from "@/components/limits/KanbanColumn";
import { LimitsSummaryStats } from "@/components/limits/LimitsSummaryStats";
import { EditLimitDialog } from "@/components/limits/EditLimitDialog";
import { useCategoryLimits } from "@/hooks/useCategoryLimits";
import { BackButton } from "@/components/BackButton";

const Limites = () => {
  const {
    categoryLimits,
    customLimits,
    updateCustomLimits,
    selectedMonth,
    selectedYear,
  } = useCategoryLimits();
  const [editingLimitCategory, setEditingLimitCategory] = useState(null);
  const [limitValue, setLimitValue] = useState(0);

  // Group categories by status
  const safeCategories = categoryLimits.filter((cat) => cat.status === "safe");
  const warningCategories = categoryLimits.filter(
    (cat) => cat.status === "warning"
  );
  const exceededCategories = categoryLimits.filter(
    (cat) => cat.status === "exceeded"
  );

  const handleEditLimit = (category) => {
    setEditingLimitCategory(category);
    setLimitValue(category.budget);
  };

  const handleDeleteLimit = (category) => {
    const newLimits = { ...customLimits };
    delete newLimits[category.name];
    updateCustomLimits(newLimits);
  };

  const handleUpdateLimit = (e) => {
    e.preventDefault();
    const newLimits = {
      ...customLimits,
      [editingLimitCategory.name]: limitValue,
    };
    updateCustomLimits(newLimits);
    setEditingLimitCategory(null);
  };

  const handleCloseDialog = () => {
    setEditingLimitCategory(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 lg:p-6 max-w-7xl">
        {/* Header */}
        <BackButton />

        <div className="mb-6 lg:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              Controle de Limites
            </h1>
          </div>
          <p className="text-sm lg:text-base text-muted-foreground">
            Monitore seus gastos por categoria e mantenha o controle do seu
            orçamento
          </p>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-muted-foreground">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="cursor-help">
                  Período:{" "}
                  {new Date(selectedYear, selectedMonth).toLocaleDateString(
                    "pt-BR",
                    {
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </TooltipTrigger>
                <TooltipContent>
                  <p>Dados calculados para o mês atual</p>
                  <p className="text-xs text-muted-foreground">
                    Use o filtro de período para ver outros meses
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <KanbanColumn
            title="Dentro do Limite"
            categories={safeCategories}
            bgColor="border-l-green-500"
            textColor="text-green-700"
            icon={Shield}
            onEdit={handleEditLimit}
            onDelete={handleDeleteLimit}
          />

          <KanbanColumn
            title="Atenção (80%+)"
            categories={warningCategories}
            bgColor="border-l-yellow-500"
            textColor="text-yellow-700"
            icon={AlertTriangle}
            onEdit={handleEditLimit}
            onDelete={handleDeleteLimit}
          />

          <KanbanColumn
            title="Limite Excedido"
            categories={exceededCategories}
            bgColor="border-l-red-500"
            textColor="text-red-700"
            icon={AlertTriangle}
            onEdit={handleEditLimit}
            onDelete={handleDeleteLimit}
          />
        </div>

        {/* Summary Stats */}
        <div className="mt-8">
          <LimitsSummaryStats
            safeCategories={safeCategories}
            warningCategories={warningCategories}
            exceededCategories={exceededCategories}
            categoryLimits={categoryLimits}
          />
        </div>

        {/* Edit Limit Dialog */}
        <EditLimitDialog
          editingLimitCategory={editingLimitCategory}
          limitValue={limitValue}
          setLimitValue={setLimitValue}
          onClose={handleCloseDialog}
          onSubmit={handleUpdateLimit}
        />
      </div>
    </div>
  );
};

export default Limites;
