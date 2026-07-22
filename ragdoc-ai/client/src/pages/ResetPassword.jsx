import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

function ResetPassword() {

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";
  const otp = location.state?.otp || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const resetPassword = async (e) => {

    e.preventDefault();

    if (password !== confirmPassword) {
      return alert("Passwords do not match");
    }

    try {

      setLoading(true);

      await api.post("/auth/reset-password", {
        email,
        otp,
        password,
      });

      alert("Password Changed Successfully");

      navigate("/");

    } catch (err) {

      alert(
        err.response?.data?.message ||
        "Something went wrong"
      );

    } finally {

      setLoading(false);

    }

  };

  return (
    <div className="flex h-screen items-center justify-center bg-slate-900">

      <form
        onSubmit={resetPassword}
        className="w-[420px] rounded-xl bg-slate-800 p-8 shadow-xl"
      >

        <h1 className="text-3xl font-bold text-white text-center mb-8">
          Create New Password
        </h1>

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          className="w-full mb-5 p-3 rounded-lg bg-slate-900 border border-slate-700 text-white outline-none"
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e)=>setConfirmPassword(e.target.value)}
          className="w-full mb-6 p-3 rounded-lg bg-slate-900 border border-slate-700 text-white outline-none"
          required
        />

        <button
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg p-3 text-white font-semibold"
        >
          {loading ? "Updating..." : "Reset Password"}
        </button>

      </form>

    </div>
  );
}

export default ResetPassword;