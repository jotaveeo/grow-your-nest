
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Settings,
  User,
  Bell,
  Shield,
  Moon,
  Sun,
  Palette,
  Database,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { BackButton } from "@/components/BackButton";
import { useToast } from "@/hooks/use-toast";
import { resetAllData } from "@/utils/resetData";

const Configuracoes = () => {
  const { toast } = useToast();
  const [theme, setTheme] = useState("system");
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [currency, setCurrency] = useState("BRL");
  const [language, setLanguage] = useState("pt-BR");
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  const handleResetData = () => {
    resetAllData();
    setIsResetDialogOpen(false);
    toast({
      title: "Dados resetados",
      description: "Todos os dados foram limpos e a página será recarregada.",
    });
  };

  const handleExportData = () => {
    // Coleta todos os dados do localStorage
    const data = {
      transactions: localStorage.getItem('financeflow_transactions'),
      categories: localStorage.getItem('financeflow_categories'),
      goals: localStorage.getItem('financeflow_goals'),
      wishlist: localStorage.getItem('financeflow_wishlist'),
      piggybank: localStorage.getItem('financeflow_piggybank'),
      debts: localStorage.getItem('financeflow_debts'),
      creditcards: localStorage.getItem('financeflow_creditcards'),
      limits: localStorage.getItem('financeflow_limits'),
      investments: localStorage.getItem('financeflow_investments'),
      fixedexpenses: localStorage.getItem('financeflow_fixedexpenses'),
      incomesources: localStorage.getItem('financeflow_incomesources'),
    };

    // Cria o arquivo de backup
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    // Cria o link de download
    const link = document.createElement('a');
    link.href = url;
    link.download = `financeflow-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    // Limpa a URL
    URL.revokeObjectURL(url);
    
    toast({
      title: "Backup criado",
      description: "Seus dados foram exportados com sucesso.",
    });
  };

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <div className="container mx-auto p-4 lg:p-6 max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4 animate-slide-in-left">
          <BackButton />
        </div>

        <div
          className="mb-6 lg:mb-8 animate-slide-in-left"
          style={{ animationDelay: "100ms" }}
        >
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
            Configurações
          </h1>
          <p className="text-sm lg:text-base text-muted-foreground">
            Personalize sua experiência no FinanceFlow
          </p>
        </div>

        <div className="space-y-6">
          {/* Perfil */}
          <Card className="animate-scale-in" style={{ animationDelay: "200ms" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Perfil
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome completo</Label>
                  <Input id="name" placeholder="Seu nome" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="seu@email.com" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Aparência */}
          <Card className="animate-scale-in" style={{ animationDelay: "300ms" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Aparência
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Modo escuro</Label>
                  <p className="text-sm text-muted-foreground">
                    Alternar entre tema claro e escuro
                  </p>
                </div>
                <Switch
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Tema</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4" />
                        Claro
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        Escuro
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Sistema
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notificações */}
          <Card className="animate-scale-in" style={{ animationDelay: "400ms" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notificações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificações push</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba lembretes sobre metas e vencimentos
                  </p>
                </div>
                <Switch
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>
            </CardContent>
          </Card>

          {/* Localização */}
          <Card className="animate-scale-in" style={{ animationDelay: "500ms" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Localização
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Moeda</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BRL">Real (R$)</SelectItem>
                      <SelectItem value="USD">Dólar ($)</SelectItem>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Idioma</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="es-ES">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dados e Backup */}
          <Card className="animate-scale-in" style={{ animationDelay: "600ms" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Dados e Backup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={handleExportData} variant="outline" className="flex-1">
                  <Database className="h-4 w-4 mr-2" />
                  Exportar Dados
                </Button>
                
                <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="flex-1">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Resetar Dados
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        Resetar Todos os Dados
                      </DialogTitle>
                      <DialogDescription>
                        Esta ação irá apagar permanentemente todos os seus dados salvos, incluindo:
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li>Todas as transações</li>
                          <li>Categorias personalizadas</li>
                          <li>Metas financeiras</li>
                          <li>Lista de desejos</li>
                          <li>Dados do cofrinho</li>
                          <li>Cartões de crédito</li>
                          <li>Dívidas</li>
                          <li>Investimentos</li>
                          <li>Gastos fixos</li>
                          <li>Regras de categorização</li>
                        </ul>
                        <p className="mt-3 font-semibold text-destructive">
                          Esta ação não pode ser desfeita!
                        </p>
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex gap-2 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setIsResetDialogOpen(false)}
                        className="flex-1"
                      >
                        Cancelar
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleResetData}
                        className="flex-1"
                      >
                        Sim, Resetar Tudo
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              <Separator />
              
              <div className="text-sm text-muted-foreground">
                <p className="font-medium mb-2">Sobre o reset de dados:</p>
                <ul className="space-y-1">
                  <li>• Todos os dados serão removidos permanentemente</li>
                  <li>• O aplicativo será reiniciado com categorias atualizadas</li>
                  <li>• Recomendamos fazer backup antes de resetar</li>
                  <li>• A página será recarregada automaticamente</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center pt-4">
            <Button size="lg" className="w-full sm:w-auto">
              Salvar Configurações
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuracoes;
