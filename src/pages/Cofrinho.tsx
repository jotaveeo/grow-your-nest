import { useState, useEffect } from "react";
import { PiggyBank, Calendar, BarChart2, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { TrendChart } from "@/components/TrendChart"; //
const months = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const COFRINHO_KEY = "financi_cofrinho";

const Cofrinho = () => {
  const [savings, setSavings] = useState<string[]>(() => {
    const saved = localStorage.getItem(COFRINHO_KEY);
    return saved ? JSON.parse(saved) : Array(12).fill("");
  });

  useEffect(() => {
    localStorage.setItem(COFRINHO_KEY, JSON.stringify(savings));
  }, [savings]);

  const handleChange = (index: number, value: string) => {
    setSavings((prev) => {
      const updated = [...prev];
      updated[index] = value.replace(",", ".");
      return updated;
    });
  };

  const handleClear = () => {
    if (window.confirm("Deseja limpar todos os valores do cofrinho?")) {
      setSavings(Array(12).fill(""));
    }
  };

  const total = savings.reduce((sum, val) => sum + (parseFloat(val) || 0), 0);

  // Dados para gráfico de barras
  const chartData = months.map((month, idx) => ({
    name: month.slice(0, 3),
    amount: parseFloat(savings[idx]) || 0,
    color: "#7c3aed",
  }));

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 lg:p-6 max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <BackButton />
          <Button
            variant="outline"
            size="sm"
            className="ml-auto flex items-center gap-2"
            onClick={handleClear}
            aria-label="Limpar cofrinho"
          >
            <Trash2 className="h-4 w-4" />
            Limpar
          </Button>
        </div>

        <div
          className="mb-6 lg:mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <PiggyBank className="h-8 w-8 text-primary" />
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              Meu Cofrinho
            </h1>
          </div>
          <p className="text-muted-foreground">
            Registre quanto você poupou em cada mês do ano.
          </p>
        </div>

        {/* Gráfico de barras */}
        <Card
          className="mb-6"
        >
          <CardHeader className="px-4 lg:px-6 py-4 flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-primary" />
            <CardTitle className="text-base lg:text-lg">
              Evolução da Poupança
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TrendChart
              data={months.map((month, idx) => ({
                month: month.slice(0, 3),
                receitas: parseFloat(savings[idx]) || 0,
              }))}
              title="Poupança Mensal"
            />
          </CardContent>
        </Card>

        {/* Tabela de inputs */}
        <Card>
          <CardHeader className="px-4 lg:px-6 py-4">
            <CardTitle className="text-base lg:text-lg flex items-center gap-2">
              <Calendar className="h-4 w-4 lg:h-5 lg:w-5" />
              Poupança Mensal
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left px-4 py-2 font-semibold">Mês</th>
                    <th className="text-right px-4 py-2 font-semibold">
                      Valor Poupado (R$)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {months.map((month, idx) => (
                    <tr
                      key={month}
                      className={`border-b last:border-0 transition-colors ${
                        parseFloat(savings[idx]) > 0
                          ? "bg-green-50 dark:bg-green-950/10"
                          : ""
                      }`}
                    >
                      <td className="px-4 py-2 flex items-center gap-2 font-medium">
                        <Calendar className="h-4 w-4 text-primary" />
                        {month}
                      </td>
                      <td className="px-4 py-2 text-right">
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0,00"
                          value={savings[idx]}
                          onChange={(e) => handleChange(idx, e.target.value)}
                          className="w-32 text-right"
                          aria-label={`Valor poupado em ${month}`}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-muted/30">
                    <td className="px-4 py-2 font-bold text-right">SOMA</td>
                    <td className="px-4 py-2 font-bold text-right text-success text-lg">
                      R${" "}
                      {total.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Cofrinho;
