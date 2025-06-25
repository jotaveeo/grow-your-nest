
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
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Cofrinho from "./pages/Cofrinho";
import Dividas from "./pages/Dividas";
import Cartoes from "./pages/Cartoes";
import Investimentos from "./pages/Investimentos";
import Receitas from "./pages/Receitas";
import Funcionalidades from "./pages/Funcionalidades";
import Privacidade from "./pages/Privacidade";
import Termos from "./pages/Termos";
import LGPD from "./pages/Lgpd";
import Status from "./pages/Status";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <FinanceExtendedProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/funcionalidades" element={<Funcionalidades />} />
            <Route path="/privacidade" element={<Privacidade />} />
            <Route path="/termos" element={<Termos />} />
            <Route path="/lgpd" element={<LGPD />} />
            <Route path="/status" element={<Status />} />
            
            {/* Protected Routes with Sidebar */}
            <Route path="/dashboard" element={
              <SidebarProvider>
                <div className="min-h-screen flex w-full">
                  <AppSidebar />
                  <main className="flex-1 flex flex-col min-w-0">
                    <div className="border-b border-sidebar-border p-2 lg:hidden">
                      <SidebarTrigger />
                    </div>
                    <div className="flex-1 overflow-auto">
                      <Dashboard />
                    </div>
                  </main>
                </div>
              </SidebarProvider>
            } />
            <Route path="/lancamento" element={
              <SidebarProvider>
                <div className="min-h-screen flex w-full">
                  <AppSidebar />
                  <main className="flex-1 flex flex-col min-w-0">
                    <div className="border-b border-sidebar-border p-2 lg:hidden">
                      <SidebarTrigger />
                    </div>
                    <div className="flex-1 overflow-auto">
                      <NovoLancamento />
                    </div>
                  </main>
                </div>
              </SidebarProvider>
            } />
            <Route path="/historico" element={
              <SidebarProvider>
                <div className="min-h-screen flex w-full">
                  <AppSidebar />
                  <main className="flex-1 flex flex-col min-w-0">
                    <div className="border-b border-sidebar-border p-2 lg:hidden">
                      <SidebarTrigger />
                    </div>
                    <div className="flex-1 overflow-auto">
                      <Historico />
                    </div>
                  </main>
                </div>
              </SidebarProvider>
            } />
            <Route path="/importar" element={
              <SidebarProvider>
                <div className="min-h-screen flex w-full">
                  <AppSidebar />
                  <main className="flex-1 flex flex-col min-w-0">
                    <div className="border-b border-sidebar-border p-2 lg:hidden">
                      <SidebarTrigger />
                    </div>
                    <div className="flex-1 overflow-auto">
                      <Importar />
                    </div>
                  </main>
                </div>
              </SidebarProvider>
            } />
            <Route path="/relatorios" element={
              <SidebarProvider>
                <div className="min-h-screen flex w-full">
                  <AppSidebar />
                  <main className="flex-1 flex flex-col min-w-0">
                    <div className="border-b border-sidebar-border p-2 lg:hidden">
                      <SidebarTrigger />
                    </div>
                    <div className="flex-1 overflow-auto">
                      <Relatorios />
                    </div>
                  </main>
                </div>
              </SidebarProvider>
            } />
            <Route path="/categorias" element={
              <SidebarProvider>
                <div className="min-h-screen flex w-full">
                  <AppSidebar />
                  <main className="flex-1 flex flex-col min-w-0">
                    <div className="border-b border-sidebar-border p-2 lg:hidden">
                      <SidebarTrigger />
                    </div>
                    <div className="flex-1 overflow-auto">
                      <Categorias />
                    </div>
                  </main>
                </div>
              </SidebarProvider>
            } />
            <Route path="/configuracoes" element={
              <SidebarProvider>
                <div className="min-h-screen flex w-full">
                  <AppSidebar />
                  <main className="flex-1 flex flex-col min-w-0">
                    <div className="border-b border-sidebar-border p-2 lg:hidden">
                      <SidebarTrigger />
                    </div>
                    <div className="flex-1 overflow-auto">
                      <Configuracoes />
                    </div>
                  </main>
                </div>
              </SidebarProvider>
            } />
            <Route path="/metas" element={
              <SidebarProvider>
                <div className="min-h-screen flex w-full">
                  <AppSidebar />
                  <main className="flex-1 flex flex-col min-w-0">
                    <div className="border-b border-sidebar-border p-2 lg:hidden">
                      <SidebarTrigger />
                    </div>
                    <div className="flex-1 overflow-auto">
                      <Metas />
                    </div>
                  </main>
                </div>
              </SidebarProvider>
            } />
            <Route path="/wishlist" element={
              <SidebarProvider>
                <div className="min-h-screen flex w-full">
                  <AppSidebar />
                  <main className="flex-1 flex flex-col min-w-0">
                    <div className="border-b border-sidebar-border p-2 lg:hidden">
                      <SidebarTrigger />
                    </div>
                    <div className="flex-1 overflow-auto">
                      <Wishlist />
                    </div>
                  </main>
                </div>
              </SidebarProvider>
            } />
            <Route path="/calendario" element={
              <SidebarProvider>
                <div className="min-h-screen flex w-full">
                  <AppSidebar />
                  <main className="flex-1 flex flex-col min-w-0">
                    <div className="border-b border-sidebar-border p-2 lg:hidden">
                      <SidebarTrigger />
                    </div>
                    <div className="flex-1 overflow-auto">
                      <Calendario />
                    </div>
                  </main>
                </div>
              </SidebarProvider>
            } />
            <Route path="/limites" element={
              <SidebarProvider>
                <div className="min-h-screen flex w-full">
                  <AppSidebar />
                  <main className="flex-1 flex flex-col min-w-0">
                    <div className="border-b border-sidebar-border p-2 lg:hidden">
                      <SidebarTrigger />
                    </div>
                    <div className="flex-1 overflow-auto">
                      <Limites />
                    </div>
                  </main>
                </div>
              </SidebarProvider>
            } />
            <Route path="/cofrinho" element={
              <SidebarProvider>
                <div className="min-h-screen flex w-full">
                  <AppSidebar />
                  <main className="flex-1 flex flex-col min-w-0">
                    <div className="border-b border-sidebar-border p-2 lg:hidden">
                      <SidebarTrigger />
                    </div>
                    <div className="flex-1 overflow-auto">
                      <Cofrinho />
                    </div>
                  </main>
                </div>
              </SidebarProvider>
            } />
            <Route path="/dividas" element={
              <SidebarProvider>
                <div className="min-h-screen flex w-full">
                  <AppSidebar />
                  <main className="flex-1 flex flex-col min-w-0">
                    <div className="border-b border-sidebar-border p-2 lg:hidden">
                      <SidebarTrigger />
                    </div>
                    <div className="flex-1 overflow-auto">
                      <Dividas />
                    </div>
                  </main>
                </div>
              </SidebarProvider>
            } />
            <Route path="/cartoes" element={
              <SidebarProvider>
                <div className="min-h-screen flex w-full">
                  <AppSidebar />
                  <main className="flex-1 flex flex-col min-w-0">
                    <div className="border-b border-sidebar-border p-2 lg:hidden">
                      <SidebarTrigger />
                    </div>
                    <div className="flex-1 overflow-auto">
                      <Cartoes />
                    </div>
                  </main>
                </div>
              </SidebarProvider>
            } />
            <Route path="/investimentos" element={
              <SidebarProvider>
                <div className="min-h-screen flex w-full">
                  <AppSidebar />
                  <main className="flex-1 flex flex-col min-w-0">
                    <div className="border-b border-sidebar-border p-2 lg:hidden">
                      <SidebarTrigger />
                    </div>
                    <div className="flex-1 overflow-auto">
                      <Investimentos />
                    </div>
                  </main>
                </div>
              </SidebarProvider>
            } />
            <Route path="/receitas" element={
              <SidebarProvider>
                <div className="min-h-screen flex w-full">
                  <AppSidebar />
                  <main className="flex-1 flex flex-col min-w-0">
                    <div className="border-b border-sidebar-border p-2 lg:hidden">
                      <SidebarTrigger />
                    </div>
                    <div className="flex-1 overflow-auto">
                      <Receitas />
                    </div>
                  </main>
                </div>
              </SidebarProvider>
            } />
            
            {/* 404 - Must be last */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </FinanceExtendedProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
