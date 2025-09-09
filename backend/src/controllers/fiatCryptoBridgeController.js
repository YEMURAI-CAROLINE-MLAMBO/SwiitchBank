const fiatCryptoBridgeService = require('../services/fiatCryptoBridgeService');
const ErrorResponse = require('../utils/errorResponse');

exports.getRates = async (req, res, next) => {
  try {
    const rates = await fiatCryptoBridgeService.getRates();
    res.status(200).json(rates);
  } catch (error) {
    next(error);
  }
};

exports.performTrade = async (req, res, next) => {
  try {
    const { fromCurrency, toCurrency, amount } = req.body;
    const userId = req.user.id;

    if (!fromCurrency || !toCurrency || !amount) {
      return next(new ErrorResponse('Please provide fromCurrency, toCurrency, and amount', 400));
    }

    const result = await fiatCryptoBridgeService.performTrade(
      userId,
      fromCurrency,
      toCurrency,
      amount
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
