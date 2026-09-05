"use client";

import { useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Welcome back!");

    router.push("/dashboard");
router.refresh();
  }

  return (
    <main className="max-w-md mx-auto py-20 px-6">
      <h1 className="text-4xl font-bold mb-8">
        Login
      </h1>

      <form
        onSubmit={handleLogin}
        className="space-y-5"
      >
        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded-lg p-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded-lg p-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg">
          Login
        </button>
      </form>
    </main>
  );
}