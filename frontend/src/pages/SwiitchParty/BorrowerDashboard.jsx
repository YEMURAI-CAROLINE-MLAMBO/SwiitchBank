
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const BorrowerDashboard = () => {
    const [myLoans, setMyLoans] = useState([]);

    useEffect(() => {
        const fetchMyLoans = async () => {
            try {
                const { data } = await axios.get('/api/swiitch-party/loans/my-loans');
                setMyLoans(data);
            } catch (error) {
                toast.error('Could not fetch your loans');
            }
        };
        fetchMyLoans();
    }, []);

    return (
        <div>
            <h1>Borrower Dashboard</h1>
            <h2>My Loans</h2>
            {myLoans.map((loan) => (
                <div key={loan._id}>
                    <p>Amount: {loan.loanOfferId.amount} {loan.currency}</p>
                    <p>Interest Rate: {loan.loanOfferId.interestRate}%</p>
                    <p>Term: {loan.loanOfferId.term} months</p>
                    <p>Status: {loan.status}</p>
                    <h3>Repayment Schedule</h3>
                    {loan.repaymentSchedule.map((repayment) => (
                        <div key={repayment._id}>
                            <p>Due Date: {new Date(repayment.dueDate).toLocaleDateString()}</p>
                            <p>Amount: {repayment.amount.toFixed(2)}</p>
                            <p>Status: {repayment.status}</p>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default BorrowerDashboard;
