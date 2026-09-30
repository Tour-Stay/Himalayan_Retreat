import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Logo from '../components/Logo';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
    <section className="py-12 px-4 min-h-screen flex items-center justify-center bg-[#FBF9F5] relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-primary/5 border border-secondary/20 relative z-10 animate-fade-in">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 p-3 flex items-center justify-center border border-secondary/20">
              <Logo size={46} />
            </div>
          </div>
          <span className="text-[10px] text-secondary font-bold tracking-[0.25em] uppercase block mb-1">
            The Kasar Himalayan Heights & Expeditions
          </span>
          <h1 className="font-heading text-3xl text-text-dark font-semibold">Staff Operations</h1>
          <p className="text-text-light text-xs font-light mt-1">High-Altitude Alpine Chalets • 7,500 FT</p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-text-dark mb-1.5">
              Authorized Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#FBF9F5] text-text-dark text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition"
              placeholder="admin@himalayan.com"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-text-dark mb-1.5">
              Access Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#FBF9F5] text-text-dark text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition"
              placeholder="••••••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-gold py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 disabled:opacity-50 cursor-pointer shadow-md mt-2"
          >
            {loading ? 'Authenticating Staff...' : 'Sign In to Command Portal →'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <Link
            to="/"
            className="text-xs text-text-light hover:text-primary font-medium transition-colors"
          >
            ← Return to Public Guest Website
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AdminLogin;
