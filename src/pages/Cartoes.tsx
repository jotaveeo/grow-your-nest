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

const initialCards = [
  {
    id: 1,
    name: "Nubank",
    color: "#9e02db",
    logo: "/image1.png",
    limit: 3000,
    dueDay: 11,
    main: true,
  },
  {
    id: 2,
    name: "Banco do Brasil",
    color: "#ffe600",
    logo: "/image2.png",
    limit: 2493,
    dueDay: 16,
    main: false,
  },
  {
    id: 3,
    name: "Itaú",
    color: "#ff7f32",
    logo: "/image.png",
    limit: 6000,
    dueDay: 5,
    main: false,
  },
  {
    id: 4,
    name: "Bradesco",
    color: "#ff2a5c",
    logo: "/image3.png",
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
    color: "#a259e6",
    logo: "",
    limit: "",
    dueDay: "",
    main: false,
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleAddOrEditCard = (e: React.FormEvent) => {
    e.preventDefault();
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
      color: "#a259e6",
      logo: "",
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
      logo: card.logo,
      limit: String(card.limit),
      dueDay: String(card.dueDay),
      main: card.main,
    });
    setEditingId(card.id);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSetMain = (id: number) => {
    setCards((prev) => prev.map((c) => ({ ...c, main: c.id === id })));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 lg:p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6 lg:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
                  color: "#a259e6",
                  logo: "",
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

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <Card
              key={card.id}
              className="relative overflow-hidden shadow-md rounded-xl border-0"
              style={{ background: card.color }}
            >
              <CardHeader className="flex flex-col items-center justify-center py-8">
                {card.logo ? (
                  <img src={card.logo} alt={card.name} className="h-14 mb-4" />
                ) : (
                  <CreditCard className="h-14 w-14 text-white mb-4" />
                )}
                <CardTitle
                  className="text-2xl font-bold drop-shadow"
                  style={{
                    color: "#fff",
                    textShadow: "0 1px 8px rgba(0,0,0,0.18)",
                  }}
                >
                  {card.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-white/80 dark:bg-black/30 text-black dark:text-white p-5 space-y-3 rounded-b-xl">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  <span>
                    Limite:{" "}
                    <span className="font-semibold">
                      R${" "}
                      {card.limit.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Vencimento: dia{" "}
                    <span className="font-semibold">{card.dueDay}</span>
                  </span>
                </div>
                <div className="flex flex-col gap-2 mt-2">
                  <Button
                    size="sm"
                    variant={card.main ? "default" : "outline"}
                    className={
                      card.main
                        ? "bg-green-600 hover:bg-green-700 text-white font-semibold"
                        : "font-semibold"
                    }
                    onClick={() => handleSetMain(card.id)}
                  >
                    <Star className="h-4 w-4" />
                    Definir como Principal
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(card)}
                      className="flex-1 flex items-center justify-center"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(card.id)}
                      className="flex-1 flex items-center justify-center"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {card.main && (
                  <Badge className="absolute top-3 right-3 bg-green-600 text-white shadow-lg px-3 py-1 rounded-full">
                    Principal
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {cards.length === 0 && (
          <Card className="mt-8">
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
