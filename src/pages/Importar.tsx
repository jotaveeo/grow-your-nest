import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileText, AlertCircle, CheckCircle, Download, Zap, Settings } from "lucide-react"
import { BackButton } from "@/components/BackButton"
import { useFinanceExtendedContext } from "@/contexts/FinanceExtendedContext"
import { useAutoCategorization } from "@/hooks/useAutoCategorization"
import { useToast } from "@/hooks/use-toast"
import { CategorizationRules } from "@/components/CategorizationRules"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

const Importar = () => {
  const { addTransaction, transactions } = useFinanceExtendedContext()
  const { categorizeMultipleTransactions } = useAutoCategorization()
  const { toast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<{
    success: boolean
    message: string
    count?: number
    categorizedCount?: number
    transactions?: any[]
  } | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setImportResult(null)
    }
  }

  const parseCSV = (csvText: string) => {
    let separator = ",";
    if (csvText.includes("\t")) separator = "\t";
    else if (csvText.includes(";")) separator = ";";

    const lines = csvText.trim().split("\n");
    const headers = lines[0].split(separator).map(h => h.trim().toLowerCase());

    const idxData = headers.findIndex(h => h.startsWith("data"));
    const idxDesc = headers.findIndex(h => h.startsWith("descri"));
    const idxValor = headers.findIndex(h => h.startsWith("valor"));

    const transactions = [];
    const errors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(separator);
      if (values.length < 3) {
        errors.push(`Linha ${i + 1}: colunas insuficientes`);
        continue;
      }

      const dateStr = values[idxData]?.trim();
      const description = values[idxDesc]?.trim();
      const amountStr = values[idxValor]?.replace(",", ".").trim();

      if (!dateStr || !description || !amountStr) {
        errors.push(`Linha ${i + 1}: campo obrigatório ausente`);
        continue;
      }

      let formattedDate = dateStr;
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
        const [d, m, y] = dateStr.split("/");
        formattedDate = `${y}-${m}-${d}`;
      } else if (dateStr.includes(" ")) {
        formattedDate = dateStr.split(" ")[0];
      }

      const amount = parseFloat(amountStr);
      if (isNaN(amount)) {
        errors.push(`Linha ${i + 1}: valor inválido`);
        continue;
      }

      transactions.push({
        date: formattedDate,
        description,
        amount: Math.abs(amount),
        type: amount < 0 ? "expense" : "income",
      });
    }
    return { transactions, errors };
  }

  const handleImport = async () => {
    if (!file) return;
    setImporting(true);

    try {
      console.log('Iniciando importação...');
      console.log('Total de transações antes da importação:', transactions.length);
      
      const text = await file.text();
      const { transactions: parsedTransactions, errors } = parseCSV(text);

      if (parsedTransactions.length === 0) {
        setImportResult({
          success: false,
          message: "Nenhuma transação válida encontrada no arquivo",
        });
        setImporting(false);
        return;
      }

      console.log('Transações parsed:', parsedTransactions.length);

      // Aplicar categorização automática
      const categorizedTransactions = categorizeMultipleTransactions(parsedTransactions);
      const categorizedCount = categorizedTransactions.filter(t => t.category !== 'Sem categoria').length;

      console.log('Transações categorizadas:', categorizedCount);

      let successCount = 0;
      for (const transaction of categorizedTransactions) {
        try {
          console.log('Adicionando transação:', transaction);
          addTransaction({
            date: transaction.date,
            description: transaction.description,
            amount: transaction.amount,
            type: transaction.type,
            category: transaction.category
          });
          successCount++;
        } catch (error) {
          console.error('Erro ao adicionar transação:', error);
        }
      }

      console.log('Transações adicionadas com sucesso:', successCount);
      
      // Delay para garantir que o estado seja atualizado antes de verificar
      setTimeout(() => {
        console.log('Total de transações após importação:', transactions.length);
      }, 100);

      setImportResult({
        success: true,
        message: `Arquivo importado com sucesso!`,
        count: successCount,
        categorizedCount,
        transactions: categorizedTransactions,
      });

      toast({
        title: "Importação concluída",
        description: `${successCount} transações importadas. ${categorizedCount} categorizadas automaticamente. ${errors.length > 0 ? errors.length + " linhas ignoradas." : ""}`,
      });

    } catch (error) {
      console.error('Erro na importação:', error);
      setImportResult({
        success: false,
        message: "Erro ao processar o arquivo. Verifique o formato.",
      });
      toast({
        title: "Erro na importação",
        description: "Verifique se o arquivo está no formato correto.",
        variant: "destructive",
      });
    }

    setImporting(false);
  }

  const downloadTemplate = () => {
    const csvContent = "Data\tDescrição\tValor\n2024-01-15\tCompra supermercado\t-150.50\n2024-01-16\tSalário\t3000.00"
    const blob = new Blob([csvContent], { type: 'text/tab-separated-values' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'modelo_importacao.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };
  const handleDragLeave = () => setDragActive(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setImportResult(null);
    }
  };

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <div className="container mx-auto p-4 lg:p-6 max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4 animate-slide-in-left">
          <BackButton />
        </div>

        <div className="mb-6 lg:mb-8 animate-slide-in-left" style={{ animationDelay: "100ms" }}>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
            Importar Transações
          </h1>
          <p className="text-sm lg:text-base text-muted-foreground">
            Importe suas transações com categorização automática inteligente
          </p>
        </div>

        {/* Debug Info */}
        <div className="mb-4 p-3 bg-muted/50 rounded-lg text-sm">
          <p>Debug: Total de transações no contexto: {transactions.length}</p>
        </div>

        <Tabs defaultValue="importar" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="importar" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Importar Arquivo
            </TabsTrigger>
            <TabsTrigger value="regras" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Regras de Categorização
            </TabsTrigger>
          </TabsList>

          <TabsContent value="importar" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upload Section */}
              <Card className="animate-scale-in" style={{ animationDelay: "200ms" }}>
                <CardHeader className="px-4 lg:px-6 py-4 lg:py-6">
                  <CardTitle className="text-base lg:text-lg flex items-center gap-2">
                    <Upload className="h-4 w-4 lg:h-5 lg:w-5" />
                    Upload de Arquivo
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 lg:px-6 pb-4 lg:pb-6 space-y-4">
                  <div>
                    <Label htmlFor="file-upload" className="text-sm font-medium">
                      Selecione um arquivo CSV
                    </Label>
                    <div className="mt-2">
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${dragActive ? "border-primary bg-primary/10" : "border-muted"}`}
                      >
                        <Input
                          id="file-upload"
                          type="file"
                          accept=".csv,.txt"
                          onChange={handleFileChange}
                          className="cursor-pointer"
                          aria-label="Selecionar arquivo para importação"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Arraste e solte o arquivo aqui ou clique para selecionar
                        </p>
                        {file && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => setFile(null)}
                            aria-label="Limpar arquivo selecionado"
                          >
                            Limpar arquivo
                          </Button>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Formatos suportados: CSV, TXT (separado por tabs)
                    </p>
                  </div>

                  {file && (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium truncate">{file.name}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Tamanho: {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  )}

                  <Button 
                    onClick={handleImport}
                    disabled={!file || importing}
                    className="w-full flex items-center gap-2"
                  >
                    <Zap className="h-4 w-4" />
                    {importing ? "Importando..." : "Importar com Categorização Automática"}
                  </Button>

                  {importResult && (
                    <div className={`p-3 rounded-lg flex items-start gap-2 ${
                      importResult.success 
                        ? 'bg-success/10 text-success border border-success/20' 
                        : 'bg-destructive/10 text-destructive border border-destructive/20'
                    }`}>
                      {importResult.success ? (
                        <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{importResult.message}</p>
                        {importResult.count && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            <Badge variant="outline">
                              {importResult.count} transações importadas
                            </Badge>
                            {importResult.categorizedCount !== undefined && (
                              <Badge variant="default">
                                <Zap className="h-3 w-3 mr-1" />
                                {importResult.categorizedCount} categorizadas automaticamente
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Instructions */}
              <Card className="animate-scale-in" style={{ animationDelay: "300ms" }}>
                <CardHeader className="px-4 lg:px-6 py-4 lg:py-6">
                  <CardTitle className="text-base lg:text-lg">
                    Como Funciona a Categorização
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 lg:px-6 pb-4 lg:pb-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-semibold">
                        1
                      </div>
                      <div>
                        <p className="text-sm font-medium">Regras Automáticas</p>
                        <p className="text-xs text-muted-foreground">
                          Sistema aplica regras baseadas em palavras-chave (Uber → Transporte)
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-semibold">
                        2
                      </div>
                      <div>
                        <p className="text-sm font-medium">Histórico Inteligente</p>
                        <p className="text-xs text-muted-foreground">
                          Aprende com suas categorizações anteriores
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-semibold">
                        3
                      </div>
                      <div>
                        <p className="text-sm font-medium">Revisão Manual</p>
                        <p className="text-xs text-muted-foreground">
                          Transações não categorizadas ficam marcadas para revisão
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={downloadTemplate}
                      className="w-full flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Baixar Modelo CSV
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Format Example */}
            <Card className="animate-scale-in" style={{ animationDelay: "400ms" }}>
              <CardHeader className="px-4 lg:px-6 py-4">
                <CardTitle className="text-base lg:text-lg">
                  Exemplo de Formato Suportado
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 lg:px-6 pb-4 lg:pb-6">
                <div className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <table className="w-full text-xs lg:text-sm min-w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Data</th>
                        <th className="text-left py-2">Descrição</th>
                        <th className="text-left py-2">Valor</th>
                        <th className="text-left py-2">Categoria Sugerida</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-1">01/05/2025</td>
                        <td className="py-1">Compra no débito via NuPay - iFood</td>
                        <td className="py-1">-37.79</td>
                        <td className="py-1"><Badge variant="outline">Alimentação</Badge></td>
                      </tr>
                      <tr>
                        <td className="py-1">02/05/2025</td>
                        <td className="py-1">Transferência enviada pelo Pix - Uber</td>
                        <td className="py-1">-8.51</td>
                        <td className="py-1"><Badge variant="outline">Transporte</Badge></td>
                      </tr>
                      <tr>
                        <td className="py-1">03/05/2025</td>
                        <td className="py-1">Resgate RDB</td>
                        <td className="py-1">11.00</td>
                        <td className="py-1"><Badge variant="outline">Investimentos</Badge></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  * O sistema reconhece automaticamente padrões como "iFood", "Uber", "RDB" e aplica as categorias correspondentes
                  <br />
                  * Valores negativos são considerados despesas, positivos como receitas
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="regras">
            <CategorizationRules />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Importar
