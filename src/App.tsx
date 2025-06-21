
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { FinanceProvider } from "@/contexts/FinanceContext";
import Dashboard from "./pages/Dashboard";
import NovoLancamento from "./pages/NovoLancamento";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <FinanceProvider>
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
                    {/* Placeholder routes - será implementado nas próximas iterações */}
                    <Route path="/historico" element={<div className="p-6"><h1 className="text-2xl font-bold">Histórico - Em desenvolvimento</h1></div>} />
                    <Route path="/importar" element={<div className="p-6"><h1 className="text-2xl font-bold">Importar - Em desenvolvimento</h1></div>} />
                    <Route path="/relatorios" element={<div className="p-6"><h1 className="text-2xl font-bold">Relatórios - Em desenvolvimento</h1></div>} />
                    <Route path="/categorias" element={<div className="p-6"><h1 className="text-2xl font-bold">Categorias - Em desenvolvimento</h1></div>} />
                    <Route path="/configuracoes" element={<div className="p-6"><h1 className="text-2xl font-bold">Configurações - Em desenvolvimento</h1></div>} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </main>
            </div>
          </SidebarProvider>
        </BrowserRouter>
      </FinanceProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
