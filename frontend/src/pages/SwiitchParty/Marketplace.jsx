
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Marketplace = () => {
    const [loanOffers, setLoanOffers] = useState([]);

    useEffect(() => {
        const fetchLoanOffers = async () => {
            try {
                const { data } = await axios.get('/api/swiitch-party/loan-offers');
                setLoanOffers(data);
            } catch (error) {
                toast.error('Could not fetch loan offers');
            }
        };
        fetchLoanOffers();
    }, []);

    const handleAcceptOffer = async (loanOfferId) => {
        try {
            await axios.post('/api/swiitch-party/loans', { loanOfferId });
            toast.success('Loan offer accepted!');
            // Refresh the list of loan offers
            const { data } = await axios.get('/api/swiitch-party/loan-offers');
            setLoanOffers(data);
        } catch (error) {
            toast.error('Could not accept loan offer');
        }
    };

    return (
        <div>
            <h1>Marketplace</h1>
            {loanOffers.map((offer) => (
                <div key={offer._id}>
                    <p>Amount: {offer.amount} {offer.currency}</p>
                    <p>Interest Rate: {offer.interestRate}%</p>
                    <p>Term: {offer.term} months</p>
                    <button onClick={() => handleAcceptOffer(offer._id)}>Accept</button>
                </div>
            ))}
        </div>
    );
};

export default Marketplace;
