import React, { useState } from 'react';
import { Clock, Mail, Lock } from 'lucide-react';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (email === 'admin@chronokey.com' && password === 'admin') {
      onLogin();
    } else {
      setError('Invalid credentials. Try admin@chronokey.com / admin');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="card" style={{ maxWidth: '400px', width: '100%', margin: '20px' }}>
        <div className="text-center mb-4">
          <div className="flex justify-center">
            <Clock className="text-primary" size={48} />
          </div>
          <h2 className="text-lg font-medium mt-4 mb-2">ChronoKey Admin</h2>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="bg-danger-color bg-opacity-10 text-danger-color p-3 rounded mb-4" role="alert">
                {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email address</label>
              <div className="relative">
                <Mail 
                  className="text-gray absolute" 
                  size={20} 
                  style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="email"
                  placeholder="admin@chronokey.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control"
                  style={{ paddingLeft: '40px' }}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="relative">
                <Lock 
                  className="text-gray absolute" 
                  size={20} 
                  style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="password"
                  placeholder="admin"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
                  style={{ paddingLeft: '40px' }}
                  required
                />
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <a href="#" className="text-primary text-sm">
                Forgot your password?
              </a>
            </div>

            <button type="submit" className="btn btn-primary w-full">
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;