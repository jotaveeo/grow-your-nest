import { useEffect, useState } from "react";
import { useFinanceExtendedContext } from "@/contexts/FinanceExtendedContext";
import { SummaryCard } from "@/components/SummaryCard";
import { ExpenseChart } from "@/components/ExpenseChart";
import { TrendChart } from "@/components/TrendChart";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  PlusCircle,
  AlertTriangle,
  Target,
  PiggyBank,
  Calendar,
  BarChart3,
  Shield,
  Heart,
  TrendingDown as DebtIcon,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const {
    transactions,
    categories,
    financialGoals,
    piggyBankEntries,
    debts,
    creditCards,
    wishlistItems,
    getPiggyBankTotal,
    getTotalDebt,
    getTotalInvestments,
  } = useFinanceExtendedContext();

  // Calculate balance
  const getBalance = () => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return income - expenses;
  };

  // Get category expenses for charts
  const getCategoryExpenses = () => {
    const categoryTotals = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, transaction) => {
        const category = categories.find(
          (c) => c.name === transaction.category
        );
        if (!category) return acc;

        if (!acc[transaction.category]) {
          acc[transaction.category] = {
            name: transaction.category,
            amount: 0,
            color: category.color,
            icon: category.icon,
            type: "expense",
          };
        }

        acc[transaction.category].amount += transaction.amount;
        return acc;
      }, {} as Record<string, any>);

    return Object.values(categoryTotals);
  };

  // Get monthly expenses for trend chart
  const getMonthlyExpenses = () => {
    const months = Array.from({ length: 12 }, (_, i) => i);
    return months.map((monthIdx) => {
      const income = transactions
        .filter(
          (t) => t.type === "income" && new Date(t.date).getMonth() === monthIdx
        )
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = transactions
        .filter(
          (t) =>
            t.type === "expense" && new Date(t.date).getMonth() === monthIdx
        )
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        month: new Date(0, monthIdx).toLocaleString("pt-BR", {
          month: "short",
        }),
        income,
        expenses,
      };
    });
  };

  const balance = getBalance();
  const monthlyExpenses = getMonthlyExpenses();
  const categoryExpenses = getCategoryExpenses();
  const piggyBankTotal = getPiggyBankTotal();
  const totalDebt = getTotalDebt();
  const totalInvestments = getTotalInvestments();

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  // Get active goals progress
  const activeGoals = financialGoals.filter((goal) => goal.status === "active");
  const completedGoals = financialGoals.filter(
    (goal) => goal.status === "completed"
  );

  // Get urgent wishlist items
  const urgentWishlist = wishlistItems.filter(
    (item) => item.urgency === "high" && item.status === "thinking"
  );

  // Ordenar transações por data (desc)
  const recentTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const currentMonth = new Date().toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  const [showWelcome, setShowWelcome] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const loggedIn = localStorage.getItem("financi_logged_in");
    const name = localStorage.getItem("financi_user_name");
    if (loggedIn === "true") {
      setShowWelcome(true);
      setUserName(name || "");
      setTimeout(() => setShowWelcome(false), 5000);
      localStorage.removeItem("financi_logged_in");
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 lg:p-6 max-w-7xl">
        {/* Mensagem de boas-vindas */}
        {showWelcome && (
          <div className="mb-6 p-4 rounded-lg bg-primary/10 border-l-4 border-primary text-primary font-medium">
            👋 Olá{userName ? `, ${userName}` : ""}! Bem-vindo(a) ao
            FinanciControl. Obrigado por confiar no nosso sistema para organizar
            sua vida financeira!
          </div>
        )}

        {/* Header */}
        <div className="mb-6 lg:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
              Dashboard FinanciControl
            </h1>
            <p className="text-sm lg:text-base text-muted-foreground">
              Visão geral das suas finanças • {currentMonth}
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/calendario">
                <Calendar className="h-4 w-4 mr-2" />
                Calendário
              </Link>
            </Button>
            <Button asChild className="gap-2">
              <Link to="/lancamento">
                <PlusCircle className="h-5 w-5" />
                Nova Transação
              </Link>
            </Button>
          </div>
        </div>

        {/* Alerta de saldo negativo */}
        {balance < 0 && (
          <div className="mb-6 flex items-center gap-2 p-4 bg-destructive/10 border-l-4 border-destructive rounded-lg text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <span>
              Atenção: Seu saldo está negativo. Reveja seus gastos e planeje
              melhor seu orçamento!
            </span>
          </div>
        )}

        {/* Main Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <SummaryCard
            title="Saldo Total"
            value={`R$ ${balance.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}`}
            icon={DollarSign}
            className={
              balance >= 0
                ? "border-l-4 border-l-success"
                : "border-l-4 border-l-destructive"
            }
          />
          <SummaryCard
            title="Receitas"
            value={`R$ ${totalIncome.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}`}
            icon={TrendingUp}
            className="border-l-4 border-l-success"
          />
          <SummaryCard
            title="Despesas"
            value={`R$ ${totalExpenses.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}`}
            icon={TrendingDown}
            className="border-l-4 border-l-destructive"
          />
          <SummaryCard
            title="Transações"
            value={transactions.length.toString()}
            icon={CreditCard}
            className="border-l-4 border-l-primary"
          />
        </div>

        {/* Extended Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <SummaryCard
            title="Cofrinho"
            value={`R$ ${piggyBankTotal.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}`}
            icon={PiggyBank}
            className="border-l-4 border-l-blue-500"
          />
          <SummaryCard
            title="Dívidas"
            value={`R$ ${totalDebt.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}`}
            icon={DebtIcon}
            className="border-l-4 border-l-red-500"
          />
          <SummaryCard
            title="Investimentos"
            value={`R$ ${totalInvestments.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}`}
            icon={TrendingUp}
            className="border-l-4 border-l-green-500"
          />
          <SummaryCard
            title="Cartões"
            value={creditCards.length.toString()}
            icon={Wallet}
            className="border-l-4 border-l-purple-500"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-6 lg:mb-8">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-16 flex-col gap-1"
          >
            <Link to="/metas">
              <Target className="h-5 w-5" />
              <span className="text-xs">Metas</span>
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-16 flex-col gap-1"
          >
            <Link to="/wishlist">
              <Heart className="h-5 w-5" />
              <span className="text-xs">Wishlist</span>
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-16 flex-col gap-1"
          >
            <Link to="/cofrinho">
              <PiggyBank className="h-5 w-5" />
              <span className="text-xs">Cofrinho</span>
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-16 flex-col gap-1"
          >
            <Link to="/limites">
              <Shield className="h-5 w-5" />
              <span className="text-xs">Limites</span>
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-16 flex-col gap-1"
          >
            <Link to="/relatorios">
              <BarChart3 className="h-5 w-5" />
              <span className="text-xs">Relatórios</span>
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-16 flex-col gap-1"
          >
            <Link to="/historico">
              <Calendar className="h-5 w-5" />
              <span className="text-xs">Histórico</span>
            </Link>
          </Button>
        </div>

        {/* Financial Goals & Wishlist Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 lg:mb-8">
          {/* Active Goals */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Metas Ativas
              </CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link to="/metas">Ver todas</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {activeGoals.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Nenhuma meta ativa</p>
                  <Button asChild variant="link" size="sm" className="mt-2">
                    <Link to="/metas">Criar primeira meta</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeGoals.slice(0, 3).map((goal) => {
                    const progress = Math.min(
                      (goal.currentAmount / goal.targetAmount) * 100,
                      100
                    );
                    return (
                      <div key={goal.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm truncate">
                            {goal.title}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {progress.toFixed(0)}%
                          </Badge>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>
                            R$ {goal.currentAmount.toLocaleString("pt-BR")}
                          </span>
                          <span>
                            R$ {goal.targetAmount.toLocaleString("pt-BR")}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Urgent Wishlist */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Wishlist Urgente
              </CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link to="/wishlist">Ver todas</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {urgentWishlist.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <Heart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Nenhum item urgente</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {urgentWishlist.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center p-3 bg-muted/50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-sm">{item.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.reason}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm">
                          R$ {item.estimatedPrice.toLocaleString("pt-BR")}
                        </p>
                        <Badge variant="destructive" className="text-xs">
                          Alta
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <div className="w-full">
            <ExpenseChart
              data={categoryExpenses}
              title="Gastos por Categoria"
            />
          </div>
          <div className="w-full">
            <TrendChart data={monthlyExpenses} title="Evolução Mensal" />
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-card rounded-lg border shadow-sm">
          <div className="p-4 lg:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg lg:text-xl font-semibold">
                Transações Recentes
              </h3>
              <Button asChild variant="ghost" size="sm">
                <Link to="/historico">Ver todas</Link>
              </Button>
            </div>
            <div className="space-y-3">
              {recentTransactions.slice(0, 5).map((transaction, index) => {
                const category = categories.find(
                  (c) => c.name === transaction.category
                );
                return (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 lg:p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-2 sm:mb-0">
                      <div className="text-lg">{category?.icon || "💰"}</div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm lg:text-base truncate">
                          {transaction.description}
                        </p>
                        <p className="text-xs lg:text-sm text-muted-foreground">
                          {category?.name || "Sem categoria"} •{" "}
                          {new Intl.DateTimeFormat("pt-BR").format(
                            new Date(transaction.date)
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-2">
                      <span
                        className={`text-sm lg:text-base font-semibold ${
                          transaction.type === "income"
                            ? "text-success"
                            : "text-destructive"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : "-"}R${" "}
                        {transaction.amount.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>
                );
              })}
              {transactions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Nenhuma transação encontrada</p>
                  <p className="text-sm mt-1">
                    Comece adicionando uma nova transação
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
