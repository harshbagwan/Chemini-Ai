import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Sparkles, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import API from '../utils/api.js'
import { useTheme } from '../context/ThemeContext.jsx'

export default function Login() {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { dark, toggle } = useTheme()
  const navigate = useNavigate()

  const submit = async () => {
    if (!email || !password) return setError('Please fill in both fields.')
    setLoading(true)
    setError('')
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register'
      await API.post(endpoint, { email, password })
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.msg || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleKey = e => { if (e.key === 'Enter') submit() }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'var(--s0)' }}
    >
      {/* Ambient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute rounded-full blur-[120px] opacity-30"
          style={{
            width: 500, height: 500,
            top: '-10%', left: '-10%',
            background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)',
            animation: 'orb-drift 12s ease-in-out infinite',
          }}
        />
        <div
          className="absolute rounded-full blur-[100px] opacity-20"
          style={{
            width: 400, height: 400,
            bottom: '-5%', right: '-5%',
            background: 'radial-gradient(circle, #fb923c 0%, transparent 70%)',
            animation: 'orb-drift 15s ease-in-out infinite reverse',
          }}
        />
        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(var(--t1) 1px, transparent 1px), linear-gradient(90deg, var(--t1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Theme toggle */}
      <button
        onClick={toggle}
        className="absolute top-5 right-5 w-9 h-9 rounded-xl glass flex items-center justify-center text-sm transition-all hover:scale-105"
        style={{ color: 'var(--t2)' }}
      >
        {dark ? '☀' : '☾'}
      </button>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4 shadow-lg"
            style={{ boxShadow: 'var(--shadow-glow)' }}
          >
            <Sparkles size={24} className="text-white" />
          </div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: 'var(--t1)' }}
          >
            Chemini<span className="gradient-text"> AI</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--t3)' }}>
            Context-aware conversations, powered by Gemini
          </p>
        </div>

        {/* Glass card */}
        <div
          className="rounded-2xl p-1"
          style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.3), rgba(251,146,60,0.1), transparent)', }}
        >
          <div
            className="rounded-[13px] p-8"
            style={{ background: 'var(--s2)', border: '1px solid var(--glass-border)' }}
          >
            {/* Tabs */}
            <div
              className="flex rounded-xl p-1 mb-7"
              style={{ background: 'var(--s1)' }}
            >
              {['login', 'register'].map(m => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setError('') }}
                  className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all relative"
                  style={{ color: mode === m ? 'var(--t1)' : 'var(--t3)' }}
                >
                  {mode === m && (
                    <motion.div
                      layoutId="tab-bg"
                      className="absolute inset-0 rounded-lg"
                      style={{ background: 'var(--s3)' }}
                      transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                    />
                  )}
                  <span className="relative z-10 capitalize">{m}</span>
                </button>
              ))}
            </div>

            {/* Fields */}
            <div className="space-y-4">
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: 'var(--t3)' }}
                />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={handleKey}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm transition-all"
                  style={{
                    background: 'var(--s1)',
                    border: '1px solid var(--glass-border)',
                    color: 'var(--t1)',
                    outline: 'none',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--a1)'}
                  onBlur={e => e.target.style.borderColor = 'var(--glass-border)'}
                />
              </div>

              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: 'var(--t3)' }}
                />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={handleKey}
                  className="w-full pl-10 pr-11 py-3 rounded-xl text-sm transition-all"
                  style={{
                    background: 'var(--s1)',
                    border: '1px solid var(--glass-border)',
                    color: 'var(--t1)',
                    outline: 'none',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--a1)'}
                  onBlur={e => e.target.style.borderColor = 'var(--glass-border)'}
                />
                <button
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'var(--t3)' }}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="mt-4 text-sm px-3 py-2 rounded-lg"
                  style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              onClick={submit}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full mt-5 py-3 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-70"
              style={{ background: 'var(--ag)', boxShadow: loading ? 'none' : 'var(--shadow-glow)' }}
            >
              {loading ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Sign in' : 'Create account'}
                  <ArrowRight size={16} />
                </>
              )}
            </motion.button>
          </div>
        </div>

        <p className="text-center text-xs mt-5" style={{ color: 'var(--t3)' }}>
          Chemini AI · Gemini 2.5 Flash · Context-aware conversations
        </p>
      </motion.div>
    </div>
  )
}
