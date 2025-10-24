
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const FunderDashboard = () => {
    const [myLoanOffers, setMyLoanOffers] = useState([]);
    const [amount, setAmount] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [term, setTerm] = useState('');
    const [currency, setCurrency] = useState('USD');

    useEffect(() => {
        const fetchMyLoanOffers = async () => {
            try {
                const { data } = await axios.get('/api/swiitch-party/loan-offers/my-offers');
                setMyLoanOffers(data);
            } catch (error) {
                toast.error('Could not fetch your loan offers');
            }
        };
        fetchMyLoanOffers();
    }, []);

    const handleCreateOffer = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/swiitch-party/loan-offers', { amount, interestRate, term, currency });
            toast.success('Loan offer created!');
            // Refresh the list of my loan offers
            const { data } = await axios.get('/api/swiitch-party/loan-offers/my-offers');
            setMyLoanOffers(data);
        } catch (error) {
            toast.error('Could not create loan offer');
        }
    };

    return (
        <div>
            <h1>Funder Dashboard</h1>
            <h2>Create a new loan offer</h2>
            <form onSubmit={handleCreateOffer}>
                <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Interest Rate (%)"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Term (months)"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Currency (e.g. USD)"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                />
                <button type="submit">Create Offer</button>
            </form>
            <h2>My Loan Offers</h2>
            {myLoanOffers.map((offer) => (
                <div key={offer._id}>
                    <p>Amount: {offer.amount}</p>
                    <p>Interest Rate: {offer.interestRate}%</p>
                    <p>Term: {offer.term} months</p>
                    <p>Status: {offer.status}</p>
                </div>
            ))}
        </div>
    );
};

export default FunderDashboard;
