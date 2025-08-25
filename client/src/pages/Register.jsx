import React, { useState } from 'react';
import api from '../../api/http';
import { useAuthStore } from '../../store/authStore';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('Shekhar');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuthStore();
  const nav = useNavigate();
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      login(data.token, data.user);
      nav('/planner');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      console.error('Register error:', err);
    }
  };

  return (
    <div style={{ padding: 16, maxWidth: 360, margin: '0 auto' }}>
      <h2>Register</h2>
      <form onSubmit={onSubmit}>
        <input
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ display: 'block', margin: '8px 0', width: '100%' }}
        />
        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ display: 'block', margin: '8px 0', width: '100%' }}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ display: 'block', margin: '8px 0', width: '100%' }}
        />
        <button type="submit">Create account</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ marginTop: 8 }}>
        Have an account? <Link to="/login">Login</Link>
      </div>
    </div>
  );
}
