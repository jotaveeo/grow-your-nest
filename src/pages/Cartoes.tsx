import { useState } from "react";
import {
  CreditCard,
  Calendar,
  Target,
  Star,
  Plus,
  Trash2,
  Edit,
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
import { Badge } from "@/components/ui/badge";
import { BackButton } from "@/components/BackButton";
import { useToast } from "@/hooks/use-toast"; // Se você já usa toast no projeto

const initialCards = [
  {
    id: 1,
    name: "Nubank",
    color: "#A020F0",
    limit: 3000,
    dueDay: 11,
    main: true,
  },
  {
    id: 2,
    name: "Banco do Brasil",
    color: "#FFDE21",
    limit: 2493,
    dueDay: 16,
    main: false,
  },
  {
    id: 3,
    name: "Itaú",
    color: "#FF6200",
    limit: 6000,
    dueDay: 5,
    main: false,
  },
  {
    id: 4,
    name: "Bradesco",
    color: "#cc092f",
    limit: 6000,
    dueDay: 5,
    main: false,
  },
];

const Cartoes = () => {
  const [cards, setCards] = useState(initialCards);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    color: "#8a2be2",
    limit: "",
    dueDay: "",
    main: false,
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const { toast } = useToast();

  const handleAddOrEditCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast({ title: "Nome obrigatório", variant: "destructive" });
      return;
    }
    if (
      cards.some(
        (c) =>
          c.name.toLowerCase() === form.name.trim().toLowerCase() &&
          c.id !== editingId
      )
    ) {
      toast({
        title: "Já existe um cartão com esse nome",
        variant: "destructive",
      });
      return;
    }
    if (Number(form.limit) <= 0) {
      toast({
        title: "O limite deve ser maior que zero",
        variant: "destructive",
      });
      return;
    }
    if (Number(form.dueDay) < 1 || Number(form.dueDay) > 31) {
      toast({
        title: "O dia de vencimento deve ser entre 1 e 31",
        variant: "destructive",
      });
      return;
    }
    if (editingId !== null) {
      setCards((prev) =>
        prev.map((c) =>
          c.id === editingId
            ? {
                ...c,
                ...form,
                limit: Number(form.limit),
                dueDay: Number(form.dueDay),
              }
            : c
        )
      );
    } else {
      setCards((prev) => [
        ...prev,
        {
          ...form,
          id: Date.now(),
          limit: Number(form.limit),
          dueDay: Number(form.dueDay),
        },
      ]);
    }
    setForm({
      name: "",
      color: "#8a2be2",
      limit: "",
      dueDay: "",
      main: false,
    });
    setEditingId(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (card: (typeof initialCards)[0]) => {
    setForm({
      name: card.name,
      color: card.color,
      limit: String(card.limit),
      dueDay: String(card.dueDay),
      main: card.main,
    });
    setEditingId(card.id);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Tem certeza que deseja remover este cartão?")) {
      setCards((prev) => prev.filter((c) => c.id !== id));
      toast({ title: "Cartão removido com sucesso!" });
    }
  };

  const handleSetMain = (id: number) => {
    setCards((prev) => prev.map((c) => ({ ...c, main: c.id === id })));
  };

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <div className="container mx-auto p-4 lg:p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4 animate-slide-in-left">
          <BackButton />
          <span className="ml-auto text-sm text-muted-foreground">
            {cards.length} cartão{cards.length !== 1 && "s"}
          </span>
        </div>

        <div
          className="mb-6 lg:mb-8 animate-slide-in-left"
          style={{ animationDelay: "100ms" }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
                <CreditCard className="h-6 w-6 lg:h-8 lg:w-8 text-primary" />
                Meus Cartões de Crédito
              </h1>
              <p className="text-sm lg:text-base text-muted-foreground">
                Gerencie seus cartões, limites e datas de vencimento
              </p>
            </div>
            <Dialog
              open={isDialogOpen}
              onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) {
                  setEditingId(null);
                  setForm({
                    name: "",
                    color: "#8a2be2",
                    limit: "",
                    dueDay: "",
                    main: false,
                  });
                }
              }}
            >
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Novo Cartão
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingId ? "Editar Cartão" : "Adicionar Cartão"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddOrEditCard} className="space-y-4 py-2">
                  <div>
                    <Label htmlFor="name">Nome do Cartão</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="color">Cor do Cartão</Label>
                    <Input
                      id="color"
                      type="color"
                      value={form.color}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, color: e.target.value }))
                      }
                      className="w-16 h-10 p-0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="limit">Limite (R$)</Label>
                    <Input
                      id="limit"
                      type="number"
                      min={0}
                      value={form.limit}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, limit: e.target.value }))
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="dueDay">Dia de Vencimento</Label>
                    <Input
                      id="dueDay"
                      type="number"
                      min={1}
                      max={31}
                      value={form.dueDay}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, dueDay: e.target.value }))
                      }
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full mt-2">
                    {editingId ? "Salvar Alterações" : "Adicionar Cartão"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <Card
              key={card.id}
              className={`relative overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg animate-scale-in hover-lift
                ${card.main ? "ring-2 ring-violet-700" : ""}
              `}
              style={{ animationDelay: `${200 + index * 100}ms` }}
            >
              {/* Card Header com a cor do cartão */}
              <div
                className="h-16 relative"
                style={{ backgroundColor: card.color }}
              >
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute top-3 left-4 text-white font-bold text-lg">
                  {card.name}
                </div>
                {card.main && (
                  <Badge className="absolute top-3 right-3 bg-violet-950 text-white">
                    <Star className="h-3 w-3 mr-1" />
                    Principal
                  </Badge>
                )}
              </div>

              <CardContent className="p-4 space-y-4">
                {/* Informações do cartão */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Target className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">Limite:</span>
                    <span className="font-semibold ml-auto">
                      R${" "}
                      {card.limit.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">Vencimento:</span>
                    <span className="font-semibold ml-auto">
                      Dia {card.dueDay}
                    </span>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex flex-col gap-2 pt-2 border-t">
                  <Button
                    size="sm"
                    variant={card.main ? "default" : "outline"}
                    onClick={() => handleSetMain(card.id)}
                    className={
                      card.main
                        ? "bg-violet-700 hover:bg-violet-900"
                        : "hover-scale"
                    }
                  >
                    <Star className="h-4 w-4 mr-2" />
                    {card.main ? "Principal" : "Definir Principal"}
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(card)}
                      className="flex-1 hover-scale"
                      aria-label={`Editar cartão ${card.name}`}
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(card.id)}
                      className="flex-1 hover-scale"
                      aria-label={`Remover cartão ${card.name}`}
                      title="Remover"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {cards.length === 0 && (
          <Card
            className="mt-8 animate-scale-in"
            style={{ animationDelay: "200ms" }}
          >
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Nenhum cartão cadastrado
              </h3>
              <p className="text-muted-foreground text-center mb-4">
                Adicione seus cartões de crédito para controlar limites e
                vencimentos
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeiro Cartão
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Cartoes;
