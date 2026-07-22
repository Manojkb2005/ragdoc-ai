import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const getStrength = () => {
    if (password.length < 6)
      return {
        text: "Weak",
        color: "text-red-400",
      };

    if (
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^A-Za-z0-9]/.test(password) &&
      password.length >= 8
    ) {
      return {
        text: "Strong",
        color: "text-green-400",
      };
    }

    return {
      text: "Medium",
      color: "text-yellow-400",
    };
  };

  const strength = getStrength();

  const submit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      alert("Password must contain at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/signup", {
        name,
        email,
        password,
      });

      login(res.data.token, res.data.user);

      navigate("/chat");
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Signup Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-5">

      <form
        onSubmit={submit}
        className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-8"
      >

        {/* Logo */}

        <div className="text-center mb-8">

          <div className="text-6xl mb-3">
            🚀
          </div>

          <h1 className="text-3xl font-bold text-white">
            Create Account
          </h1>

          <p className="text-gray-400 mt-2">
            Join RAGDoc AI and chat with your PDFs
          </p>

        </div>

        {/* Full Name */}

        <label className="text-gray-300 text-sm">
          Full Name
        </label>

        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-2 mb-5 w-full rounded-lg bg-slate-900 border border-slate-700 p-3 text-white outline-none focus:border-blue-500"
          required
        />

        {/* Email */}

        <label className="text-gray-300 text-sm">
          Email Address
        </label>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 mb-5 w-full rounded-lg bg-slate-900 border border-slate-700 p-3 text-white outline-none focus:border-blue-500"
          required
        />

        {/* Password */}

        <label className="text-gray-300 text-sm">
          Password
        </label>

        <input
          type="password"
          placeholder="Create password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 mb-2 w-full rounded-lg bg-slate-900 border border-slate-700 p-3 text-white outline-none focus:border-blue-500"
          required
        />

        {/* Password Strength */}

        <div className="mb-4 flex justify-between">

          <span className="text-sm text-gray-400">
            Password Strength
          </span>

          <span className={`text-sm font-semibold ${strength.color}`}>
            {strength.text}
          </span>

        </div>

        {/* Confirm Password */}

        <label className="text-gray-300 text-sm">
          Confirm Password
        </label>

        <input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(e.target.value)
          }
          className="mt-2 mb-6 w-full rounded-lg bg-slate-900 border border-slate-700 p-3 text-white outline-none focus:border-blue-500"
          required
        />

        {/* Button */}

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

              Creating Account...

            </div>
          ) : (
            "Create Account"
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

        {/* Login */}

        <p className="text-center text-gray-400">

          Already have an account?{" "}

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-blue-400 hover:text-blue-300 font-semibold"
          >
            Login
          </button>

        </p>

      </form>

    </div>
  );
}

export default Signup;