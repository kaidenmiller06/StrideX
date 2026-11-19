import { useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import Header from "./Header";
import FormInput from "../ui/FormInput";
import Button from "../ui/Button";
import { authClient } from "../../lib/authClient";
import { handleInvalid } from "../../lib/formValidation";

function Auth() {
  const { data: session, isPending } = authClient.useSession();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Register or log in the user based on the current mode.
   */
  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } =
        mode === 'register'
          ? await authClient.signUp.email({ email, password, name })
          : await authClient.signIn.email({ email, password });

      if (error) {
        toast.error(error.message ?? 'Something went wrong', { id: 'auth-error' });
      } else {
        toast.success(
          mode === 'register' ? "Account created successfully" : "Logged in successfully",
          { id: 'auth-success' }
        );
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
            <FormInput id="name" label="Full Name" type="text" placeholder="Display Name"
              value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
          )}
          <FormInput id="email" label="Email" type="email" placeholder="email@example.com"
            value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />

          <FormInput id="password" label="Password" type="password" placeholder="Must have at least 8 characters"
            autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
            value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />

          {/* Action buttons */}
          <Button type="submit" variant="primary" loading={loading}>
            {mode === 'login' ? 'Log in' : 'Sign up'}
          </Button>

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