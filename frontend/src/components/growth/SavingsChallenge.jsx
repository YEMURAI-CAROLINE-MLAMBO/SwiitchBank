import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

const SavingsChallenge = () => {
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const response = await api.get('/api/growth/challenge');
        setChallenge(response.data.challenge);
      } catch (error) {
        console.error('Failed to fetch savings challenge', error);
      } finally {
        setLoading(false);
      }
    };
    fetchChallenge();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!challenge) {
    return <p>You are not participating in any savings challenges. Join one to start saving!</p>;
  }

  const progressPercentage = (challenge.progress / challenge.goal) * 100;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">{challenge.name}</h3>
      <p className="text-gray-600">Goal: ${challenge.goal}</p>
      <p className="text-gray-600">Progress: ${challenge.progress.toFixed(2)}</p>
      <div className="mt-4">
        <h4 className="font-semibold">Progress</h4>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
        </div>
      </div>
    </div>
  );
};

export default SavingsChallenge;
