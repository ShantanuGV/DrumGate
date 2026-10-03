import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowUpRight, ArrowLeft, Heart, Stethoscope, Settings } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const roles = [
  {
    value: 'patient',
    label: 'Patient',
    icon: Heart,
    desc: 'Access appointments and medical records',
  },
  {
    value: 'doctor',
    label: 'Doctor',
    icon: Stethoscope,
    desc: 'Manage your practice and patients',
  },
  {
    value: 'admin',
    label: 'Admin',
    icon: Settings,
    desc: 'Oversee the platform',
  },
]

export default function SignUp() {
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('patient')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setLoading(true)

    const result = await signUp({
      full_name: fullName,
      email,
      password,
      role,
    })

    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.message)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — Image side */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden min-h-screen">
        <img
          src="/images/hero-bg.jpg"
          alt="Torii gate in misty mountains"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-kuro/60 to-kuro/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-kuro/80 via-transparent to-kuro/20" />

        {/* Overlay content */}
        <div className="absolute bottom-16 left-12 right-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-px h-10 bg-aka" />
            <span className="text-aka text-xs tracking-[0.2em] uppercase">
              Begin your journey
            </span>
          </div>
          <h2 className="font-serif text-shiro text-3xl leading-tight mb-3">
            Enter
            <br />
            <em className="text-mist" style={{ fontStyle: 'italic' }}>DrumGate.</em>
          </h2>
          <p className="text-stone text-sm max-w-sm">
            Create your account and choose your path. Your password is secured with industry-standard hashing.
          </p>
        </div>
      </div>

      {/* Right — Form side */}
      <div className="w-full lg:w-[55%] flex flex-col bg-pure">
        {/* Top bar */}
        <div className="flex items-center justify-between p-6 md:p-8">
          <Link
            to="/"
            className="flex items-center gap-2 text-stone text-sm hover:text-kuro transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </Link>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 border-2 border-aka rounded flex items-center justify-center" style={{ transform: 'rotate(3deg)' }}>
              <span className="text-aka text-[10px] font-serif font-bold">鼓</span>
            </div>
            <span className="text-kuro text-xs tracking-[0.2em] uppercase font-medium">
              DrumGate
            </span>
          </Link>
        </div>

        {/* Form container */}
        <div className="flex-1 flex items-center justify-center px-6 md:px-12 lg:px-16 py-8">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="mb-8">
              <span className="text-aka text-[0.65rem] tracking-[0.2em] uppercase block mb-3">
                Create your account
              </span>
              <h1
                className="font-serif text-kuro leading-tight"
                style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)' }}
              >
                Step through
                <br />
                <em className="text-stone" style={{ fontStyle: 'italic' }}>for the first time.</em>
              </h1>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-6 p-4 rounded bg-aka/8 border border-aka/20">
                <p className="text-aka text-sm">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-xs text-stone tracking-wider uppercase mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  required
                  autoComplete="name"
                  className="w-full px-4 py-3.5 bg-white border border-mist/50 rounded text-sm text-kuro placeholder:text-mist focus:outline-none focus:border-aka/50 focus:ring-1 focus:ring-aka/20 transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs text-stone tracking-wider uppercase mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="w-full px-4 py-3.5 bg-white border border-mist/50 rounded text-sm text-kuro placeholder:text-mist focus:outline-none focus:border-aka/50 focus:ring-1 focus:ring-aka/20 transition-all"
                />
              </div>

              {/* Role selection */}
              <div>
                <label className="block text-xs text-stone tracking-wider uppercase mb-3">
                  I am a...
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {roles.map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setRole(r.value)}
                      className={`relative p-4 rounded border text-center transition-all duration-300 group ${
                        role === r.value
                          ? 'border-aka bg-aka/5'
                          : 'border-mist/40 bg-white hover:border-ash/40'
                      }`}
                    >
                      <r.icon
                        size={20}
                        className={`mx-auto mb-2 transition-colors ${
                          role === r.value ? 'text-aka' : 'text-stone group-hover:text-ash'
                        }`}
                      />
                      <span
                        className={`text-xs font-medium block ${
                          role === r.value ? 'text-kuro' : 'text-ash'
                        }`}
                      >
                        {r.label}
                      </span>
                      <span className="text-[0.6rem] text-stone mt-1 block leading-tight">
                        {r.desc}
                      </span>
                      {/* Active dot */}
                      {role === r.value && (
                        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-aka" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs text-stone tracking-wider uppercase mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    className="w-full px-4 py-3.5 pr-12 bg-white border border-mist/50 rounded text-sm text-kuro placeholder:text-mist focus:outline-none focus:border-aka/50 focus:ring-1 focus:ring-aka/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone hover:text-kuro transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {/* Password strength indicator */}
                {password.length > 0 && (
                  <div className="mt-2 flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          password.length >= i * 3
                            ? password.length >= 12
                              ? 'bg-green-500'
                              : password.length >= 8
                              ? 'bg-amber-500'
                              : 'bg-aka'
                            : 'bg-mist/30'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs text-stone tracking-wider uppercase mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  required
                  autoComplete="new-password"
                  className={`w-full px-4 py-3.5 bg-white border rounded text-sm text-kuro placeholder:text-mist focus:outline-none focus:ring-1 transition-all ${
                    confirmPassword && confirmPassword !== password
                      ? 'border-aka/50 focus:border-aka focus:ring-aka/20'
                      : 'border-mist/50 focus:border-aka/50 focus:ring-aka/20'
                  }`}
                />
                {confirmPassword && confirmPassword !== password && (
                  <p className="text-aka text-xs mt-1">Passwords don't match</p>
                )}
              </div>

              {/* Security note */}
              <div className="flex items-start gap-2 p-3 rounded bg-kuro/[0.03] border border-mist/20">
                <div className="w-1 h-1 rounded-full bg-aka mt-1.5 flex-shrink-0" />
                <p className="text-[0.7rem] text-stone leading-relaxed">
                  Your password is hashed using bcrypt before storage. We never store or see your actual password.
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-kuro text-shiro text-sm font-medium tracking-wider uppercase rounded hover:bg-sumi transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-shiro/30 border-t-shiro rounded-full animate-spin" />
                ) : (
                  <>
                    Create Account <ArrowUpRight size={14} />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-mist/30" />
              <span className="text-stone text-xs">or</span>
              <div className="flex-1 h-px bg-mist/30" />
            </div>

            {/* Sign in link */}
            <p className="text-center text-sm text-ash">
              Already have an account?{' '}
              <Link
                to="/signin"
                className="text-aka font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
