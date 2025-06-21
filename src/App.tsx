
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { FinanceExtendedProvider } from "@/contexts/FinanceExtendedContext";
import Dashboard from "./pages/Dashboard";
import NovoLancamento from "./pages/NovoLancamento";
import Historico from "./pages/Historico";
import Importar from "./pages/Importar";
import Relatorios from "./pages/Relatorios";
import Categorias from "./pages/Categorias";
import Configuracoes from "./pages/Configuracoes";
import Metas from "./pages/Metas";
import Wishlist from "./pages/Wishlist";
import Calendario from "./pages/Calendario";
import Limites from "./pages/Limites";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <FinanceExtendedProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SidebarProvider>
            <div className="min-h-screen flex w-full">
              <AppSidebar />
              <main className="flex-1 flex flex-col min-w-0">
                <div className="border-b border-sidebar-border p-2 lg:hidden">
                  <SidebarTrigger />
                </div>
                <div className="flex-1 overflow-auto">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/lancamento" element={<NovoLancamento />} />
                    <Route path="/historico" element={<Historico />} />
                    <Route path="/importar" element={<Importar />} />
                    <Route path="/relatorios" element={<Relatorios />} />
                    <Route path="/categorias" element={<Categorias />} />
                    <Route path="/configuracoes" element={<Configuracoes />} />
                    <Route path="/metas" element={<Metas />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/calendario" element={<Calendario />} />
                    <Route path="/limites" element={<Limites />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </main>
            </div>
          </SidebarProvider>
        </BrowserRouter>
      </FinanceExtendedProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
