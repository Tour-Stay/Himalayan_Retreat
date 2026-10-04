import { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext, apiClient, Logo, APP_URLS, SITE_CONFIG } from '@shared';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 80);
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
      setError(
        err.response?.data?.message || 'Invalid email or password. Please verify your staff credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen w-full flex items-center justify-center font-sans selection:bg-[#C5A059]/30 selection:text-[#2C2523] overflow-x-hidden relative bg-[#091512]">
      {/* ── Deep Atmospheric Himalayan Dawn / Twilight Background ── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Layered Rich Gradient Backdrop */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 90% 70% at 50% 15%, #0F2E24 0%, #081B15 45%, #05100D 100%)',
          }}
        />

        {/* Ambient Warm Golden Mountain Dawn Glow */}
        <div 
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(197,160,89,0.35) 0%, rgba(124,29,35,0.2) 50%, transparent 80%)',
          }}
        />

        {/* Subtle Starfield / Cosmic Ridge Particles */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-[8%] left-[15%] w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDuration: '4s' }} />
          <div className="absolute top-[18%] left-[32%] w-1.5 h-1.5 bg-[#C5A059] rounded-full opacity-80" />
          <div className="absolute top-[12%] right-[22%] w-1 h-1 bg-white rounded-full opacity-90 animate-pulse" style={{ animationDuration: '5s' }} />
          <div className="absolute top-[25%] right-[12%] w-1.5 h-1.5 bg-[#DFCA9B] rounded-full opacity-70" />
          <div className="absolute top-[35%] left-[8%] w-1 h-1 bg-white rounded-full opacity-60" />
          <div className="absolute top-[28%] left-[48%] w-1 h-1 bg-[#C5A059] rounded-full opacity-80 animate-pulse" style={{ animationDuration: '3.5s' }} />
        </div>

        {/* Grand Himalayan Mountain Silhouettes (Trishul & Nanda Devi Peaks) */}
        {/* Distant Range (High Snowcaps) */}
        <svg 
          className="absolute bottom-0 left-0 w-full h-[55%] opacity-15"
          viewBox="0 0 1440 400" 
          preserveAspectRatio="none"
          fill="none"
        >
          <path 
            fill="url(#peakGradient)" 
            d="M0,400 L0,220 L110,170 L210,230 L320,130 L430,240 L550,110 L680,260 L800,90 L920,240 L1040,140 L1170,250 L1290,160 L1380,220 L1440,180 L1440,400 Z"
          />
          <defs>
            <linearGradient id="peakGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#DFCA9B" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0B231B" stopOpacity="0.9" />
            </linearGradient>
          </defs>
        </svg>

        {/* Mid Pine Ridges (Kasar Devi Ridge) */}
        <svg 
          className="absolute bottom-0 left-0 w-full h-[40%] opacity-25" 
          viewBox="0 0 1440 320" 
          preserveAspectRatio="none"
        >
          <path 
            fill="#081E17" 
            d="M0,320 L0,180 L80,150 L180,195 L290,140 L400,185 L520,130 L640,190 L760,120 L890,175 L1010,135 L1140,195 L1260,145 L1370,185 L1440,160 L1440,320 Z"
          />
        </svg>

        {/* Foreground Pine Tree Silhouette Band */}
        <svg 
          className="absolute bottom-0 left-0 w-full h-[22%] opacity-40" 
          viewBox="0 0 1440 180" 
          preserveAspectRatio="none"
        >
          <path 
            fill="#040F0C" 
            d="M0,180 L0,80 Q60,40 120,70 T240,60 T360,85 T480,55 T600,75 T720,50 T840,80 T960,60 T1080,85 T1200,55 T1320,75 T1440,65 L1440,180 Z"
          />
        </svg>

        {/* Subtle Luxury Sacred Geometry / Celestial Grid */}
        <div 
          className="absolute inset-0 opacity-[0.025]" 
          style={{
            backgroundImage: 'radial-gradient(circle, #C5A059 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }} 
        />
      </div>

      {/* ── Main Container: Symmetrical & Balanced Split ── */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10 xl:gap-16 min-h-[calc(100vh-4rem)]">
        
        {/* ── Left Column: Editorial Resort Command Hub ── */}
        <div className={`w-full lg:w-[50%] flex flex-col justify-between transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div>
            {/* Top Brand Identity Badge */}
            <div className="inline-flex items-center gap-3.5 px-4 py-2.5 rounded-2xl bg-[#0D241C]/80 border border-[#C5A059]/35 backdrop-blur-md shadow-xl mb-8 group hover:border-[#C5A059]/60 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#12382C] to-[#081813] border border-[#C5A059]/40 flex items-center justify-center p-1 shadow-inner">
                <Logo size={32} />
              </div>
              <div className="pr-2">
                <span className="text-[10px] font-cinzel uppercase tracking-[0.25em] text-[#C5A059] font-bold block">
                  The Kasar Himalayan Heights
                </span>
                <span className="text-[11px] font-sans text-stone-300 flex items-center gap-1.5 mt-0.5">
                  <svg className="w-3 h-3 text-[#C5A059]/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Crank's Ridge, Almora • 2,116m Elevation
                </span>
              </div>
            </div>

            {/* Editorial Title */}
            <div className="space-y-4 mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#DFCA9B] text-[10px] font-cinzel font-semibold uppercase tracking-[0.18em]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Resort Operations & Concierge Terminal
              </div>

              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-serif font-bold text-[#FAF6EF] tracking-tight leading-[1.12]">
                Staff Command
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#DFCA9B] via-[#C5A059] to-[#E58A2B] mt-1 italic font-normal">
                  Operations Portal
                </span>
              </h1>

              <p className="text-stone-300/80 text-sm sm:text-base leading-relaxed max-w-xl font-light">
                The centralized operational console managing luxury suites, chauffeured mountain transfers, 
                table reservations, and guest folios amidst the serene pine forests of Kumaon.
              </p>
            </div>

            {/* Live Operational Snapshot Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-xl mb-8">
              <div className="p-3.5 rounded-2xl bg-[#0F2820]/60 border border-[#C5A059]/20 backdrop-blur-md hover:border-[#C5A059]/40 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-cinzel uppercase tracking-wider text-[#C5A059] font-bold">Suite Inventory</span>
                  <svg className="w-3.5 h-3.5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="text-lg font-serif font-bold text-white">Live Sync</div>
                <div className="text-[11px] text-stone-400 mt-0.5">Real-time room occupancy</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0F2820]/60 border border-[#C5A059]/20 backdrop-blur-md hover:border-[#C5A059]/40 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-cinzel uppercase tracking-wider text-[#C5A059] font-bold">Hill Dispatch</span>
                  <svg className="w-3.5 h-3.5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <div className="text-lg font-serif font-bold text-white">Chauffeur Desk</div>
                <div className="text-[11px] text-stone-400 mt-0.5">Train & cab coordination</div>
              </div>

              <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-[#0F2820]/60 border border-[#C5A059]/20 backdrop-blur-md hover:border-[#C5A059]/40 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-cinzel uppercase tracking-wider text-[#C5A059] font-bold">Folio & Yield</span>
                  <svg className="w-3.5 h-3.5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-lg font-serif font-bold text-white">Direct Billing</div>
                <div className="text-[11px] text-stone-400 mt-0.5">GST & payment tracking</div>
              </div>
            </div>
          </div>

          {/* Footer Status Indicators */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-[11px] text-stone-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
              <span className="text-stone-300 font-medium">Server Connected</span>
              <span className="text-white/20">•</span>
              <span>Port 5000 API Sync</span>
            </div>
            <div className="font-mono text-[10px] text-[#C5A059]/80 uppercase tracking-widest">
              Security Level 4 • Staff Role
            </div>
          </div>
        </div>

        {/* ── Right Column: The Luxury Authentication Folio Card ── */}
        <div className={`w-full lg:w-[46%] max-w-[480px] transition-all duration-1000 delay-150 ${mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
          <div className="relative">
            {/* Ambient Card Backlight */}
            <div className="absolute -inset-1 rounded-[32px] bg-gradient-to-b from-[#C5A059]/30 via-transparent to-[#7C1D23]/25 blur-lg opacity-70" />

            {/* Main Luxury Parchment Card */}
            <div className="relative rounded-[28px] bg-[#FAF7F2] border border-[#C5A059]/50 shadow-2xl overflow-hidden text-[#2C2523]">
              
              {/* Delicate Top Gold Filigree Stripe */}
              <div className="h-2 w-full bg-gradient-to-r from-[#7C1D23] via-[#C5A059] to-[#5C151A]" />

              <div className="p-7 sm:p-9">
                {/* Card Header & Security Badge */}
                <div className="text-center mb-7">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF0E1] border border-[#C5A059]/40 mb-3 shadow-xs">
                    <svg className="w-3.5 h-3.5 text-[#7C1D23]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-[10px] font-cinzel font-bold text-[#7C1D23] uppercase tracking-[0.2em]">
                      Restricted Access Portal
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2C2523] tracking-tight">
                    Staff Authentication
                  </h2>
                  <p className="text-stone-500 text-xs mt-1.5 max-w-xs mx-auto">
                    Sign in with your verified management credentials to enter the operations desk.
                  </p>
                </div>

                {/* Error Banner */}
                {error && (
                  <div className="mb-6 p-3.5 rounded-xl bg-rose-50/90 border border-rose-200 text-rose-800 text-xs flex items-start gap-3 animate-[shake_0.5s_ease-in-out]">
                    <svg className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div className="leading-snug">{error}</div>
                  </div>
                )}

                {/* Authentication Form */}
                <form onSubmit={handleLogin} className="space-y-4">
                  {/* Staff Email Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[11px] font-cinzel uppercase tracking-[0.14em] font-bold text-[#2C2523]">
                        Staff Email Address
                      </label>
                      <span className="text-[10px] text-stone-400 font-mono">admin@himalayan.com</span>
                    </div>

                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400 group-focus-within:text-[#7C1D23] transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="admin@himalayan.com"
                        autoComplete="email"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#C5A059]/40 text-[#2C2523] placeholder-stone-400 text-xs sm:text-sm font-sans focus:outline-hidden focus:border-[#7C1D23] focus:ring-2 focus:ring-[#7C1D23]/15 transition-all shadow-xs"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[11px] font-cinzel uppercase tracking-[0.14em] font-bold text-[#2C2523]">
                        Access Key / Password
                      </label>
                      <span className="text-[10px] text-stone-400">Encrypted</span>
                    </div>

                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400 group-focus-within:text-[#7C1D23] transition-colors">
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
                        className="w-full pl-10 pr-11 py-3 rounded-xl bg-white border border-[#C5A059]/40 text-[#2C2523] placeholder-stone-400 text-xs sm:text-sm font-sans focus:outline-hidden focus:border-[#7C1D23] focus:ring-2 focus:ring-[#7C1D23]/15 transition-all shadow-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-[#7C1D23] transition-colors cursor-pointer"
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
                      className="w-full py-3.5 px-6 rounded-xl font-cinzel font-bold text-xs uppercase tracking-[0.2em] text-white transition-all duration-300 disabled:opacity-60 cursor-pointer shadow-lg hover:shadow-xl hover:brightness-105 active:scale-[0.99] flex items-center justify-between group border border-[#C5A059]/40"
                      style={{
                        background: 'linear-gradient(135deg, #7C1D23 0%, #9B2830 50%, #601419 100%)',
                      }}
                    >
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-[#DFCA9B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span>{loading ? 'Authenticating...' : 'Enter Command Portal'}</span>
                      </span>

                      {loading ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <svg className="w-4 h-4 text-[#DFCA9B] group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </form>

                {/* Subtle Luxury Divider */}
                <div className="flex items-center gap-3 my-6">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#C5A059]/30 to-transparent" />
                  <span className="text-[10px] font-cinzel text-stone-400 uppercase tracking-widest">Resort Channels</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#C5A059]/30 to-transparent" />
                </div>

                {/* Navigation Links */}
                <div className="grid grid-cols-3 gap-2">
                  <a
                    href={APP_URLS.landing}
                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-stone-50 border border-stone-200/80 hover:border-[#C5A059]/50 hover:bg-[#FAF6EF] transition-all group text-center"
                  >
                    <svg className="w-4 h-4 text-[#7C1D23] mb-1 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span className="text-[10px] font-cinzel font-bold text-stone-700">Resort Home</span>
                  </a>

                  <a
                    href={APP_URLS.hotel}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-stone-50 border border-stone-200/80 hover:border-[#C5A059]/50 hover:bg-[#FAF6EF] transition-all group text-center"
                  >
                    <svg className="w-4 h-4 text-[#7C1D23] mb-1 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="text-[10px] font-cinzel font-bold text-stone-700">Hotel Suites</span>
                  </a>

                  <a
                    href={APP_URLS.travel}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-stone-50 border border-stone-200/80 hover:border-[#C5A059]/50 hover:bg-[#FAF6EF] transition-all group text-center"
                  >
                    <svg className="w-4 h-4 text-[#7C1D23] mb-1 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <span className="text-[10px] font-cinzel font-bold text-stone-700">Travel Desk</span>
                  </a>
                </div>

                {/* Concierge Assistance */}
                <div className="mt-5 text-center">
                  <a
                    href={`tel:${SITE_CONFIG.conciergePhone || '+919690621247'}`}
                    className="inline-flex items-center gap-1.5 text-[11px] text-stone-500 hover:text-[#7C1D23] transition-colors"
                  >
                    <svg className="w-3 h-3 text-[#C5A059]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>Desk Helpline: <strong className="font-mono text-stone-700">{SITE_CONFIG.conciergePhone}</strong></span>
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom Security Footer */}
            <div className="mt-4 flex items-center justify-center gap-2 text-stone-400/80 text-[10px]">
              <svg className="w-3.5 h-3.5 text-[#C5A059]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>256-Bit SSL Encrypted Session • Authorized Staff Only</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AdminLogin;
