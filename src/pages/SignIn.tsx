import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowUpRight, ArrowLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function SignIn() {
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn(email, password)

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
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="/images/moonlit-temple.jpg"
          alt="Moonlit temple"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-kuro/60 to-kuro/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-kuro/80 via-transparent to-kuro/20" />

        {/* Overlay content */}
        <div className="absolute bottom-16 left-12 right-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-px h-10 bg-aka" />
            <span className="text-aka text-xs tracking-[0.2em] uppercase">
              Welcome back
            </span>
          </div>
          <h2 className="font-serif text-shiro text-3xl leading-tight mb-3">
            Step through
            <br />
            <em className="text-mist" style={{ fontStyle: 'italic' }}>the gate.</em>
          </h2>
          <p className="text-stone text-sm max-w-sm">
            Your role is remembered. Just sign in — DrumGate knows who you are.
          </p>
        </div>
      </div>

      {/* Right — Form side */}
      <div className="w-full lg:w-1/2 flex flex-col bg-pure">
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
        <div className="flex-1 flex items-center justify-center px-6 md:px-12 lg:px-20">
          <div className="w-full max-w-sm">
            {/* Header */}
            <div className="mb-10">
              <span className="text-aka text-[0.65rem] tracking-[0.2em] uppercase block mb-3">
                Sign in to your account
              </span>
              <h1
                className="font-serif text-kuro leading-tight"
                style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)' }}
              >
                Welcome
                <br />
                <em className="text-stone" style={{ fontStyle: 'italic' }}>back.</em>
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
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
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
              </div>

              {/* Note about role */}
              <p className="text-[0.7rem] text-stone/70 italic">
                Your role (Patient, Doctor, or Admin) is detected automatically.
              </p>

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
                    Sign In <ArrowUpRight size={14} />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-mist/30" />
              <span className="text-stone text-xs">or</span>
              <div className="flex-1 h-px bg-mist/30" />
            </div>

            {/* Sign up link */}
            <p className="text-center text-sm text-ash">
              New to DrumGate?{' '}
              <Link
                to="/signup"
                className="text-aka font-medium hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="p-6 text-center">
          <p className="text-stone/40 text-xs">
            © {new Date().getFullYear()} DrumGate · Where care finds its way
          </p>
        </div>
      </div>
    </div>
  )
}
