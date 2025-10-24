
import asyncHandler from 'express-async-handler';
import LoanOffer from '../models/LoanOffer.js';
import Loan from '../models/Loan.js';

// @desc    Create a new loan offer
// @route   POST /api/swiitch-party/loan-offers
// @access  Private
const createLoanOffer = asyncHandler(async (req, res) => {
  const { amount, interestRate, term, currency } = req.body;

  const loanOffer = new LoanOffer({
    funderId: req.user._id,
    amount,
    interestRate,
    term,
    currency,
  });

  const createdLoanOffer = await loanOffer.save();
  res.status(201).json(createdLoanOffer);
});

// @desc    Get all active loan offers
// @route   GET /api/swiitch-party/loan-offers
// @access  Public
const getLoanOffers = asyncHandler(async (req, res) => {
  const loanOffers = await LoanOffer.find({ status: 'active' }).populate('funderId', 'name');
  res.json(loanOffers);
});

// @desc    Accept a loan offer and create a loan
// @route   POST /api/swiitch-party/loans/accept
// @access  Private
const acceptLoanOffer = asyncHandler(async (req, res) => {
    const { loanOfferId } = req.body;

    const loanOffer = await LoanOffer.findById(loanOfferId);

    if (loanOffer && loanOffer.status === 'active') {
        loanOffer.status = 'accepted';
        await loanOffer.save();

        const repaymentSchedule = [];
        const monthlyInterest = loanOffer.interestRate / 12 / 100;
        const monthlyPayment = loanOffer.amount * monthlyInterest / (1 - Math.pow(1 + monthlyInterest, -loanOffer.term));

        for (let i = 1; i <= loanOffer.term; i++) {
            const dueDate = new Date();
            dueDate.setMonth(dueDate.getMonth() + i);
            repaymentSchedule.push({
                dueDate,
                amount: monthlyPayment,
                status: 'pending'
            });
        }

        const loan = new Loan({
            loanOfferId,
            borrowerId: req.user._id,
            repaymentSchedule,
            status: 'active',
            currency: loanOffer.currency,
        });

        const createdLoan = await loan.save();
        res.status(201).json(createdLoan);
    } else {
        res.status(404);
        throw new Error('Loan offer not found or not active');
    }
});

// @desc    Get loans for the logged in user
// @route   GET /api/swiitch-party/loans/my-loans
// @access  Private
const getMyLoans = asyncHandler(async (req, res) => {
    const loans = await Loan.find({ borrowerId: req.user._id }).populate('loanOfferId');
    res.json(loans);
});

// @desc    Get loan offers for the logged in user
// @route   GET /api/swiitch-party/loan-offers/my-offers
// @access  Private
const getMyLoanOffers = asyncHandler(async (req, res) => {
    const loanOffers = await LoanOffer.find({ funderId: req.user._id });
    res.json(loanOffers);
});


export { createLoanOffer, getLoanOffers, acceptLoanOffer, getMyLoans, getMyLoanOffers };
