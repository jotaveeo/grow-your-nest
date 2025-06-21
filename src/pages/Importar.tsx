
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileText, AlertCircle, CheckCircle, Download } from "lucide-react"

const Importar = () => {
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<{
    success: boolean
    message: string
    count?: number
  } | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setImportResult(null)
    }
  }

  const handleImport = async () => {
    if (!file) return
    
    setImporting(true)
    
    // Simular importação
    setTimeout(() => {
      setImportResult({
        success: true,
        message: "Arquivo importado com sucesso!",
        count: Math.floor(Math.random() * 50) + 10
      })
      setImporting(false)
    }, 2000)
  }

  const downloadTemplate = () => {
    const csvContent = "data,descrição,valor,tipo,categoria\n2024-01-15,Compra supermercado,150.50,despesa,Alimentação\n2024-01-16,Salário,3000.00,receita,Trabalho"
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'modelo_importacao.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 lg:p-6 max-w-4xl">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
            Importar Transações
          </h1>
          <p className="text-sm lg:text-base text-muted-foreground">
            Importe suas transações de planilhas CSV ou extratos bancários
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <Card>
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
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Formatos suportados: CSV, Excel (.xlsx, .xls)
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
          <Card>
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
        <Card className="mt-6">
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
                    <th className="text-left py-2">Tipo</th>
                    <th className="text-left py-2">Categoria</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-1">2024-01-15</td>
                    <td className="py-1">Compra supermercado</td>
                    <td className="py-1">150.50</td>
                    <td className="py-1">despesa</td>
                    <td className="py-1">Alimentação</td>
                  </tr>
                  <tr>
                    <td className="py-1">2024-01-16</td>
                    <td className="py-1">Salário</td>
                    <td className="py-1">3000.00</td>
                    <td className="py-1">receita</td>
                    <td className="py-1">Trabalho</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Importar
