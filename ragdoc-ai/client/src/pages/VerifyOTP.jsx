import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const verifyOTP = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/auth/verify-otp", {
        email,
        otp,
      });

      alert("OTP Verified");

      navigate("/reset-password", {
        state: {
          email,
          otp,
        },
      });

    } catch (err) {

      alert(
        err.response?.data?.message ||
        "Invalid OTP"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-slate-900">

      <form
        onSubmit={verifyOTP}
        className="w-[420px] rounded-xl bg-slate-800 p-8 shadow-xl"
      >

        <h1 className="text-3xl font-bold text-center text-white mb-8">
          Verify OTP
        </h1>

        <p className="text-gray-400 mb-5 text-center">
          OTP sent to
        </p>

        <p className="text-blue-400 text-center mb-8">
          {email}
        </p>

        <input
          type="text"
          placeholder="Enter 6 Digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full p-3 rounded-lg bg-slate-900 text-white border border-slate-700 outline-none mb-6"
          required
        />

        <button
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg p-3 text-white font-semibold"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

      </form>

    </div>
  );
}

export default VerifyOTP;