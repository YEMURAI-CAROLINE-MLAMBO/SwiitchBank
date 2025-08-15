import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

const BankingCircle = () => {
  const [circle, setCircle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCircle = async () => {
      try {
        const response = await api.get('/api/growth/circle');
        setCircle(response.data.circle);
      } catch (error) {
        console.error('Failed to fetch banking circle', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCircle();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!circle) {
    return <p>You are not part of a banking circle yet. Join one to earn group rewards!</p>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">{circle.name}</h3>
      <p className="text-gray-600">Members: {circle.members}</p>
      <p className="text-gray-600">Group Reward: {circle.reward}</p>
      <div className="mt-4">
        <h4 className="font-semibold">Progress</h4>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '60%' }}></div>
        </div>
      </div>
    </div>
  );
};

export default BankingCircle;
