import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Settings,
  User,
  Bell,
  Moon,
  Sun,
  Download,
  Upload,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Configuracoes = () => {
  const [settings, setSettings] = useState({
    name: "João Silva",
    email: "joao@email.com",
    currency: "BRL",
    language: "pt-BR",
    darkMode: false,
    notifications: true,
    emailNotifications: false,
    monthlyReports: true,
    dataBackup: true,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Sincroniza o modo escuro com a tag <html>
  useEffect(() => {
    const html = document.documentElement;
    if (settings.darkMode) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [settings.darkMode]);

  // Salvar no localStorage
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(settings.darkMode));
  }, [settings.darkMode]);

  // E na inicialização:
  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) {
      setSettings((prev) => ({
        ...prev,
        darkMode: JSON.parse(saved),
      }));
    }
  }, []);

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const exportData = () => {
    console.log("Exportando dados...");
  };

  const importData = () => {
    console.log("Importando dados...");
  };

  const clearData = () => {
    if (
      confirm(
        "Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita."
      )
    ) {
      console.log("Limpando dados...");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem("financi_user_name", settings.name); // Salva o nome
      navigate("/login");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 lg:p-6 max-w-4xl">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
            Configurações
          </h1>
          <p className="text-sm lg:text-base text-muted-foreground">
            Personalize sua experiência no FinanceFlow
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader className="px-4 lg:px-6 py-4">
              <CardTitle className="text-base lg:text-lg flex items-center gap-2">
                <User className="h-4 w-4 lg:h-5 lg:w-5" />
                Perfil do Usuário
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 lg:px-6 pb-4 lg:pb-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={settings.name}
                    onChange={(e) =>
                      handleSettingChange("name", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) =>
                      handleSettingChange("email", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button>Salvar Perfil</Button>
              </div>
            </CardContent>
          </Card>

          {/* Regional Settings */}
          <Card>
            <CardHeader className="px-4 lg:px-6 py-4">
              <CardTitle className="text-base lg:text-lg flex items-center gap-2">
                <Settings className="h-4 w-4 lg:h-5 lg:w-5" />
                Configurações Regionais
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 lg:px-6 pb-4 lg:pb-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Moeda</Label>
                  <Select
                    value={settings.currency}
                    onValueChange={(value) =>
                      handleSettingChange("currency", value)
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BRL">Real Brasileiro (R$)</SelectItem>
                      <SelectItem value="USD">Dólar Americano ($)</SelectItem>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Idioma</Label>
                  <Select
                    value={settings.language}
                    onValueChange={(value) =>
                      handleSettingChange("language", value)
                    }
                  >
                    <SelectTrigger className="mt-1">
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

          {/* Appearance Settings */}
          <Card>
            <CardHeader className="px-4 lg:px-6 py-4">
              <CardTitle className="text-base lg:text-lg flex items-center gap-2">
                {settings.darkMode ? (
                  <Moon className="h-4 w-4 lg:h-5 lg:w-5" />
                ) : (
                  <Sun className="h-4 w-4 lg:h-5 lg:w-5" />
                )}
                Aparência
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 lg:px-6 pb-4 lg:pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Modo Escuro</p>
                  <p className="text-sm text-muted-foreground">
                    Alterna entre tema claro e escuro
                  </p>
                </div>
                <Switch
                  checked={settings.darkMode}
                  onCheckedChange={(checked) =>
                    handleSettingChange("darkMode", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader className="px-4 lg:px-6 py-4">
              <CardTitle className="text-base lg:text-lg flex items-center gap-2">
                <Bell className="h-4 w-4 lg:h-5 lg:w-5" />
                Notificações
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 lg:px-6 pb-4 lg:pb-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notificações Push</p>
                  <p className="text-sm text-muted-foreground">
                    Receba notificações no navegador
                  </p>
                </div>
                <Switch
                  checked={settings.notifications}
                  onCheckedChange={(checked) =>
                    handleSettingChange("notifications", checked)
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notificações por Email</p>
                  <p className="text-sm text-muted-foreground">
                    Receba relatórios e alertas por email
                  </p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) =>
                    handleSettingChange("emailNotifications", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Relatórios Mensais</p>
                  <p className="text-sm text-muted-foreground">
                    Receba um resumo mensal das suas finanças
                  </p>
                </div>
                <Switch
                  checked={settings.monthlyReports}
                  onCheckedChange={(checked) =>
                    handleSettingChange("monthlyReports", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader className="px-4 lg:px-6 py-4">
              <CardTitle className="text-base lg:text-lg">
                Gerenciamento de Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 lg:px-6 pb-4 lg:pb-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Backup Automático</p>
                  <p className="text-sm text-muted-foreground">
                    Faça backup automático dos seus dados
                  </p>
                </div>
                <Switch
                  checked={settings.dataBackup}
                  onCheckedChange={(checked) =>
                    handleSettingChange("dataBackup", checked)
                  }
                />
              </div>

              <Separator />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  onClick={exportData}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Exportar Dados</span>
                  <span className="sm:hidden">Exportar</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={importData}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  <span className="hidden sm:inline">Importar Dados</span>
                  <span className="sm:hidden">Importar</span>
                </Button>

                <Button
                  variant="destructive"
                  onClick={clearData}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Limpar Dados</span>
                  <span className="sm:hidden">Limpar</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* About */}
          <Card>
            <CardHeader className="px-4 lg:px-6 py-4">
              <CardTitle className="text-base lg:text-lg">
                Sobre o FinanceFlow
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 lg:px-6 pb-4 lg:pb-6">
              <div className="text-sm text-muted-foreground space-y-2">
                <p>
                  <strong>Versão:</strong> 1.0.0
                </p>
                <p>
                  <strong>Desenvolvido por:</strong> FinanceFlow Team
                </p>
                <p>
                  <strong>Última atualização:</strong> Janeiro 2024
                </p>
                <p className="pt-2">
                  Sistema moderno de controle financeiro pessoal com foco em
                  simplicidade e eficiência.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Configuracoes;
