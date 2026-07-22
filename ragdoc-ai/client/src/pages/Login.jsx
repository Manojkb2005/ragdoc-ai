import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/login", {
        email,
        password,
      });

      login(res.data.token, res.data.user);

      navigate("/chat");
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-5">

      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-2xl bg-slate-800 shadow-2xl border border-slate-700 p-8"
      >

        {/* Logo */}

        <div className="text-center mb-8">

          <div className="text-6xl mb-3">
            📚
          </div>

          <h1 className="text-3xl font-bold text-white">
            RAGDoc AI
          </h1>

          <p className="text-gray-400 mt-2">
            Login to continue chatting with your PDFs
          </p>

        </div>

        {/* Email */}

        <label className="text-gray-300 text-sm">
          Email Address
        </label>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 mb-5 w-full rounded-lg bg-slate-900 border border-slate-700 p-3 text-white outline-none focus:border-blue-500 transition"
          required
        />

        {/* Password */}

        <label className="text-gray-300 text-sm">
          Password
        </label>

        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 mb-2 w-full rounded-lg bg-slate-900 border border-slate-700 p-3 text-white outline-none focus:border-blue-500 transition"
          required
        />

        {/* Forgot Password */}

        <div className="text-right mb-6">

          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            Forgot Password?
          </button>

        </div>

        {/* Login Button */}

        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded-lg py-3 font-semibold transition ${
            loading
              ? "bg-slate-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white`}
        >

          {loading ? (
            <div className="flex justify-center items-center gap-2">

              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>

              Logging in...

            </div>
          ) : (
            "Login"
          )}

        </button>

        {/* Divider */}

        <div className="flex items-center my-6">

          <div className="flex-1 border-t border-slate-700"></div>

          <span className="px-3 text-gray-500 text-sm">
            OR
          </span>

          <div className="flex-1 border-t border-slate-700"></div>

        </div>

        {/* Signup */}

        <p className="text-center text-gray-400">

          Don't have an account?{" "}

          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="text-blue-400 hover:text-blue-300 font-semibold"
          >
            Create Account
          </button>

        </p>

      </form>

    </div>
  );
}

export default Login;