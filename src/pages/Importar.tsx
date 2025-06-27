import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileText, AlertCircle, CheckCircle, Download } from "lucide-react"
import { BackButton } from "@/components/BackButton"
import { useFinanceExtendedContext } from "@/contexts/FinanceExtendedContext"
import { useToast } from "@/hooks/use-toast"

const Importar = () => {
  const { addTransaction } = useFinanceExtendedContext()
  const { toast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<{
    success: boolean
    message: string
    count?: number
  } | null>(null)
  const [dragActive, setDragActive] = useState(false);

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
        category: "Sem categoria",
      });
    }
    return { transactions, errors };
  }

  const handleImport = async () => {
    if (!file) return;
    setImporting(true);

    try {
      const text = await file.text();
      const { transactions, errors } = parseCSV(text);

      if (transactions.length === 0) {
        setImportResult({
          success: false,
          message: "Nenhuma transação válida encontrada no arquivo",
          errors,
        });
        setImporting(false);
        return;
      }

      let successCount = 0;
      for (const transaction of transactions) {
        try {
          addTransaction(transaction);
          successCount++;
        } catch (error) {
          // Aqui você pode adicionar erros de adição se quiser
        }
      }

      setImportResult({
        success: true,
        message: `Arquivo importado com sucesso!`,
        count: successCount,
        errors,
      });

      toast({
        title: "Importação concluída",
        description: `${successCount} transações importadas. ${errors.length > 0 ? errors.length + " linhas ignoradas." : ""}`,
      });

    } catch (error) {
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
      <div className="container mx-auto p-4 lg:p-6 max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4 animate-slide-in-left">
          <BackButton />
        </div>

        <div className="mb-6 lg:mb-8 animate-slide-in-left" style={{ animationDelay: "100ms" }}>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
            Importar Transações
          </h1>
          <p className="text-sm lg:text-base text-muted-foreground">
            Importe suas transações de planilhas CSV ou extratos bancários
          </p>
        </div>

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
                className="w-full"
              >
                {importing ? "Importando..." : "Importar Transações"}
              </Button>

              {importResult && (
                <div className={`p-3 rounded-lg flex items-center gap-2 ${
                  importResult.success 
                    ? 'bg-success/10 text-success border border-success/20' 
                    : 'bg-destructive/10 text-destructive border border-destructive/20'
                }`}>
                  {importResult.success ? (
                    <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{importResult.message}</p>
                    {importResult.count && (
                      <p className="text-xs opacity-80">
                        {importResult.count} transações importadas
                      </p>
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
                Como Importar
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 lg:px-6 pb-4 lg:pb-6 space-y-4">
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-semibold">
                    1
                  </div>
                  <div>
                    <p className="text-sm font-medium">Prepare seu arquivo</p>
                    <p className="text-xs text-muted-foreground">
                      Use o formato CSV com as colunas: data, descrição, valor, tipo, categoria
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-semibold">
                    2
                  </div>
                  <div>
                    <p className="text-sm font-medium">Faça o upload</p>
                    <p className="text-xs text-muted-foreground">
                      Clique em "Escolher arquivo" e selecione seu CSV
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-semibold">
                    3
                  </div>
                  <div>
                    <p className="text-sm font-medium">Importe os dados</p>
                    <p className="text-xs text-muted-foreground">
                      Clique em "Importar" e aguarde o processamento
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
        <Card className="mt-6 animate-scale-in" style={{ animationDelay: "400ms" }}>
          <CardHeader className="px-4 lg:px-6 py-4">
            <CardTitle className="text-base lg:text-lg">
              Exemplo de Formato
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
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-1">1900-05-21 00:00:00</td>
                    <td className="py-1">Dinheiro do pai</td>
                    <td className="py-1">100</td>
                  </tr>
                  <tr>
                    <td className="py-1">2024-01-16</td>
                    <td className="py-1">Compra supermercado</td>
                    <td className="py-1">-150.50</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              * Valores negativos são considerados despesas, positivos como receitas
              <br />
              * Transações sem categoria serão marcadas como "Sem categoria"
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Importar
