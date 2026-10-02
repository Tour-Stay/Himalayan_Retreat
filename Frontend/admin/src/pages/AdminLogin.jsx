import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext, apiClient, Logo, APP_URLS } from '@shared';

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
      const res = await apiClient.post('/auth/login', {
        email,
        password,
      });

      login(res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials or unauthorized account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-ivory px-4 py-12 font-sans selection:bg-gold/20 selection:text-maroon">
      <div className="w-full max-w-md bg-ivory-warm p-8 sm:p-10 rounded-3xl shadow-xl border border-gold/35 relative z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-ivory p-3 flex items-center justify-center border border-gold/30 shadow-xs">
              <Logo size={46} />
            </div>
          </div>
          <span className="text-[10px] text-gold font-bold tracking-[0.25em] uppercase block mb-1 font-mono">
            The Kasar Himalayan Heights
          </span>
          <h1 className="font-serif text-3xl text-charcoal font-medium">
            Staff Operations Portal
          </h1>
          <p className="text-charcoal-muted text-xs font-light mt-1">
            Isolated Management Console • Port 5176
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-charcoal mb-1.5 font-mono">
              Authorized Staff Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gold/30 bg-ivory text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 transition"
              placeholder="admin@himalayan.com"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-charcoal mb-1.5 font-mono">
              Access Secret Key
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gold/30 bg-ivory text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 transition"
              placeholder="••••••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-semibold text-xs uppercase tracking-widest bg-maroon hover:bg-maroon-dark text-ivory transition-all duration-300 disabled:opacity-50 cursor-pointer shadow-md mt-2"
          >
            {loading ? 'Authenticating Staff...' : 'Sign In to Command Portal &rarr;'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gold/20 text-center space-y-2">
          <div>
            <a
              href={APP_URLS.landing}
              className="text-xs text-charcoal-muted hover:text-maroon font-medium transition-colors"
            >
              &larr; Return to Guest Sanctuary (Landing)
            </a>
          </div>
          <div>
            <a
              href={APP_URLS.hotel}
              className="text-xs text-charcoal-muted hover:text-maroon font-medium transition-colors"
            >
              Hotel App (Port 5174)
            </a>
            <span className="text-gold/40 mx-2">•</span>
            <a
              href={APP_URLS.travel}
              className="text-xs text-charcoal-muted hover:text-maroon font-medium transition-colors"
            >
              Travel App (Port 5175)
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminLogin;
