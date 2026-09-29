import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      // Pass the JWT token to context
      login(res.data.token);
      
      // Redirect to dashboard
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="pt-32 pb-20 px-4 min-h-screen flex items-center justify-center bg-cream">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl text-text-dark mb-2">Admin Access</h1>
          <p className="text-text-light text-sm">Sign in to manage Devbhoomi Retreat</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-text-dark mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-text-dark text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition"
              placeholder="abc_lalit@gmail.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-dark mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-text-dark text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-accent transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AdminLogin;
