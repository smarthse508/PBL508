import { useState } from "react";

export default function ResetPassword() {
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch(`${backendURL}/api/auth/send-reset-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setMessage(data.message);
    setLoading(false);
    if (data.success) setStep(2);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch(`${backendURL}/api/auth/verify-reset-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });


    const data = await res.json();
    setMessage(data.message);
    setLoading(false);

    if (data.success) setStep(3);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch(`${backendURL}/api/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, newPassword }),
    });

    const data = await res.json();
    setLoading(false);

    if (!data.success) {
      setMessage(data.message);
      return;
    }

    alert("Password berhasil diubah!");
    window.location.href = "/login";
  };

  return (
     <div className="min-h-screen flex items-center justify-center">
      <img
        src="/loginhero.svg"
        alt="login hero"
        className="hidden md:block w-1/2 h-screen object-cover"
      />

      <div className="w-full max-w space-y-4 m-8 p-4">
        <h1 className="text-4xl font-bold text-center">
          Reset Password
        </h1>

        {/*Masukkan email*/}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <p className="text-center text-gray-700">
              Masukkan email anda untuk menereset password.
            </p>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-4 w-full rounded-xl"
            />
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => (window.location.href = "/login")}
                className="w-1/2 text-lg font-semibold bg-gray-400 text-white py-3 rounded hover:bg-gray-700 rounded-xl cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-1/2 text-lg font-semibold bg-green-600 text-white py-3 rounded hover:bg-green-700 rounded-xl cursor-pointer"
              >
                {loading ? "Mengirim..." : "Kirim"}
              </button>
            </div>
          </form>
        )}

        {/*Masukkan OTP*/}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <p className="text-center">
              Silakan cek kode OTP di email anda.
            </p>
            <input
              type="text"
              placeholder="Masukkan kode OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="border p-4 w-full rounded-xl text-center tracking-widest text-lg"
            />

            <button
              type="button"
              onClick={handleSendOtp}
              className="text-green-600 underline text-sm"
            >
              Kirim ulang kode
            </button>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => (window.location.href = "/login")}
                className="w-1/2 bg-gray-300 py-3 rounded-xl"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-1/2 bg-green-600 text-white py-3 rounded-xl"
              >
                {loading ? "Memverifikasi..." : "Lanjutkan"}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3 - Password baru */}
        {step === 3 && (
          <form onSubmit={handleChangePassword} className="space-y-4 relative">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password baru"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border p-4 w-full rounded-xl"
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
            {showPassword ? (<i className="bi bi-eye-slash-fill cursor-pointer"  style={{ fontSize: '1.25rem' }}></i>) : (<i className="bi bi-eye-fill cursor-pointer"  style={{ fontSize: '1.25rem' }}></i>)}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700"
            >
              {loading ? "Menyimpan..." : "Ubah Password"}
            </button>
          </form>
        )}

        {message && (
          <p className="text-center text-sm text-red-600 bg-red-50 py-2 rounded">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
