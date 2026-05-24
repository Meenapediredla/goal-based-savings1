import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/api";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) navigate('/dashboard');
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser({ email, password });
      console.log('Backend Response:',res.data)
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('name', res.data.name);
      navigate('/dashboard');
    } catch (error: any) {
      alert(error.response?.status === 401? 'Invalid credentials. Please try again.' : 'Connection error. Please check your network.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-2xl font-bold">G</span>
            </div>
            <span className="text-white text-2xl font-bold">GoalTracker</span>
          </div>
        </div>

        <div className="text-white">
          <h2 className="text-4xl font-bold mb-4 leading-tight">
            Achieve Your Financial Goals with Confidence
          </h2>
          <p className="text-blue-200 text-lg mb-8">
            Track, manage, and accomplish your savings targets with our secure platform.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600/30 rounded-lg flex items-center justify-center">✓</div>
              <span className="text-blue-100">Bank-level security encryption</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600/30 rounded-lg flex items-center justify-center">✓</div>
              <span className="text-blue-100">Real-time progress tracking</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600/30 rounded-lg flex items-center justify-center">✓</div>
              <span className="text-blue-100">Smart savings insights</span>
            </div>
          </div>
        </div>

        <p className="text-blue-300 text-sm">© 2026 GoalTracker. All rights reserved.</p>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-2xl font-bold">G</span>
            </div>
            <span className="text-gray-900 text-2xl font-bold">GoalTracker</span>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign in to your account</h1>
              <p className="text-gray-600">Welcome back! Please enter your details.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-gray-900"
                  placeholder="name@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-gray-900 pr-12"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300" />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {loading? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Signing in...
                  </span>
                ) : 'Sign in'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-600 font-semibold hover:text-blue-700">
                  Sign up for free
                </Link>
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-gray-500 mt-6">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
