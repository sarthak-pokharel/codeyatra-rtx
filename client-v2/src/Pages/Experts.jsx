import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { _hostname } from '../apiRoutes';
import ExpertForm from './ExpertCreationForm';

export default function Experts() {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    services: '',
    description: '',
    token: localStorage.getItem('token')
  });

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const response = await axios.get(_hostname + '/api/expert-profiles');
        setExperts(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExperts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(_hostname + '/api/new-expert-profile', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setShowForm(false);
      setFormData({
        // created_by: '',
        title: '',
        services: '',
        description: '',
        token: localStorage.getItem('token')
      });
      // Refresh the experts list
      const response = await axios.get(_hostname + '/api/expert-profiles');
      setExperts(response.data.data);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Experts Page</h1>
      <ul>
        {experts.map((expert) => (
          <li key={expert.id}>
            <h2>{expert.title}</h2>
            <p>{expert.services}</p>
            <p>{expert.description}</p>
            <p>Created by: {expert.first_name} {expert.last_name}</p>
          </li>
        ))}
      </ul>
      <button
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#6200ea',
          color: 'white',
          borderRadius: '50%',
          width: '56px',
          height: '56px',
          fontSize: '24px',
          border: 'none',
          cursor: 'pointer'
        }}
        onClick={() => setShowForm(true)}
      >
        +
      </button>
      {showForm && (
        <ExpertForm
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          setShowForm={setShowForm}
        />
      )}
    </div>
  );
}