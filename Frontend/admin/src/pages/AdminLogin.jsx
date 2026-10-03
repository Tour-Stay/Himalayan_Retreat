import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext, apiClient, Logo, APP_URLS, SITE_CONFIG } from '@shared';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
        email: email.trim(),
        password,
      });

      login(res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Invalid email or password. Please verify your staff credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#FAF7F2] px-4 py-12 font-sans selection:bg-[#C5A059]/25 selection:text-[#7C1D23]">
      <div className="w-full max-w-md bg-[#FDFBF7] p-8 sm:p-10 rounded-2xl shadow-xl border border-[#C5A059]/35 relative z-10">
        {/* Crest & Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size={56} />
          </div>
          <span className="text-[10px] text-[#C5A059] font-cinzel font-bold tracking-[0.25em] uppercase block mb-1">
            The Kasar Himalayan Heights
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#2C2523] font-semibold tracking-tight">
            Staff Operations Portal
          </h1>
          <p className="text-[#66605B] text-xs font-normal mt-1.5">
            Resort & Travel Management Desk • Authorized Staff
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-xs text-center font-medium flex items-center justify-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-cinzel uppercase tracking-wider font-semibold text-[#2C2523] mb-1.5">
              Staff Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#C5A059]/40 bg-[#FAF6EF] text-[#2C2523] text-sm placeholder-[#66605B] focus:outline-none focus:border-[#7C1D23] focus:ring-1 focus:ring-[#7C1D23] transition"
                placeholder="admin@himalayan.com"
                autoComplete="email"
              />
              <svg
                className="w-4 h-4 text-[#C5A059] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                />
              </svg>
            </div>
          </div>

          <div>
            <label className="block text-xs font-cinzel uppercase tracking-wider font-semibold text-[#2C2523] mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#C5A059]/40 bg-[#FAF6EF] text-[#2C2523] text-sm placeholder-[#66605B] focus:outline-none focus:border-[#7C1D23] focus:ring-1 focus:ring-[#7C1D23] transition"
                placeholder="••••••••••••"
                autoComplete="current-password"
              />
              <svg
                className="w-4 h-4 text-[#C5A059] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#66605B] hover:text-[#2C2523] transition cursor-pointer p-1"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                    />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-cinzel font-semibold text-xs uppercase tracking-widest bg-[#7C1D23] hover:bg-[#5C151A] text-[#FDFBF7] transition-all duration-300 disabled:opacity-50 cursor-pointer shadow-md mt-3 flex items-center justify-center gap-2 border border-[#C5A059]/40"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-[#FDFBF7] border-t-transparent rounded-full animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In to Office Desk →</span>
            )}
          </button>
        </form>

        {/* Footer Navigation (No technical port numbers) */}
        <div className="mt-8 pt-6 border-t border-[#C5A059]/25 text-center space-y-2.5">
          <div>
            <a
              href={APP_URLS.landing}
              className="text-xs text-[#5C5350] hover:text-[#7C1D23] font-medium transition-colors inline-flex items-center gap-1"
            >
              <span>← Return to Main Website</span>
            </a>
          </div>
          <div className="text-xs text-[#66605B]">
            <a
              href={APP_URLS.hotel}
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#7C1D23] transition-colors"
            >
              Boutique Hotel Stay
            </a>
            <span className="text-[#C5A059]/50 mx-2">•</span>
            <a
              href={APP_URLS.travel}
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#7C1D23] transition-colors"
            >
              Expeditions & Cabs
            </a>
          </div>

          <p className="text-[10px] text-[#66605B] pt-2">
            For office credentials or shift access assistance, call {SITE_CONFIG.conciergePhone}.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AdminLogin;
