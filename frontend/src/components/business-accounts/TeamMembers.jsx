import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const TeamMembers = ({ businessId }) => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await api.get(
          `/api/business-accounts/${businessId}/team-members`
        );
        setTeamMembers(response.data);
      } catch (error) {
        console.error('Failed to fetch team members', error);
      }
    };

    if (businessId) {
      fetchTeamMembers();
    }
  }, [businessId]);

  const handleAddTeamMember = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(
        `/api/business-accounts/${businessId}/team-members`,
        { email, role }
      );
      setTeamMembers([...teamMembers, response.data]);
      setEmail('');
      setRole('member');
    } catch (error) {
      console.error('Failed to add team member', error);
    }
  };

  const handleUpdateTeamMember = async (memberId, newRole) => {
    try {
      await api.put(
        `/api/business-accounts/${businessId}/team-members/${memberId}`,
        { role: newRole }
      );
      setTeamMembers(
        teamMembers.map((member) =>
          member.userId === memberId ? { ...member, role: newRole } : member
        )
      );
    } catch (error) {
      console.error('Failed to update team member', error);
    }
  };

  const handleRemoveTeamMember = async (memberId) => {
    try {
      await api.delete(
        `/api/business-accounts/${businessId}/team-members/${memberId}`
      );
      setTeamMembers(teamMembers.filter((member) => member.userId !== memberId));
    } catch (error) {
      console.error('Failed to remove team member', error);
    }
  };

  return (
    <div>
      <h3>Team Members</h3>
      <ul>
        {teamMembers.map((member) => (
          <li key={member.userId}>
            {member.userId} - {member.role}
            <select
              value={member.role}
              onChange={(e) =>
                handleUpdateTeamMember(member.userId, e.target.value)
              }
            >
              <option value="admin">Admin</option>
              <option value="accountant">Accountant</option>
              <option value="operations">Operations</option>
            </select>
            <button onClick={() => handleRemoveTeamMember(member.userId)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleAddTeamMember}>
        <h4>Add Team Member</h4>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Role:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="admin">Admin</option>
            <option value="accountant">Accountant</option>
            <option value="operations">Operations</option>
          </select>
        </div>
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default TeamMembers;
