
export const resetAllData = () => {
  // Lista de todas as chaves do localStorage usadas pela aplicação
  const keys = [
    'financeflow_transactions',
    'financeflow_categories', 
    'financeflow_goals',
    'financeflow_wishlist',
    'financeflow_piggybank',
    'financeflow_debts',
    'financeflow_creditcards',
    'financeflow_limits',
    'financeflow_investments',
    'financeflow_fixedexpenses',
    'financeflow_incomesources',
    'financeflow_categorization_rules',
    'financeflow_categorization_history'
  ];

  // Remove todas as chaves do localStorage
  keys.forEach(key => {
    localStorage.removeItem(key);
  });

  console.log('Limpando dados...');
  
  // Recarrega a página para aplicar as mudanças
  window.location.reload();
};
