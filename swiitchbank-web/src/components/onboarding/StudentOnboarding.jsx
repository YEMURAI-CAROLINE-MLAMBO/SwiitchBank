import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db, functions } from '../../firebase';
import { Button, Input, Checkbox } from '../common';

const StudentOnboarding = () => {
  const { user } = useAuth();
  const [university, setUniversity] = useState('');
  const [studentId, setStudentId] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!user) {
        console.error('User not authenticated.');
        return;
      }

      await db.collection('users').doc(user.uid).update({
        university,
        studentId,
        studentVerified: true,
      });

      const activateStudentRewards = functions.httpsCallable('activateStudentRewards');
      await activateStudentRewards();

    } catch (error) {
      console.error('Student verification failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (user.studentVerified) {
    return null; 
  }

  return (
    <div className="student-onboarding-form">
      <h2>Unlock Student Benefits</h2>
      <form onSubmit={handleSubmit}>
        <Input
          label="University"
          value={university}
          onChange={(e) => setUniversity(e.target.value)}
          placeholder="Enter your university"
        />
        <Input
          label="Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          placeholder="Enter your student ID"
        />
        <Checkbox
          label="I accept the terms and conditions for student accounts."
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
        />
        <Button type="submit" disabled={!termsAccepted || isLoading}>
          {isLoading ? 'Verifying...' : 'Unlock Now'}
        </Button>
      </form>
    </div>
  );
};

export default StudentOnboarding;
