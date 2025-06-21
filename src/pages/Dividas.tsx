import { useState } from "react";
import { Receipt, Plus, Trash2, Edit, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const months = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
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
  const [selectedMonth, setSelectedMonth] = useState(months[new Date().getMonth()]);
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
        prev.map((d) =>
          d.id === editingId ? { ...d, ...form } : d
        )
      );
    } else {
      setDebts((prev) => [
        ...prev,
        { ...form, id: Date.now().toString() }
      ]);
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 lg:p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6 lg:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3 mb-2">
            <Receipt className="h-8 w-8 text-primary" />
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              Minhas Dívidas
            </h1>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
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
          }}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nova Dívida
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{editingId ? "Editar Dívida" : "Adicionar Dívida"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 py-2">
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Input
                    id="description"
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="creditor">Para quem está devendo?</Label>
                  <Input
                    id="creditor"
                    value={form.creditor}
                    onChange={e => setForm(f => ({ ...f, creditor: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="date">Data</Label>
                  <Input
                    id="date"
                    type="date"
                    value={form.date}
                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
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
                      onChange={e => setForm(f => ({ ...f, installmentValue: e.target.value }))}
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
                      onChange={e => setForm(f => ({ ...f, totalValue: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="month">Mês de Referência</Label>
                  <Select value={form.month} onValueChange={value => setForm(f => ({ ...f, month: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((m) => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
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

        {/* Tabs de meses */}
        <div className="flex flex-wrap gap-2 mb-4">
          {months.map((m) => (
            <Button
              key={m}
              variant={selectedMonth === m ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedMonth(m)}
            >
              {m}
            </Button>
          ))}
        </div>

        {/* Tabela de dívidas */}
        <Card>
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
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        Nenhuma dívida cadastrada para este mês.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDebts.map((debt) => (
                      <TableRow key={debt.id}>
                        <TableCell>{debt.description}</TableCell>
                        <TableCell>{debt.creditor}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {debt.date}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          R$ {parseFloat(debt.installmentValue).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-right">
                          R$ {parseFloat(debt.totalValue).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-right flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(debt)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(debt.id)}
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dividas;