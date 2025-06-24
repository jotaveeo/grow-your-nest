import { useState } from "react";
import { TrendingUp, Plus, Trash2, Edit, Calendar } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

type Investment = {
  id: string;
  product: string;
  broker: string;
  type: string;
  amount: string;
  date: string;
};

const investmentTypes = [
  "Renda Fixa",
  "Renda Variável",
  "Fundo Imobiliário",
  "Previdência",
  "Cripto",
  "Outro",
];

const brokers = [
  "Nubank",
  "XP",
  "Banco Inter",
  "BTG",
  "Rico",
  "Clear",
  "Modal",
  "Outro",
];

const Investimentos = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState<Omit<Investment, "id">>({
    product: "",
    broker: "",
    type: "",
    amount: "",
    date: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setInvestments((prev) =>
        prev.map((inv) => (inv.id === editingId ? { ...inv, ...form } : inv))
      );
    } else {
      setInvestments((prev) => [
        ...prev,
        { ...form, id: Date.now().toString() },
      ]);
    }
    setForm({
      product: "",
      broker: "",
      type: "",
      amount: "",
      date: "",
    });
    setEditingId(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (inv: Investment) => {
    setForm({ ...inv });
    setEditingId(inv.id);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setInvestments((prev) => prev.filter((inv) => inv.id !== id));
  };

  const total = investments.reduce(
    (sum, inv) => sum + (parseFloat(inv.amount) || 0),
    0
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 lg:p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6 lg:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-8 w-8 text-primary" />
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              Investimentos
            </h1>
          </div>
          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) {
                setEditingId(null);
                setForm({
                  product: "",
                  broker: "",
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
                Novo Investimento
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "Editar Investimento" : "Adicionar Investimento"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 py-2">
                <div>
                  <Label htmlFor="product">Produto Financeiro</Label>
                  <Input
                    id="product"
                    value={form.product}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, product: e.target.value }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="broker">Corretora</Label>
                  <Select
                    value={form.broker}
                    onValueChange={(value) =>
                      setForm((f) => ({ ...f, broker: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {brokers.map((b) => (
                        <SelectItem key={b} value={b}>
                          {b}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="type">Tipo de Investimento</Label>
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
                      {investmentTypes.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="amount">Valor Investido</Label>
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
                  <Label htmlFor="date">Data do Aporte</Label>
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
                  {editingId ? "Salvar Alterações" : "Adicionar Investimento"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="mb-6 border-l-4 border-l-primary bg-primary/10">
          <CardContent className="flex items-center gap-4 py-4">
            <TrendingUp className="h-6 w-6 text-primary" />
            <div>
              <p className="font-medium text-primary">Dica</p>
              <p className="text-sm text-muted-foreground">
                Atualize os valores investidos mensalmente ou periodicamente
                para manter seu controle sempre atualizado!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de investimentos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base lg:text-lg flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Meus Investimentos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Produto Financeiro</TableHead>
                    <TableHead>Corretora</TableHead>
                    <TableHead>Tipo de Investimento</TableHead>
                    <TableHead className="text-right">
                      Valor Investido
                    </TableHead>
                    <TableHead>Data do Aporte</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {investments.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-muted-foreground py-8"
                      >
                        Nenhum investimento cadastrado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    investments.map((inv) => (
                      <TableRow key={inv.id}>
                        <TableCell className="font-medium">
                          {inv.product}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{inv.broker}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{inv.type}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          R${" "}
                          {parseFloat(inv.amount).toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {inv.date &&
                              new Date(inv.date).toLocaleDateString("pt-BR")}
                          </div>
                        </TableCell>
                        <TableCell className="text-right flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(inv)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(inv.id)}
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

export default Investimentos;
