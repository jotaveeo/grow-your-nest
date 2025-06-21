import { useState } from "react";
import { DollarSign, Plus, Trash2, Edit, Calendar } from "lucide-react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Income = {
  id: string;
  source: string;
  type: string;
  amount: string;
  date: string;
};

const incomeTypes = [
  "Salário",
  "Freelance",
  "Vendas",
  "Apostas",
  "Investimentos",
  "Outros",
];

const Receitas = () => {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState<Omit<Income, "id">>({
    source: "",
    type: "",
    amount: "",
    date: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setIncomes((prev) =>
        prev.map((inc) => (inc.id === editingId ? { ...inc, ...form } : inc))
      );
    } else {
      setIncomes((prev) => [...prev, { ...form, id: Date.now().toString() }]);
    }
    setForm({
      source: "",
      type: "",
      amount: "",
      date: "",
    });
    setEditingId(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (inc: Income) => {
    setForm({ ...inc });
    setEditingId(inc.id);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setIncomes((prev) => prev.filter((inc) => inc.id !== id));
  };

  const total = incomes.reduce(
    (sum, inc) => sum + (parseFloat(inc.amount) || 0),
    0
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 lg:p-6 max-w-4xl">
        {/* Header */}
        <div className="mb-6 lg:mb-8 flex items-center gap-3">
          <DollarSign className="h-8 w-8 text-primary" />
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Fontes de Receita
          </h1>
        </div>
        <Card className="mb-6 border-l-4 border-l-primary bg-primary/10">
          <CardContent className="flex items-center gap-4 py-4">
            <DollarSign className="h-6 w-6 text-primary" />
            <div>
              <p className="font-medium text-primary">Dica</p>
              <p className="text-sm text-muted-foreground">
                Liste todas as suas fontes de renda para ter uma visão completa
                do seu orçamento!
              </p>
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-end mb-4">
          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) {
                setEditingId(null);
                setForm({
                  source: "",
                  type: "",
                  amount: "",
                  date: "",
                });
              }
            }}
          >
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nova Receita
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "Editar Receita" : "Adicionar Receita"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 py-2">
                <div>
                  <Label htmlFor="source">Fonte</Label>
                  <Input
                    id="source"
                    value={form.source}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, source: e.target.value }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type">Tipo</Label>
                  <Select
                    value={form.type}
                    onValueChange={(value) =>
                      setForm((f) => ({ ...f, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {incomeTypes.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="amount">Valor</Label>
                  <Input
                    id="amount"
                    type="number"
                    min={0}
                    step="0.01"
                    value={form.amount}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, amount: e.target.value }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="date">Data de Recebimento</Label>
                  <Input
                    id="date"
                    type="date"
                    value={form.date}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, date: e.target.value }))
                    }
                    required
                  />
                </div>
                <Button type="submit" className="w-full mt-2">
                  {editingId ? "Salvar Alterações" : "Adicionar Receita"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        {/* Tabela de receitas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base lg:text-lg flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              Minhas Receitas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Fonte</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incomes.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center text-muted-foreground py-8"
                      >
                        Nenhuma receita cadastrada.
                      </TableCell>
                    </TableRow>
                  ) : (
                    incomes.map((inc) => (
                      <TableRow key={inc.id}>
                        <TableCell>{inc.source}</TableCell>
                        <TableCell>{inc.type}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {inc.date &&
                              new Date(inc.date).toLocaleDateString("pt-BR")}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          R${" "}
                          {parseFloat(inc.amount).toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell className="text-right flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(inc)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(inc.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            {/* Soma total */}
            <div className="flex justify-end p-4 border-t bg-muted/30">
              <span className="font-bold text-muted-foreground">
                Soma R${" "}
                {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Receitas;
