"use client";

import { useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    try {
      const { data, error } =
        await supabaseClient.auth.signUp({
          email,
          password,
        });

      if (error) {
        alert(error.message);
        return;
      }

      if (!data.user) {
        alert("Account could not be created.");
        return;
      }

      // Send welcome email
      const emailResponse = await fetch(
        "/api/send-welcome-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      );

      if (!emailResponse.ok) {
        console.error(
          "Welcome email could not be sent."
        );
      }

      alert(
        "Account created successfully! Welcome to Ticatility."
      );

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error(
        "Signup error:",
        error
      );

      alert(
        "Something went wrong creating your account."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-md mx-auto py-20 px-6">

      <h1 className="text-4xl font-bold mb-3">
        Create Account
      </h1>

      <p className="text-gray-600 mb-8">
        Join Ticatility and manage your tickets
        and orders in one place.
      </p>

      <form
        onSubmit={handleSignup}
        className="space-y-5"
      >

        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded-lg p-3"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded-lg p-3"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          required
          minLength={6}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
        >
          {loading
            ? "Creating Account..."
            : "Create Account"}
        </button>

      </form>

    </main>
  );
}