import { useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import Header from "./Header";
import FormInput from "../ui/FormInput";
import { authClient } from "../../lib/authClient";
import { handleInvalid } from "../../lib/formValidation";

function Auth() {
  const { data: session, isPending } = authClient.useSession();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Register or log in the user based on the current mode.
   */
  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);

    // If registering, ensure the password and confirm password fields match
    if (mode === 'register' && password !== confirmPassword) {
      toast.error("Passwords do not match", { id: 'auth-error' });
      setLoading(false);
      return;
    }

    try {
      const { error } =
        mode === 'register'
          ? await authClient.signUp.email({ email, password, name })
          : await authClient.signIn.email({ email, password });

      if (error) {
        toast.error(error.message ?? 'Something went wrong', { id: 'auth-error' });
      }
    } catch {
      toast.error("Network error, please try again", { id: 'auth-error' });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Switch between login and register modes, resetting the form fields and error state.
   */
  const handleModeSwitch = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setMode(mode === 'login' ? 'register' : 'login');
  }

  // Loading state: show only the header while checking authentication status.
  if (isPending) {
    return (
      <div className="flex min-h-dvh flex-col bg-stridex-grey">
        <Header />
      </div>
    );
  };

  // If the user is already authenticated, show a success toast and redirect to the profile page.
  if (session) {
    toast.success("You are now signed in", { id: 'auth-success' });
    return (
      <Navigate to="/profile" replace />
    );
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex-1 bg-stridex-grey">
        <form
          onSubmit={handleSubmit} onInvalidCapture={handleInvalid}
          className="mx-auto mt-10 flex max-w-sm flex-col gap-3 rounded-2xl bg-stridex-black p-6 text-white"
        >
          <h1 className="text-xl font-bold">
            {mode === 'login' ? 'Log in' : 'Create account'}
          </h1>

          {/* Form inputs */}
          {mode === 'register' && (
            <FormInput id="name" label="Full Name" type="text" placeholder="Enter Full Name"
              value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
          )}
          <FormInput id="email" label="Email" type="email" placeholder="Enter Email"
            value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />

          <FormInput id="password" label="Password" type="password" placeholder="Enter Password (8+ characters)"
            autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
            value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />

          {mode === 'register' && (
            <FormInput id="confirmPassword" label="Confirm Password" type="password"
              placeholder="Confirm Password" autoComplete="new-password"
              value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={8} />
          )}

          {/* Action buttons */}
          <button type="submit" disabled={loading}
            className="rounded-full bg-stridex-green px-4 py-2 font-semibold hover:bg-stridex-green-hover disabled:opacity-50">
            {loading ? 'Loading...' : mode === 'login' ? 'Log in' : 'Sign up'}
          </button>

          <button type="button" className="text-sm text-stridex-lightgrey hover:underline"
            onClick={handleModeSwitch}>
            {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
          </button>
        </form>
      </main>
    </div>
  );
}

export default Auth;