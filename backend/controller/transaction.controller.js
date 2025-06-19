import Loan from "../models/loan.model.js";

export const getRecentTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.headers["x-active-role"];

    let matchStage = [];

    if (role === "lender") {
      matchStage.push({ lender: userId });
    } else if (role === "borrower") {
      matchStage.push({ borrower: userId });
    }

    const recentLoans = await Loan.find({ $or: matchStage })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("amount purpose createdAt lender borrower")
      .populate("lender borrower", "name emailId");

    const recentRepayments = await Loan.aggregate([
      { $match: { $or: matchStage } },
      { $unwind: "$repayments" },
      {
        $match: {
          "repayments.amountPaid": { $gt: 0 }
        },
      },
      {
        $project: {
          _id: 0,
          loanId: "$_id",
          amount: "$repayments.amountPaid",
          date: "$repayments.date",
          user: "$repayments.user",
        },
      },
      { $sort: { date: -1 } },
      { $limit: 5 },
    ]);

    res.status(200).json({
      loans: recentLoans,
      repayments: recentRepayments,
    });
  } catch (error) {
    console.error("Error fetching recent transactions", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
