import { useState } from "react";
import { Receipt, Plus, Trash2, Edit, Calendar } from "lucide-react";
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

type Debt = {
  id: string;
  description: string;
  creditor: string;
  date: string;
  installmentValue: string;
  totalValue: string;
  month: string;
};

const Dividas = () => {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(
    months[new Date().getMonth()]
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState<Omit<Debt, "id">>({
    description: "",
    creditor: "",
    date: "",
    installmentValue: "",
    totalValue: "",
    month: selectedMonth,
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setDebts((prev) =>
        prev.map((d) => (d.id === editingId ? { ...d, ...form } : d))
      );
    } else {
      setDebts((prev) => [...prev, { ...form, id: Date.now().toString() }]);
    }
    setForm({
      description: "",
      creditor: "",
      date: "",
      installmentValue: "",
      totalValue: "",
      month: selectedMonth,
    });
    setEditingId(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (debt: Debt) => {
    setForm({ ...debt });
    setEditingId(debt.id);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setDebts((prev) => prev.filter((d) => d.id !== id));
  };

  const filteredDebts = debts.filter((d) => d.month === selectedMonth);

  const today = new Date();

  const totalMonth = filteredDebts.reduce(
    (sum, d) => sum + (parseFloat(d.totalValue) || 0),
    0
  );

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
            <div className="flex items-center gap-3 mb-2">
              <Receipt className="h-8 w-8 text-primary" />
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                Minhas Dívidas
              </h1>
            </div>
            <Dialog
              open={isDialogOpen}
              onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) {
                  setEditingId(null);
                  setForm({
                    description: "",
                    creditor: "",
                    date: "",
                    installmentValue: "",
                    totalValue: "",
                    month: selectedMonth,
                  });
                }
              }}
            >
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Nova Dívida
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingId ? "Editar Dívida" : "Adicionar Dívida"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Input
                      id="description"
                      value={form.description}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, description: e.target.value }))
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="creditor">Para quem está devendo?</Label>
                    <Input
                      id="creditor"
                      value={form.creditor}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, creditor: e.target.value }))
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="date">Data</Label>
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
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Label htmlFor="installmentValue">Valor da Parcela</Label>
                      <Input
                        id="installmentValue"
                        type="number"
                        min={0}
                        step="0.01"
                        value={form.installmentValue}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            installmentValue: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="totalValue">Valor Total</Label>
                      <Input
                        id="totalValue"
                        type="number"
                        min={0}
                        step="0.01"
                        value={form.totalValue}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, totalValue: e.target.value }))
                        }
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="month">Mês de Referência</Label>
                    <Select
                      value={form.month}
                      onValueChange={(value) =>
                        setForm((f) => ({ ...f, month: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((m) => (
                          <SelectItem key={m} value={m}>
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full mt-2">
                    {editingId ? "Salvar Alterações" : "Adicionar Dívida"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Tabs de meses */}
        <div
          className="flex flex-wrap gap-2 mb-4 animate-slide-in-left"
          style={{ animationDelay: "200ms" }}
        >
          {months.map((m) => (
            <Button
              key={m}
              variant={selectedMonth === m ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedMonth(m)}
              className="hover-lift"
            >
              {m}
            </Button>
          ))}
        </div>

        {/* Tabela de dívidas */}
        <Card className="animate-scale-in" style={{ animationDelay: "300ms" }}>
          <CardHeader>
            <CardTitle className="text-base lg:text-lg flex items-center gap-2">
              <Receipt className="h-4 w-4 text-primary" />
              Dívidas de {selectedMonth}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Descrição</TableHead>
                    <TableHead>Para quem?</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Valor Parcela</TableHead>
                    <TableHead className="text-right">Valor Total</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDebts.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-muted-foreground py-8"
                      >
                        Nenhuma dívida cadastrada para este mês.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDebts.map((debt) => {
                      const isOverdue = new Date(debt.date) < today;
                      return (
                        <TableRow
                          key={debt.id}
                          className={`hover:bg-muted/30 transition-colors ${
                            isOverdue ? "bg-red-50 dark:bg-red-900/10" : ""
                          }`}
                        >
                          <TableCell>{debt.description}</TableCell>
                          <TableCell>{debt.creditor}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              {debt.date}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            R${" "}
                            {parseFloat(debt.installmentValue).toLocaleString(
                              "pt-BR",
                              { minimumFractionDigits: 2 }
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            R${" "}
                            {parseFloat(debt.totalValue).toLocaleString(
                              "pt-BR",
                              {
                                minimumFractionDigits: 2,
                              }
                            )}
                          </TableCell>
                          <TableCell className="text-right flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(debt)}
                              className="hover-scale"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(debt.id)}
                              className="hover-scale"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
                <tfoot>
                  <tr className="bg-muted/30 mx-4">
                    <td colSpan={3}></td>
                    <td className="text-right font-bold">
                      R${" "}
                      {filteredDebts
                        .reduce(
                          (sum, d) =>
                            sum + (parseFloat(d.installmentValue) || 0),
                          0
                        )
                        .toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="text-right font-bold">Total:</td>
                    <td className="text-right font-bold text-primary px-[1rem]">
                      R${" "}
                      {totalMonth.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                </tfoot>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dividas;
