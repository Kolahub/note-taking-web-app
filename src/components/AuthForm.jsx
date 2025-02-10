// AuthForm.jsx
import { useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import Logo from '../assets/images/logo.svg?react';
import IconGoogle from '../assets/images/icon-google.svg?react';
import supabase from '../config/SupabaseConfig';

function AuthForm() {
  // Get the current mode from the URL parameter.
  // Expected routes: /auth/login, /auth/signup, /auth/forgot, /auth/reset
  const { mode } = useParams();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Handle form submission using new FormData()
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    // In modes where the email field is shown, grab it:
    const email = formData.get("email");
    // In modes where the password field is shown, grab it:
    const password = formData.get("password");

    if (mode === "login") {
      // Log in using Supabase's signInWithPassword method
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) {
        setError(authError.message);
      } else {
        setMessage("Logged in successfully!");
        // Redirect to the home page after successful login
        navigate('/');
      }
    } else if (mode === "signup") {
      // Sign up / register a new user
      const { error: authError } = await supabase.auth.signUp(
        { email, password },
        { redirectTo: window.location.origin + "/" } // <-- Added redirect URL here
      );
      if (authError) {
        setError(authError.message);
      } else {
        setMessage("Account created! Please check your email for confirmation.");
        // Do not redirect immediately; wait for email verification.
        // navigate('/');
      }
    } else if (mode === "forgot") {
      // Send a password reset email
      const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/auth/reset",
      });
      if (authError) {
        setError(authError.message);
      } else {
        setMessage("Password reset link has been sent to your email.");
      }
    } else if (mode === "reset") {
      // Update the password – this assumes the user came in via a reset link.
      const { error: authError } = await supabase.auth.updateUser({ password });
      if (authError) {
        setError(authError.message);
      } else {
        setMessage("Password has been updated successfully!");
      }
    }
    setLoading(false);
  };

  // Handler for Google Sign In using Supabase OAuth
  const handleGoogleSignIn = async () => {
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (authError) {
      setError(authError.message);
    }
  };

  return (
    <div className="bg-white w-[540px] p-12">
      <div className="flex justify-center">
        <Logo />
      </div>

      <div className="text-center my-4">
        {mode === "login" && (
          <>
            <h1 className="capitalize text-2xl font-bold">Welcome to Note</h1>
            <p className="capitalize text-gray-600">Please log in to continue</p>
          </>
        )}
        {mode === "signup" && (
          <>
            <h1 className="capitalize text-2xl font-bold">Sign Up for Note</h1>
            <p className="capitalize text-gray-600">Create an account to get started</p>
          </>
        )}
        {mode === "forgot" && (
          <>
            <h1 className="capitalize text-2xl font-bold">Reset Your Password</h1>
            <p className="capitalize text-gray-600">Enter your email to receive a reset link</p>
          </>
        )}
        {mode === "reset" && (
          <>
            <h1 className="capitalize text-2xl font-bold">Set New Password</h1>
            <p className="capitalize text-gray-600">Enter your new password</p>
          </>
        )}
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* Email Input: Shown in login, signup, and forgot modes */}
        {(mode === "login" || mode === "signup" || mode === "forgot") && (
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="capitalize font-medium text-lg">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="email@example.com"
              className="focus:outline-none placeholder-gray-500 border-2 border-gray-300 rounded-lg px-4 py-3"
              required
            />
          </div>
        )}

        {/* Password Input: Shown in login, signup, and reset modes */}
        {(mode === "login" || mode === "signup" || mode === "reset") && (
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <label htmlFor="password" className="capitalize font-medium text-lg">
                Password
              </label>
              {/* Only show "Forgot?" link on login */}
              {mode === "login" && (
                <NavLink to="/auth/forgot" className="capitalize underline text-blue-500">
                  Forgot?
                </NavLink>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder=""
                className="focus:outline-none placeholder-gray-500 border-2 border-gray-300 rounded-lg px-4 py-3 w-full"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {(mode === "signup" || mode === "reset") && (
              <p className="text-xs text-gray-500">At least 8 characters</p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white font-medium capitalize text-lg py-3 rounded-lg"
        >
          {loading
            ? mode === "login"
              ? "Logging in..."
              : mode === "signup"
              ? "Signing up..."
              : mode === "forgot"
              ? "Sending..."
              : "Resetting..."
            : mode === "login"
            ? "Login"
            : mode === "signup"
            ? "Sign Up"
            : mode === "forgot"
            ? "Send Reset Link"
            : "Reset Password"}
        </button>
      </form>

      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      {message && <p className="text-green-500 text-center mt-4">{message}</p>}

      {/* Google Sign In Button (only for login and signup) */}
      {(mode === "login" || mode === "signup") && (
        <div className="my-4 border-t-2 border-b-2 border-gray-200 pt-6 pb-4">
          <p className="text-center text-gray-600 mb-4">Or log in with:</p>
          <button
            onClick={handleGoogleSignIn}
            type="button"
            className="border-2 border-gray-300 flex items-center justify-center rounded-lg w-full"
          >
            <IconGoogle />
            <p className="capitalize w-[90px] text-center py-4 font-medium text-lg">Google</p>
          </button>
        </div>
      )}

      {/* Bottom Navigation Link */}
      <div className="w-full text-center mt-6">
        {mode === "login" && (
          <>
            <span>No account yet? </span>
            <NavLink to="/auth/signup" className="underline text-blue-500">
              Sign Up
            </NavLink>
          </>
        )}
        {mode === "signup" && (
          <>
            <span>Already have an account? </span>
            <NavLink to="/auth/login" className="underline text-blue-500">
              Login
            </NavLink>
          </>
        )}
        {(mode === "forgot" || mode === "reset") && (
          <>
            <span>Remember your password? </span>
            <NavLink to="/auth/login" className="underline text-blue-500">
              Login
            </NavLink>
          </>
        )}
      </div>
    </div>
  );
}

export default AuthForm;
