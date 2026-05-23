import { Link, Navigate } from "react-router-dom";

const Home = () => {
  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4">
      <div className="bg-white/95 shadow-2xl rounded-3xl p-10 w-full max-w-2xl text-center">
        <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6">
          <span className="text-white text-2xl font-bold">G</span>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Goal Based Savings Tracker
        </h1>

        <p className="text-gray-600 text-lg mb-10 leading-relaxed">
          Set savings goals, track progress, and reach your targets step by step.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/login"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-xl text-lg font-semibold transition shadow-md"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="w-full sm:w-auto bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-10 py-3 rounded-xl text-lg font-semibold transition shadow-md"
          >
            Create account
          </Link>
        </div>

        <p className="text-sm text-gray-500 mt-8">
          Register → Sign in → Dashboard → Add goals
        </p>
      </div>
    </div>
  );
};

export default Home;
