import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Upload, FileText } from "lucide-react";
import { BackButton } from "@/components/BackButton";
import { useFinanceExtendedContext } from "@/contexts/FinanceExtendedContext";
import { useToast } from "@/hooks/use-toast";

import { useAutoCategorization } from '@/hooks/useAutoCategorization'

const Importar = () => {
  const { addTransaction, transactions } = useFinanceExtendedContext();
  const { categorizeTransaction } = useAutoCategorization();
  const { toast } = useToast();

  const [fileContent, setFileContent] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [manualTransaction, setManualTransaction] = useState({
    date: "",
    description: "",
    amount: 0,
    type: "expense" as "income" | "expense",
    category: "",
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = text.split('\n');
      
      if (rows.length < 2) {
        toast({
          title: "Arquivo inválido",
          description: "O arquivo deve conter pelo menos uma linha de dados além do cabeçalho.",
          variant: "destructive",
        });
        return;
      }

      const header = rows[0].split(',').map(col => col.trim().replace(/"/g, ''));
      console.log('CSV Header:', header);
      
      const transactions = [];
      const errors = [];

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i].trim();
        if (!row) continue;

        try {
          const columns = row.split(',').map(col => col.trim().replace(/"/g, ''));
          
          if (columns.length < 3) {
            errors.push(`Linha ${i + 1}: dados insuficientes`);
            continue;
          }

          // Mapear colunas baseado no cabeçalho
          const dateIndex = header.findIndex(h => 
            h.toLowerCase().includes('data') || 
            h.toLowerCase().includes('date')
          );
          const descIndex = header.findIndex(h => 
            h.toLowerCase().includes('descri') || 
            h.toLowerCase().includes('description') ||
            h.toLowerCase().includes('estabelecimento') ||
            h.toLowerCase().includes('histórico')
          );
          const amountIndex = header.findIndex(h => 
            h.toLowerCase().includes('valor') || 
            h.toLowerCase().includes('amount') ||
            h.toLowerCase().includes('quantia')
          );

          if (dateIndex === -1 || descIndex === -1 || amountIndex === -1) {
            errors.push(`Linha ${i + 1}: colunas obrigatórias não encontradas`);
            continue;
          }

          const dateStr = columns[dateIndex];
          const description = columns[descIndex];
          const amountStr = columns[amountIndex];

          // Converter valor
          const amount = Math.abs(parseFloat(
            amountStr.replace(/[^\d,-]/g, '').replace(',', '.')
          ));

          if (isNaN(amount)) {
            errors.push(`Linha ${i + 1}: valor inválido (${amountStr})`);
            continue;
          }

          // Determinar tipo baseado na descrição ou valor original
          const isNegative = amountStr.includes('-') || 
                           description.toLowerCase().includes('débito') ||
                           description.toLowerCase().includes('pagamento');
          const type = isNegative ? 'expense' : 'income';

          // Usar categorização automática
          const categorizationResult = categorizeTransaction(description, type);

          // Converter data
          let date: string;
          if (dateStr.includes('/')) {
            const [day, month, year] = dateStr.split('/');
            date = `${year.padStart(4, '20')}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
          } else {
            date = dateStr;
          }

          const transaction = {
            date,
            description: description.trim(),
            amount,
            type,
            category: categorizationResult.category,
            autoCategorizationResult: categorizationResult
          };

          transactions.push(transaction);
        } catch (error) {
          errors.push(`Linha ${i + 1}: erro ao processar dados`);
        }
      }

      console.log('Parsed transactions:', transactions.length);
      console.log('Errors:', errors.length);

      if (transactions.length === 0) {
        toast({
          title: "Nenhuma transação válida",
          description: "Não foi possível importar nenhuma transação do arquivo.",
          variant: "destructive",
        });
        return;
      }

      // Adicionar transações ao contexto
      let addedCount = 0;
      transactions.forEach(transaction => {
        addTransaction(transaction);
        addedCount++;
      });

      console.log('Added transactions:', addedCount);
      console.log('Total transactions in context after import:', transactions.length);

      toast({
        title: "Importação concluída",
        description: `${addedCount} transações importadas com sucesso${errors.length > 0 ? `. ${errors.length} linhas com erro.` : '.'}`,
      });

      if (errors.length > 0) {
        console.warn('Import errors:', errors);
      }

      // Reset file input
      event.target.value = '';
    };

    reader.readAsText(file);
  };

  const handleAddManualTransaction = () => {
    addTransaction(manualTransaction);
    setManualTransaction({
      date: "",
      description: "",
      amount: 0,
      type: "expense",
      category: "",
    });
    setIsModalOpen(false);
    toast({
      title: "Transação adicionada",
      description: "A transação manual foi adicionada com sucesso.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 lg:p-6 max-w-3xl">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4 animate-slide-in-left">
          <BackButton />
        </div>

        <div
          className="mb-6 lg:mb-8 animate-slide-in-left"
          style={{ animationDelay: "100ms" }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                Importar Transações
              </h1>
              <p className="text-sm lg:text-base text-muted-foreground">
                Adicione suas transações de forma rápida e fácil
              </p>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2 w-full sm:w-auto">
                  <Plus className="h-4 w-4" />
                  Adicionar Manualmente
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Adicionar Transação Manualmente</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="date">Data</Label>
                    <Input
                      type="date"
                      id="date"
                      value={manualTransaction.date}
                      onChange={(e) =>
                        setManualTransaction({
                          ...manualTransaction,
                          date: e.target.value,
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Input
                      id="description"
                      value={manualTransaction.description}
                      onChange={(e) =>
                        setManualTransaction({
                          ...manualTransaction,
                          description: e.target.value,
                        })
                      }
                      placeholder="Ex: Supermercado"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="amount">Valor</Label>
                    <Input
                      type="number"
                      id="amount"
                      value={manualTransaction.amount}
                      onChange={(e) =>
                        setManualTransaction({
                          ...manualTransaction,
                          amount: Number(e.target.value),
                        })
                      }
                      placeholder="Ex: 100.00"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Tipo</Label>
                    <select
                      id="type"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                      value={manualTransaction.type}
                      onChange={(e) =>
                        setManualTransaction({
                          ...manualTransaction,
                          type: e.target.value as "income" | "expense",
                        })
                      }
                    >
                      <option value="expense">Despesa</option>
                      <option value="income">Receita</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" onClick={handleAddManualTransaction}>
                    Adicionar
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card className="animate-scale-in" style={{ animationDelay: "200ms" }}>
          <CardHeader className="px-4 lg:px-6 py-4">
            <CardTitle className="text-base lg:text-lg flex items-center gap-2">
              <Upload className="h-4 w-4 lg:h-5 lg:w-5" />
              Importar de Arquivo CSV
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 lg:px-6 pb-4 lg:pb-6">
            <p className="text-sm text-muted-foreground mb-4">
              Selecione um arquivo CSV para importar suas transações.
            </p>
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="w-full"
            />
          </CardContent>
        </Card>

        <Card className="animate-scale-in" style={{ animationDelay: "300ms" }}>
          <CardHeader className="px-4 lg:px-6 py-4">
            <CardTitle className="text-base lg:text-lg flex items-center gap-2">
              <FileText className="h-4 w-4 lg:h-5 lg:w-5" />
              Importar de Texto
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 lg:px-6 pb-4 lg:pb-6">
            <p className="text-sm text-muted-foreground mb-4">
              Cole o conteúdo do seu arquivo CSV ou extrato bancário aqui.
            </p>
            <Textarea
              value={fileContent}
              onChange={(e) => setFileContent(e.target.value)}
              placeholder="Cole o conteúdo aqui..."
              className="w-full"
            />
            <Button className="mt-4 w-full">Importar</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Importar;
