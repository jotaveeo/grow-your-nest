import {
  TrendingUp,
  BarChart3,
  Calendar,
  CreditCard,
  FileText,
  Home,
  PlusCircle,
  Settings,
  Upload,
  Target,
  Heart,
  PiggyBank,
  Receipt,
  Wallet,
  CalendarDays,
  Shield,
  DollarSign,
  ShieldBan,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { PlanBadge } from "@/components/PlanBadge";
import { UpgradeModal } from "@/components/UpgradeModal";
import { usePlan } from "@/contexts/PlanContext";
import { useState } from "react";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home, feature: "dashboard" },
  { title: "Novo Lançamento", url: "/lancamento", icon: PlusCircle, feature: "newLaunch" },
  { title: "Histórico", url: "/historico", icon: FileText, feature: "history" },
];

const planningItems = [
  { title: "Metas Financeiras", url: "/metas", icon: Target, feature: "hasGoals" },
  { title: "Lista de Desejos", url: "/wishlist", icon: Heart, feature: "hasWishlist" },
  { title: "Meu Cofrinho", url: "/cofrinho", icon: PiggyBank, feature: "hasPiggyBank" },
];

const controlItems = [
  { title: "Minhas Dívidas", url: "/dividas", icon: Receipt, feature: "hasDebts" },
  { title: "Cartões de Crédito", url: "/cartoes", icon: CreditCard, feature: "hasCreditCards" },
  { title: "Resumo Calendário", url: "/calendario", icon: CalendarDays, feature: "hasCalendar" },
  { title: "Limites de Gastos", url: "/limites", icon: Shield, feature: "hasLimits" },
  { title: "Gastos Fixos", url: "/gastosfixos", icon: ShieldBan, feature: "hasFixedExpenses" },
];

const investmentItems = [
  { title: "Investimentos", url: "/investimentos", icon: TrendingUp, feature: "hasInvestments" },
  { title: "Fontes de Receita", url: "/receitas", icon: DollarSign, feature: "hasIncomeSources" },
];

const reportItems = [
  { title: "Relatórios", url: "/relatorios", icon: BarChart3, feature: "hasReports" },
  { title: "Importar", url: "/importar", icon: Upload, feature: "hasImport" },
];

const systemItems = [
  { title: "Categorias", url: "/categorias", icon: Wallet, feature: "hasCategories" },
  { title: "Configurações", url: "/configuracoes", icon: Settings, feature: "hasSettings" },
];

export function AppSidebar() {
  const location = useLocation();
  const sidebar = useSidebar();
  const { canAccess, currentPlan } = usePlan();
  const [upgradeModal, setUpgradeModal] = useState<{
    isOpen: boolean;
    requiredPlan: 'essencial' | 'plus';
    feature: string;
  }>({
    isOpen: false,
    requiredPlan: 'essencial',
    feature: '',
  });

  const handleMenuClick = () => {
    if (sidebar?.isMobile) {
      sidebar.setOpenMobile(false);
    }
  };

  const handleRestrictedClick = (feature: string, requiredPlan: 'essencial' | 'plus') => {
    setUpgradeModal({
      isOpen: true,
      requiredPlan,
      feature,
    });
  };

  const renderMenuItem = (item: typeof menuItems[0], requiredPlan?: 'essencial' | 'plus') => {
    const isFeatureRestricted = !canAccess(item.feature as any);
    const displayRequiredPlan = requiredPlan || (item.feature === 'hasReports' || item.feature === 'hasImport' ? 'essencial' : 'plus');

    if (isFeatureRestricted) {
      return (
        <div
          className="flex items-center gap-2 cursor-pointer opacity-60"
          onClick={() => handleRestrictedClick(item.title, displayRequiredPlan)}
        >
          <item.icon className="h-4 w-4" />
          <span>{item.title}</span>
          <PlanBadge requiredPlan={displayRequiredPlan} className="ml-auto" />
        </div>
      );
    } else {
      return (
        <Link to={item.url} onClick={handleMenuClick}>
          <item.icon className="h-4 w-4" />
          <span>{item.title}</span>
        </Link>
      );
    }
  };

  return (
    <>
      <Sidebar>
        <SidebarHeader className="border-b border-sidebar-border p-4 bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center shadow">
            <TrendingUp className="h-5 w-5 text-white" aria-label="Logo" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">FinanciControl</h2>
            <p className="text-xs text-blue-100">Seu dinheiro sob controle</p>
          </div>
        </div>
      </SidebarHeader>
        <SidebarContent className="py-4">
          <SidebarGroup>
            <SidebarGroupLabel>Principal</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild={!(!canAccess(item.feature as any))}
                      isActive={location.pathname === item.url}
                      className={
                        location.pathname === item.url
                          ? "bg-primary/10 text-primary font-semibold"
                          : ""
                      }
                    >
                      {renderMenuItem(item)}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <div className="my-2" />

        <SidebarGroup>
          <SidebarGroupLabel>Planejamento</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {planningItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild={!(!canAccess(item.feature as any))}
                    isActive={location.pathname === item.url}
                    className={
                      location.pathname === item.url
                        ? "bg-primary/10 text-primary font-semibold"
                        : ""
                    }
                  >
                    {renderMenuItem(item, 'essencial')}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="my-2" />

        <SidebarGroup>
          <SidebarGroupLabel>Controle</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {controlItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild={!(!canAccess(item.feature as any))}
                    isActive={location.pathname === item.url}
                    className={
                      location.pathname === item.url
                        ? "bg-primary/10 text-primary font-semibold"
                        : ""
                    }
                  >
                    {renderMenuItem(item, 'essencial')}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="my-2" />

        <SidebarGroup>
          <SidebarGroupLabel>Investimentos</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {investmentItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild={!(!canAccess(item.feature as any))}
                    isActive={location.pathname === item.url}
                    className={
                      location.pathname === item.url
                        ? "bg-primary/10 text-primary font-semibold"
                        : ""
                    }
                  >
                    {renderMenuItem(item, 'essencial')}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="my-2" />

          <SidebarGroup>
            <SidebarGroupLabel>Relatórios</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {reportItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild={!(!canAccess(item.feature as any))}
                      isActive={location.pathname === item.url}
                      className={
                        location.pathname === item.url
                          ? "bg-primary/10 text-primary font-semibold"
                          : ""
                      }
                    >
                      {renderMenuItem(item)}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <div className="my-2" />

        <SidebarGroup>
          <SidebarGroupLabel>Sistema</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild={!(!canAccess(item.feature as any))}
                    isActive={location.pathname === item.url}
                    className={
                      location.pathname === item.url
                        ? "bg-primary/10 text-primary font-semibold"
                        : ""
                    }
                  >
                    {renderMenuItem(item, 'essencial')}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      </Sidebar>

      <UpgradeModal
        isOpen={upgradeModal.isOpen}
        onClose={() => setUpgradeModal(prev => ({ ...prev, isOpen: false }))}
        requiredPlan={upgradeModal.requiredPlan}
        feature={upgradeModal.feature}
      />
    </>
  );
}


