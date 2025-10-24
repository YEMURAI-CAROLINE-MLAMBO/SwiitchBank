
import express from 'express';
import { createLoanOffer, getLoanOffers, acceptLoanOffer, getMyLoans, getMyLoanOffers } from '../controllers/swiitchPartyController.js';
import protect from '../middleware/auth.js';
import { celebrate } from 'celebrate';
import { createLoanOfferValidation } from '../validations/swiitchPartyValidation.js';


const router = express.Router();

router.route('/loan-offers')
  .post(protect, celebrate(createLoanOfferValidation), createLoanOffer)
  .get(getLoanOffers);

router.route('/loans')
    .post(protect, acceptLoanOffer);

router.route('/loans/my-loans')
    .get(protect, getMyLoans);

router.route('/loan-offers/my-offers')
    .get(protect, getMyLoanOffers);


export default router;
