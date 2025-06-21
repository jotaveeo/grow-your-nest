import { useState } from "react";
import { PiggyBank, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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

const Cofrinho = () => {
  const [savings, setSavings] = useState(Array(12).fill(""));

  const handleChange = (index: number, value: string) => {
    setSavings((prev) => {
      const updated = [...prev];
      updated[index] = value.replace(",", "."); // aceita vírgula ou ponto
      return updated;
    });
  };

  const total = savings.reduce(
    (sum, val) => sum + (parseFloat(val) || 0),
    0
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 lg:p-6 max-w-4xl">
        {/* Header */}
        <div className="mb-6 lg:mb-8 flex items-center gap-3">
          <PiggyBank className="h-8 w-8 text-primary" />
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Meu Cofrinho
          </h1>
        </div>
        <p className="text-muted-foreground mb-6">
          Registre quanto você poupou em cada mês do ano.
        </p>

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
                    <tr key={month} className="border-b last:border-0">
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
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-muted/30">
                    <td className="px-4 py-2 font-bold text-right">SOMA</td>
                    <td className="px-4 py-2 font-bold text-right text-success">
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