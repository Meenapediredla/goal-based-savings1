import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/api";

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await registerUser({
  name,
  email,
  password
});
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      alert(
        err.response?.data?.error ||
          "Registration failed. Check API connection or use a different email."
      );
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
            Start Your Financial Journey Today
          </h2>
          <p className="text-blue-200 text-lg mb-8">
            Join thousands who are achieving their savings goals with GoalTracker.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600/30 rounded-lg flex items-center justify-center">🎯</div>
              <span className="text-blue-100">Set unlimited savings goals</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600/30 rounded-lg flex items-center justify-center">📊</div>
              <span className="text-blue-100">Track progress with visual charts</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600/30 rounded-lg flex items-center justify-center">🔔</div>
              <span className="text-blue-100">Get smart reminders & insights</span>
            </div>
          </div>
        </div>

        <p className="text-blue-300 text-sm">© 2026 GoalTracker. All rights reserved.</p>
      </div>

      {/* Right Side - Register Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h1>
              <p className="text-gray-600">Start tracking your goals in less than a minute</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
              <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Full Name
  </label>

  <input
    type="text"
    value={name}
    onChange={(e) => setName(e.target.value)}
    required
    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-gray-900"
    placeholder="Enter your full name"
  />
</div>
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
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-gray-900"
                  placeholder="Minimum 6 characters"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-gray-900"
                  placeholder="Re-enter password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-100 transition-all duration-200 disabled:opacity-50 shadow-sm"
              >
                {loading? 'Creating account...' : 'Create account'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;