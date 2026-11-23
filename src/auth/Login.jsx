import { useState } from "react";
import { Link, useNavigate } from "react-router";

import { useAuth } from "./AuthContext";

/** A form that allows users to log into an existing account. */
export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState(null);

  /** Logs in with the form's username and password, then goes to the home page. */
  const onLogin = async (formData) => {
    const username = formData.get("username");
    const password = formData.get("password");
    try {
      await login({ username, password });
      navigate("/");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <section className="max-w-md mx-auto rounded border border-neutral-800 bg-neutral-900 p-4">
      <h1>Log in to your account</h1>
      <form action={onLogin} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          Username
          <input
            type="username"
            name="username"
            required
            className="border rounded px-2 py-1 bg-neutral-950"
          />
        </label>
        <label className="flex flex-col gap-1">
          Password
          <input
            type="password"
            name="password"
            required
            className="border rounded px-2 py-1 bg-neutral-950"
          />
        </label>
        <button className="w-fit">Login</button>
        {error && <output>{error}</output>}
      </form>
      <p className="mt-4">
        Need an account?
        <Link
          to="/register"
          className="inline-block ml-2 border rounded px-2 py-1 text-neutral-200 hover:bg-neutral-800"
        >
          Register here
        </Link>
      </p>
    </section>
  );
}
