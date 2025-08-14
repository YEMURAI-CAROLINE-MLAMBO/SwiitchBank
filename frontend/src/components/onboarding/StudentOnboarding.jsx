import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Button, Input, Modal } from '../common';

const StudentOnboarding = () => {
  const { user } = useAuth();
  const [university, setUniversity] = useState('');
  const [studentId, setStudentId] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [showOffer, setShowOffer] = useState(true);
  
  const verifyStudentStatus = async () => {
    try {
      // Simple verification for MVP
      await api.post('/verification/student', { university, studentId });
      setIsVerified(true);
      
      // Apply student benefits
      await api.post('/rewards/activate', { type: 'student' });
      
      // Show welcome offer
      setShowOffer(true);
    } catch (error) {
      console.error('Verification failed:', error);
    }
  };
  
  if (user.studentVerified) return null;
  
  return (
    <div className="student-onboarding">
      {!isVerified ? (
        <div className="verification-card">
          <h3>Student Verification</h3>
          <p>Verify your student status to unlock exclusive benefits:</p>
          <ul>
            <li>🎓 Zero monthly fees</li>
            <li>💳 Free virtual card</li>
            <li>💰 $5 welcome bonus</li>
          </ul>
          
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
            placeholder="Enter student ID"
          />
          
          <Button onClick={verifyStudentStatus}>
            Verify Student Status
          </Button>
        </div>
      ) : null}
      
      {showOffer && (
        <Modal onClose={() => setShowOffer(false)}>
          <div className="student-offer">
            <h2>🎉 Welcome to SwiitchBank Student!</h2>
            <p>Your exclusive benefits are now active:</p>
            <ul>
              <li>$5 bonus added to your wallet</li>
              <li>No monthly fees for 4 years</li>
              <li>Free virtual card ready to use</li>
            </ul>
            <Button onClick={() => setShowOffer(false)}>
              Start Banking
            </Button>
            <div className="social-share">
              <p>Share with friends:</p>
              <button>Instagram</button>
              <button>TikTok</button>
              <button>Snapchat</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default StudentOnboarding;