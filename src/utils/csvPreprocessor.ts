
// CSV Data Preprocessing Utilities
export interface PreprocessedTransaction {
  originalDescription: string;
  cleanedDescription: string;
  tokens: string[];
  normalizedAmount: number;
  date: string;
  type: 'income' | 'expense';
  confidence: number;
}

// Common typos and their corrections for Brazilian Portuguese
const COMMON_TYPOS: { [key: string]: string } = {
  'supermercado': 'supermercado',
  'suoermercado': 'supermercado',
  'supermerkado': 'supermercado',
  'restaurante': 'restaurante',
  'restorant': 'restaurante',
  'farmacia': 'farmácia',
  'farmacia': 'farmácia',
  'gasolina': 'gasolina',
  'gasosa': 'gasolina',
  'transporte': 'transporte',
  'trasporte': 'transporte',
  'pagamento': 'pagamento',
  'pagmento': 'pagamento',
  'recebimento': 'recebimento',
  'recebimeto': 'recebimento',
};

// Words to remove during tokenization
const STOP_WORDS = [
  'de', 'da', 'do', 'das', 'dos', 'em', 'na', 'no', 'nas', 'nos',
  'para', 'por', 'com', 'sem', 'via', 'pelo', 'pela', 'pelos', 'pelas',
  'o', 'a', 'os', 'as', 'um', 'uma', 'uns', 'umas',
  'e', 'ou', 'mas', 'que', 'se', 'como', 'quando', 'onde'
];

// Normalize text by removing special characters and converting to lowercase
export const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^\w\s]/g, ' ') // Replace special chars with spaces
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();
};

// Correct common typos
export const correctTypos = (text: string): string => {
  let correctedText = text;
  
  Object.entries(COMMON_TYPOS).forEach(([typo, correction]) => {
    const regex = new RegExp(`\\b${typo}\\b`, 'gi');
    correctedText = correctedText.replace(regex, correction);
  });
  
  return correctedText;
};

// Tokenize text into meaningful parts
export const tokenizeDescription = (description: string): string[] => {
  const normalized = normalizeText(description);
  const corrected = correctTypos(normalized);
  
  const tokens = corrected
    .split(' ')
    .filter(token => 
      token.length > 2 && 
      !STOP_WORDS.includes(token) &&
      !/^\d+$/.test(token) // Remove pure numbers
    )
    .map(token => token.trim())
    .filter(Boolean);
  
  return [...new Set(tokens)]; // Remove duplicates
};

// Parse different date formats
export const parseDate = (dateStr: string): string => {
  // Handle DD/MM/YYYY format
  if (dateStr.includes('/')) {
    const [day, month, year] = dateStr.split('/');
    const fullYear = year.length === 2 ? `20${year}` : year;
    return `${fullYear.padStart(4, '20')}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  
  // Handle other formats or return as-is
  return dateStr;
};

// Parse amount with different formats
export const parseAmount = (amountStr: string): number => {
  // Remove currency symbols and normalize decimal separators
  const cleanAmount = amountStr
    .replace(/[R$\s]/g, '')
    .replace(/\./g, '') // Remove thousands separator
    .replace(',', '.'); // Convert decimal separator
  
  return Math.abs(parseFloat(cleanAmount)) || 0;
};

// Determine transaction type based on description and amount
export const determineTransactionType = (description: string, originalAmount: string): 'income' | 'expense' => {
  const lowerDesc = description.toLowerCase();
  const isNegative = originalAmount.includes('-');
  
  // Keywords that indicate income
  const incomeKeywords = [
    'deposito', 'recebido', 'recebimento', 'credito', 'salario',
    'transferencia recebida', 'pix recebido', 'resgate', 'entrada'
  ];
  
  // Keywords that indicate expense
  const expenseKeywords = [
    'pagamento', 'compra', 'debito', 'saque', 'transferencia enviada',
    'pix enviado', 'aplicacao', 'saida'
  ];
  
  const hasIncomeKeyword = incomeKeywords.some(keyword => lowerDesc.includes(keyword));
  const hasExpenseKeyword = expenseKeywords.some(keyword => lowerDesc.includes(keyword));
  
  if (hasIncomeKeyword) return 'income';
  if (hasExpenseKeyword) return 'expense';
  
  // Fallback to amount sign
  return isNegative ? 'expense' : 'income';
};

// Main preprocessing function
export const preprocessTransaction = (
  date: string,
  description: string,
  amount: string,
  type?: string
): PreprocessedTransaction => {
  const cleanedDescription = correctTypos(normalizeText(description));
  const tokens = tokenizeDescription(description);
  const normalizedAmount = parseAmount(amount);
  const parsedDate = parseDate(date);
  const transactionType = type ? 
    (type.toLowerCase().includes('entrada') ? 'income' : 'expense') :
    determineTransactionType(description, amount);
  
  // Calculate confidence based on text quality
  const confidence = calculateConfidence(description, tokens);
  
  return {
    originalDescription: description,
    cleanedDescription,
    tokens,
    normalizedAmount,
    date: parsedDate,
    type: transactionType,
    confidence
  };
};

// Calculate confidence score for the preprocessing
const calculateConfidence = (originalDescription: string, tokens: string[]): number => {
  let confidence = 0.5; // Base confidence
  
  // Increase confidence if description has meaningful content
  if (originalDescription.length > 5) confidence += 0.2;
  if (tokens.length > 0) confidence += 0.2;
  if (tokens.length > 2) confidence += 0.1;
  
  // Decrease confidence for very short or unclear descriptions
  if (originalDescription.length < 3) confidence -= 0.3;
  if (tokens.length === 0) confidence -= 0.4;
  
  return Math.max(0, Math.min(1, confidence));
};

// Process Banco do Brasil CSV format
export const processBancoDoBrasilCSV = (csvContent: string): PreprocessedTransaction[] => {
  const lines = csvContent.split('\n');
  const transactions: PreprocessedTransaction[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    try {
      const columns = line.split(',').map(col => col.trim().replace(/"/g, ''));
      
      if (columns.length < 6) continue;
      
      const [date, lancamento, detalhes, documento, valor, tipoLancamento] = columns;
      
      // Skip balance lines and empty entries
      if (!date || date === '00/00/0000' || valor === '0,00' || 
          lancamento.includes('Saldo') || !valor) {
        continue;
      }
      
      // Combine description from available fields
      const description = [lancamento, detalhes].filter(Boolean).join(' - ');
      
      const preprocessed = preprocessTransaction(date, description, valor, tipoLancamento);
      transactions.push(preprocessed);
      
    } catch (error) {
      console.warn(`Error processing line ${i + 1}:`, error);
    }
  }
  
  return transactions;
};
