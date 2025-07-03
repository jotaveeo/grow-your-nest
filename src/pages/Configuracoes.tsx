import { BackButton } from "@/components/BackButton";
import { useFinanceExtendedContext } from "@/contexts/FinanceExtendedContext";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { CategorizationRules } from "@/components/CategorizationRules";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Configuracoes = () => {
  const { transactions, categories, deleteTransaction, deleteCategory } = useFinanceExtendedContext();
  const { toast } = useToast();
  const [deleteAllTransactionsDialogOpen, setDeleteAllTransactionsDialogOpen] = useState(false);
  const [deleteAllCategoriesDialogOpen, setDeleteAllCategoriesDialogOpen] = useState(false);

  const handleDeleteAllTransactions = () => {
    if (transactions.length === 0) {
      toast({
        title: "Nenhuma transação para excluir",
        description: "Não há transações para serem excluídas.",
        variant: "destructive",
      });
      return;
    }

    transactions.forEach(transaction => {
      deleteTransaction(transaction.id);
    });

    toast({
      title: "Transações excluídas",
      description: "Todas as transações foram excluídas com sucesso.",
    });
    setDeleteAllTransactionsDialogOpen(false);
  };

  const handleDeleteAllCategories = () => {
    if (categories.length === 0) {
      toast({
        title: "Nenhuma categoria para excluir",
        description: "Não há categorias para serem excluídas.",
        variant: "destructive",
      });
      return;
    }

    categories.forEach(category => {
      deleteCategory(category.id);
    });

    toast({
      title: "Categorias excluídas",
      description: "Todas as categorias foram excluídas com sucesso.",
    });
    setDeleteAllCategoriesDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 lg:p-6 max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4 animate-slide-in-left">
          <BackButton />
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Configurações
          </h1>
        </div>

        <Tabs defaultValue="geral" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="geral">Geral</TabsTrigger>
            <TabsTrigger value="categorization">Categorização</TabsTrigger>
            <TabsTrigger value="dados">Dados</TabsTrigger>
          </TabsList>

          <TabsContent value="geral" className="space-y-6">
            {/* General Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Preferências Gerais</CardTitle>
                <CardDescription>
                  Ajuste as configurações básicas do seu aplicativo.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="theme">Tema</Label>
                  <Switch id="theme" disabled />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications">Notificações</Label>
                  <Switch id="notifications" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categorization">
            <CategorizationRules />
          </TabsContent>

          <TabsContent value="dados" className="space-y-6">
            {/* Data Management */}
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Dados</CardTitle>
                <CardDescription>
                  Exclua ou exporte seus dados financeiros.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <AlertDialog open={deleteAllTransactionsDialogOpen} onOpenChange={setDeleteAllTransactionsDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      Excluir Todas as Transações
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação irá excluir todas as suas transações. Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteAllTransactions}>Excluir</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog open={deleteAllCategoriesDialogOpen} onOpenChange={setDeleteAllCategoriesDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      Excluir Todas as Categorias
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação irá excluir todas as suas categorias. Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteAllCategories}>Excluir</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <Separator />
                <Button variant="outline" className="w-full" disabled>
                  Exportar Dados (CSV)
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Configuracoes;
