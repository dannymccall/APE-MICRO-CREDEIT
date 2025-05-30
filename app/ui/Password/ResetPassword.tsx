"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { makeRequest } from "@/app/lib/helperFunctions";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false)
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await makeRequest("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });

    if (!res.success) {
      setMessage(res.message);
      setLoading(false);
      return;
    }
    setMessage(res.message);
    setLoading(false);
    setSuccess(true);
  };

  return (

      <div className="max-w-md mx-auto p-4">
        <h2 className="text-xl font-bold mb-4">Reset Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Enter new password"
            className="block text-sm w-full px-5 py-2 border-2 border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            autoFocus
          />
          <button
            className={`btn w-full flex items-center font-sans rounded-md justify-center gap-3 ${"bg-gradient-to-r from-violet-500 to-violet-700 hover:from-violet-700 hover:to-violet-900"} text-white py-2 rounded-md focus:outline-none font-bold font-mono transition`}
          >
            {loading ? (
              <span className="loading loading-ring loading-xs"></span>
            ) : (
              <>Reset Password</>
            )}
          </button>
        </form>
        <div className="flex gap-5 mt-5 items-center">
        {message && <p className="mt-4 text-green-500">{message}</p>}
        {success &&  <Link className="btn btn-sm bg-violet-600 text-slate-50" href="/">Go Back to Login</Link>}
        </div>
      </div>
  );
}
