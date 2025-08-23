import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button, Input, Modal } from '../common';
import { db, functions } from '../../firebase'; // Assuming firebase.js is in src directory

const StudentOnboarding = () => {
  const { user } = useAuth();
  const [university, setUniversity] = useState('');
  const [studentId, setStudentId] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [showOffer, setShowOffer] = useState(false); // Changed to false initially
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const [error, setError] = useState(null); // Add error state

  const verifyStudentStatus = async () => {
    setIsLoading(true); // Set loading to true
    setError(null); // Clear previous errors
    try {
      if (!user) {
        console.error("User not authenticated.");
      }

      // Update user document in Firestore with student details
      await db.collection('users').doc(user.uid).update({
        university: university,
        studentId: studentId,
        studentVerified: true, // Assuming verification is successful here for MVP
      });

      setIsVerified(true);

      // Call a Cloud Function to handle referral and reward logic
      if (referralCode) {
        const applyReferral = functions.httpsCallable('applyReferralAndActivateRewards');
        await applyReferral({ referralCode: referralCode, rewardType: 'student' });
      }

      setShowOffer(true);
    } catch (error) {
      console.error('Verification failed:', error); // Log the error for debugging
      setError('Failed to verify student status. Please try again.'); // Set a user-friendly error message
    } finally {
      setIsLoading(false); // Set loading to false
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
          
          <Input
            label="Referral Code (Optional)"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
            placeholder="Enter referral code"
          />

          {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}

          <Button onClick={verifyStudentStatus} disabled={isLoading}>
            {isLoading ? 'Verifying...' : 'Verify Student Status'} {/* Change button text based on loading state */}
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