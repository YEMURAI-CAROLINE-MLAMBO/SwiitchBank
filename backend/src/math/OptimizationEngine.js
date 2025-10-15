export class OptimizationEngine {

  static debtSnowball(debts, availableMonthlyPayment) {
    let localDebts = JSON.parse(JSON.stringify(debts)); // Deep copy to avoid mutation
    localDebts.sort((a, b) => a.balance - b.balance);

    let months = 0;
    let totalInterest = 0;
    let totalPaid = 0;

    while (localDebts.reduce((sum, debt) => sum + debt.balance, 0) > 0) {
      months++;
      let payment = availableMonthlyPayment;
      let interestForMonth = 0;

      // Accrue interest for the month
      localDebts.forEach(debt => {
        const interest = debt.balance * (debt.rate / 12);
        interestForMonth += interest;
        debt.balance += interest;
      });
      totalInterest += interestForMonth;

      // Make minimum payments
      localDebts.forEach(debt => {
        const minPayment = Math.min(debt.balance, debt.minPayment);
        debt.balance -= minPayment;
        payment -= minPayment;
        totalPaid += minPayment;
      });

      // Apply extra payment to the smallest balance
      for (let i = 0; i < localDebts.length; i++) {
        if (payment <= 0) break;
        if (localDebts[i].balance > 0) {
          const extraPayment = Math.min(payment, localDebts[i].balance);
          localDebts[i].balance -= extraPayment;
          payment -= extraPayment;
          totalPaid += extraPayment;
        }
      }

      localDebts = localDebts.filter(debt => debt.balance > 0.005);
    }

    return { months, totalInterest: parseFloat(totalInterest.toFixed(2)), totalPaid: parseFloat(totalPaid.toFixed(2)) };
  }

  static debtAvalanche(debts, availableMonthlyPayment) {
    let localDebts = JSON.parse(JSON.stringify(debts)); // Deep copy to avoid mutation
    localDebts.sort((a, b) => b.rate - a.rate);

    let months = 0;
    let totalInterest = 0;
    let totalPaid = 0;

    while (localDebts.reduce((sum, debt) => sum + debt.balance, 0) > 0) {
      months++;
      let payment = availableMonthlyPayment;
      let interestForMonth = 0;

      // Accrue interest for the month
      localDebts.forEach(debt => {
        const interest = debt.balance * (debt.rate / 12);
        interestForMonth += interest;
        debt.balance += interest;
      });
      totalInterest += interestForMonth;

      // Make minimum payments
      localDebts.forEach(debt => {
        const minPayment = Math.min(debt.balance, debt.minPayment);
        debt.balance -= minPayment;
        payment -= minPayment;
        totalPaid += minPayment;
      });

      // Apply extra payment to the highest interest rate
      for (let i = 0; i < localDebts.length; i++) {
        if (payment <= 0) break;
        if (localDebts[i].balance > 0) {
          const extraPayment = Math.min(payment, localDebts[i].balance);
          localDebts[i].balance -= extraPayment;
          payment -= extraPayment;
          totalPaid += extraPayment;
        }
      }

      localDebts = localDebts.filter(debt => debt.balance > 0.005);
    }

    return { months, totalInterest: parseFloat(totalInterest.toFixed(2)), totalPaid: parseFloat(totalPaid.toFixed(2)) };
  }
}
