import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useFinanceExtendedContext } from "@/contexts/FinanceExtendedContext";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";
import { BackButton } from "@/components/BackButton";

const NovoLancamento = () => {
  const navigate = useNavigate();
  const { addTransaction, categories } = useFinanceExtendedContext();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    type: "expense" as "income" | "expense",
    amount: "",
    description: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.amount || !formData.description || !formData.category) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    if (parseFloat(formData.amount) <= 0) {
      toast({
        title: "Valor inválido",
        description: "O valor deve ser maior que zero.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await addTransaction({
        type: formData.type,
        amount: parseFloat(formData.amount),
        description: formData.description,
        category: formData.category,
        date: formData.date,
      });
      toast({
        title: "Transação adicionada",
        description: "A transação foi registrada com sucesso.",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível registrar a transação.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(
    (cat) => cat.type === formData.type || cat.type === "both"
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <BackButton />
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">Novo Lançamento</h1>
          <p className="text-muted-foreground">
            Registre uma nova transação financeira
          </p>
        </div>

        <br />

        <Card>
          <CardHeader>
            <CardTitle>Detalhes da Transação</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Tipo */}
              <div className="space-y-2">
                <Label htmlFor="type">Tipo *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: "income" | "expense") =>
                    setFormData((prev) => ({
                      ...prev,
                      type: value,
                      category: "", // Reset category when type changes
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-success rounded-full"></div>
                        Receita
                      </div>
                    </SelectItem>
                    <SelectItem value="expense">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-destructive rounded-full"></div>
                        Despesa
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Valor */}
              <div className="space-y-2">
                <Label htmlFor="amount">Valor *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-muted-foreground">
                    R$
                  </span>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0,00"
                    step="0.01"
                    min="0"
                    className="pl-10"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        amount: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              {/* Categoria */}
              <div className="space-y-2">
                <Label htmlFor="category">Categoria *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCategories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        <div className="flex items-center gap-2">
                          <span>{category.icon}</span>
                          <span>{category.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <Label htmlFor="description">Descrição *</Label>
                <Textarea
                  id="description"
                  placeholder="Ex: Almoço no restaurante, Pagamento do cartão, etc."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>

              {/* Data */}
              <div className="space-y-2">
                <Label htmlFor="date">Data *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, date: e.target.value }))
                  }
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1" disabled={loading} aria-label="Salvar transação">
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Salvando..." : "Salvar Transação"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NovoLancamento;
