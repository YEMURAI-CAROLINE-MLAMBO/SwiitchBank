import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const CreateTicketPage = () => {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('You must be logged in to create a ticket.');
      return;
    }
    try {
      const response = await axios.post('/api/tickets', {
        userId: user.uid,
        subject,
        description,
        priority,
      });
      alert('Ticket created successfully!');
      // a a redirect to the ticket list page
    } catch (error) {
      console.error('Error creating ticket:', error);
      alert('Failed to create ticket.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create a Support Ticket</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <ReactQuill
            theme="snow"
            value={description}
            onChange={setDescription}
            className="mt-1"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
            Priority
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
            <option>Urgent</option>
          </select>
        </div>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit Ticket
        </button>
      </form>
    </div>
  );
};

export default CreateTicketPage;
