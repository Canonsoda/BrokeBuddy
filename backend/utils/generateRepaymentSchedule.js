export const generateRepaymentSchedule = (amount, duration, startDate = new Date()) => {
  const monthlyAmount = Math.round(amount / duration);
  const schedule = [];

  for (let i = 0; i < duration; i++) {
    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + i);

    schedule.push({
      dueDate,
      amountDue: monthlyAmount,
      amountPaid: 0,
      status: "pending",
    });
  }

  return schedule;
};