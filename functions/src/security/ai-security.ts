export function analyzeUserBehavior(userData: any): any {
  // Simple heuristic: if the user has made more than 10 transactions, they are considered less risky.
  const transactionCount = userData.transactions ? userData.transactions.length : 0;
  const behaviorRiskScore = transactionCount > 10 ? 20 : 80;
  console.log(`User behavior risk score for user ${userData.id}: ${behaviorRiskScore}`);
  return { behaviorRiskScore };
}

export function assessTransactionRiskAI(transactionData: any): any {
  // Simple heuristic: if the transaction amount is over 1000, it's considered high risk.
  const amount = transactionData.amount || 0;
  const transactionRiskScore = amount > 1000 ? 90 : 30;
  console.log(`Transaction risk score for transaction ${transactionData.id}: ${transactionRiskScore}`);
  return { transactionRiskScore };
}
