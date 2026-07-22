import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOTP = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/auth/send-otp", {
        email,
      });

      alert("OTP sent successfully.");

      navigate("/verify-otp", {
        state: { email },
      });

    } catch (err) {

      alert(
        err.response?.data?.message ||
          "Failed to send OTP"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-slate-900">

      <form
        onSubmit={sendOTP}
        className="w-[420px] rounded-xl bg-slate-800 p-8 shadow-xl"
      >

        <h1 className="text-3xl text-white font-bold text-center mb-8">
          Forgot Password
        </h1>

        <input
          type="email"
          placeholder="Enter your Email"
          className="w-full mb-6 p-3 rounded-lg bg-slate-900 text-white border border-slate-700 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg text-white font-semibold"
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>

      </form>

    </div>
  );
}

export default ForgotPassword;