import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTasks } from '@fortawesome/free-solid-svg-icons';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === 'admin@xts.com' && password === 'Admin') {
      setError('');
      onLogin && onLogin();
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="d-flex vh-100">
      <div
        className="d-none d-md-flex col-md-6 align-items-center justify-content-center"
        style={{
          background: 'linear-gradient(to right, #4d46e1, #6a5acd)',
          color: 'white',
          padding: '2rem'
        }}
      >
        <div className="text-center">
          <FontAwesomeIcon icon={faTasks} size="5x" className="mb-4" />
          <h1 className="display-4 fw-bold mb-3">Welcome to Taskly</h1>
          <p className="lead">Your ultimate task management solution.</p>
        </div>
      </div>

      <div className="col-12 col-md-6 d-flex align-items-center justify-content-center bg-light p-4">
        <div className="card shadow p-5 border-0 rounded-4" style={{ minWidth: 320, maxWidth: 400, width: '90%' }}>
          <div className="text-center mb-4">
            <h3 className="mb-0 fw-bold" style={{ color: '#333' }}>Login to Your Account</h3>
            <p className="text-muted">Enter your credentials to access Taskly</p>
          </div>
          {error && <div className="alert alert-danger text-center">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label text-muted">Email address</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="mb-4">
              <label className="form-label text-muted">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn w-100 py-2 fw-bold text-white" style={{ backgroundColor: '#4d46e1', border: 'none', borderRadius: '8px' }}>
              Login
            </button>
            <div className="text-center mt-3">
              <a href="#" className="text-decoration-none" style={{ color: '#4d46e1' }}>Forgot Password?</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;