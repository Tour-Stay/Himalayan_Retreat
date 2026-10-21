import { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext, apiClient, Logo, APP_URLS } from '@shared';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { login, isAdminLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAdminLoggedIn) {
      const destination = location.state?.from?.pathname || '/rooms';
      navigate(destination, { replace: true });
    }
  }, [isAdminLoggedIn, navigate, location]);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(timer);
  }, []);

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
      const destination = location.state?.from?.pathname || '/rooms';
      navigate(destination, { replace: true });
    } catch (err) {
      if (!err.response) {
        setError('Cannot connect to backend server (http://localhost:5000). Please check if backend is running.');
      } else {
        setError(err.response?.data?.message || 'Invalid credentials. Please verify your email and password.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen w-full flex items-center justify-center font-sans selection:bg-[#0F172A]/20 selection:text-[#0F172A] bg-[#AEC4D4] text-[#0F172A] relative px-4 py-8 sm:py-12 overflow-x-hidden">

      {/* ── Architectural Grid Overlay on #AEC4D4 Canvas ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage: 'linear-gradient(to right, #0F172A 1px, transparent 1px), linear-gradient(to bottom, #0F172A 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* ── Soft Ambient Luminous Accent ── */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 pointer-events-none opacity-30 blur-3xl"
        style={{
          background: 'radial-gradient(ellipse at top, rgba(255,255,255,0.8) 0%, transparent 70%)',
        }}
      />

      {/* ── Main Container: Desktop 2-Column | Mobile Clean Single Card ── */}
      <div className="w-full max-w-6xl mx-auto relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10 xl:gap-16">

        {/* ── Left Column: Editorial Resort Showcase (Desktop ONLY, hidden on mobile) ── */}
        <div className={`hidden lg:flex flex-col justify-between w-full lg:w-[52%] space-y-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>

          <div>
            {/* Brand Crest */}
            <div className="inline-flex items-center gap-3.5 px-4 py-2 bg-white/95 border border-slate-300 shadow-sm mb-6">
              <div className="p-1.5 bg-[#0F172A] border border-[#AEAC78]/50 shadow-xs flex items-center justify-center">
                <Logo size={36} />
              </div>
              <div>
                <span className="text-[10px] font-cinzel uppercase tracking-[0.25em] text-[#0F172A] font-bold block">
                  The Kasar Himalayan Heights
                </span>
                <span className="text-[11px] text-slate-600 flex items-center gap-1.5 mt-0.5 font-sans">
                  <svg className="w-3 h-3 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Kasar Devi Ridge, Almora • 2,116m Elevation
                </span>
              </div>
            </div>

            {/* Editorial Title */}
            <div className="space-y-3 mb-6">
              <h1 className="text-3xl sm:text-4xl xl:text-5xl font-serif font-bold text-[#0F172A] tracking-tight leading-tight">
                Grand Hospitality &amp;
                <span className="block text-[#1E3A8A] mt-1 font-normal italic">
                  Property Administration
                </span>
              </h1>

              <p className="text-slate-700 text-sm leading-relaxed max-w-lg font-normal">
                The centralized operational console managing luxury Himalayan suites, chauffeured mountain fleet transfers, guest folios, and direct reservations amidst the serene pine forests of Kumaon.
              </p>
            </div>

            {/* Live Operational Snapshot Tiles */}
            <div className="grid grid-cols-3 gap-3 max-w-lg mb-6">
              <div className="p-3.5 bg-white/95 border border-slate-300 shadow-sm transition-colors hover:border-[#0F172A]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-cinzel uppercase tracking-wider text-slate-700 font-bold">Suites</span>
                  <svg className="w-3.5 h-3.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="text-base font-serif font-bold text-[#0F172A]">Live Inventory</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Real-time room occupancy</div>
              </div>

              <div className="p-3.5 bg-white/95 border border-slate-300 shadow-sm transition-colors hover:border-[#0F172A]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-cinzel uppercase tracking-wider text-slate-700 font-bold">Chauffeurs</span>
                  <svg className="w-3.5 h-3.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <div className="text-base font-serif font-bold text-[#0F172A]">Hill Fleet</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Kainchi &amp; station dispatch</div>
              </div>

              <div className="p-3.5 bg-white/95 border border-slate-300 shadow-sm transition-colors hover:border-[#0F172A]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-cinzel uppercase tracking-wider text-slate-700 font-bold">Billing</span>
                  <svg className="w-3.5 h-3.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-base font-serif font-bold text-[#0F172A]">Guest Folios</div>
                <div className="text-[10px] text-slate-500 mt-0.5">GST tax invoices &amp; dues</div>
              </div>
            </div>
          </div>

          {/* System Footer Status */}
          <div className="pt-4 border-t border-slate-400/40 flex items-center justify-between text-[11px] text-slate-700">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600 shadow-[0_0_8px_rgba(5,150,105,0.4)]" />
              <span className="font-semibold text-slate-800">Server Connected</span>
              <span className="text-slate-400">•</span>
              <span>256-Bit SSL Encrypted Session</span>
            </div>
            <div className="font-mono text-[10px] text-slate-700 uppercase tracking-widest font-bold">
              Manager Access
            </div>
          </div>
        </div>

        {/* ── Right Column: The Architectural Login Card ── */}
        <div className={`w-full lg:w-[44%] max-w-md transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>

          <div className="bg-white border border-slate-300 shadow-2xl relative">

            {/* Top Accent Strip */}
            <div className="h-1.5 w-full bg-[#0F172A]" />

            <div className="p-7 sm:p-9 space-y-6">

              {/* Mobile Branding Crest (Shown only on small screens) */}
              <div className="lg:hidden text-center pb-4 border-b border-slate-100">
                <div className="inline-flex items-center justify-center p-2 bg-[#0F172A] border border-[#AEAC78]/50 shadow-xs mb-2">
                  <Logo size={36} />
                </div>
                <div className="text-[10px] font-cinzel uppercase tracking-[0.25em] text-[#0F172A] font-bold">
                  The Kasar Himalayan Heights
                </div>
              </div>

              {/* Card Header: Simple & Clear */}
              <div className="text-center space-y-1.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F1F5F9] border border-slate-300 text-[10px] font-cinzel uppercase tracking-[0.2em] text-[#0F172A] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span>Admin Panel</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0F172A] tracking-tight pt-1">
                  Staff Sign In
                </h2>
                <p className="text-xs text-slate-500 font-sans">
                  Enter your credentials to manage hotel operations.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-[shake_0.4s_ease-in-out]">
                  <svg className="w-4 h-4 text-red-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div className="leading-snug">{error}</div>
                </div>
              )}

              {/* Authentication Form */}
              <form onSubmit={handleLogin} className="space-y-4">

                {/* Email Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-cinzel uppercase tracking-[0.14em] font-bold text-[#0F172A]">
                      Email Address
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">Staff Account</span>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="manager@kasarheights.com"
                      autoComplete="email"
                      className="w-full pl-10 pr-3.5 py-3 bg-[#FAF8F5] border border-slate-300 text-[#0F172A] placeholder-slate-400 text-xs sm:text-sm font-sans focus:outline-none focus:border-[#0F172A] focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-cinzel uppercase tracking-[0.14em] font-bold text-[#0F172A]">
                      Password
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">Encrypted</span>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••••••"
                      autoComplete="current-password"
                      className="w-full pl-10 pr-10 py-3 bg-[#FAF8F5] border border-slate-300 text-[#0F172A] placeholder-slate-400 text-xs sm:text-sm font-sans focus:outline-none focus:border-[#0F172A] focus:bg-white transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-[#0F172A] transition-colors cursor-pointer"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 bg-[#0F172A] hover:bg-[#1E293B] text-white font-cinzel font-bold text-xs uppercase tracking-[0.2em] transition-all duration-200 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 border border-[#0F172A] shadow-sm"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        <span>Logging in...</span>
                      </>
                    ) : (
                      <>
                        <span>Login</span>
                        <span className="font-mono text-sm ml-1">→</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Architectural Divider */}
              <div className="flex items-center gap-3 pt-1">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-[10px] font-cinzel uppercase tracking-widest text-slate-400">Live Websites</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              {/* Quick Live Jump Links */}
              <div className="grid grid-cols-3 gap-2">
                <a
                  href={APP_URLS.landing}
                  className="p-2.5 bg-[#FAF8F5] border border-slate-200 hover:border-[#0F172A] hover:bg-white transition-all text-center group"
                  title="Open main landing website"
                >
                  <div className="text-[10px] font-cinzel font-bold text-slate-700 group-hover:text-[#0F172A]">
                    Main Site
                  </div>
                  <div className="text-[9px] text-slate-400 font-mono mt-0.5">Live ↗</div>
                </a>

                <a
                  href={APP_URLS.hotel}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 bg-[#FAF8F5] border border-slate-200 hover:border-[#0F172A] hover:bg-white transition-all text-center group"
                  title="Open hotel rooms booking page"
                >
                  <div className="text-[10px] font-cinzel font-bold text-slate-700 group-hover:text-[#0F172A]">
                    Hotel Suites
                  </div>
                  <div className="text-[9px] text-slate-400 font-mono mt-0.5">Rooms ↗</div>
                </a>

                <a
                  href={APP_URLS.travel}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 bg-[#FAF8F5] border border-slate-200 hover:border-[#0F172A] hover:bg-white transition-all text-center group"
                  title="Open cabs and tours booking page"
                >
                  <div className="text-[10px] font-cinzel font-bold text-slate-700 group-hover:text-[#0F172A]">
                    Travel Desk
                  </div>
                  <div className="text-[9px] text-slate-400 font-mono mt-0.5">Cabs ↗</div>
                </a>
              </div>

            </div>
          </div>

          {/* Simple Bottom Security Note */}
          <div className="mt-4 text-center">
            <p className="text-[10px] font-cinzel text-slate-600 uppercase tracking-widest flex items-center justify-center gap-1.5 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span>The Kasar Himalayan Heights • Staff Terminal</span>
            </p>
          </div>

        </div>

      </div>

    </section>
  );
};

export default AdminLogin;
