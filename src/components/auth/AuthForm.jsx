import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useParams, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logo from '../../assets/images/logo.svg?react';
import IconGoogle from '../../assets/images/icon-google.svg?react';
import supabase from '../../config/SupabaseConfig';
import IconShowPassword from '../../assets/images/icon-show-password.svg?react';
import IconHidePassword from '../../assets/images/icon-hide-password.svg?react';
import IconInfo from '../../assets/images/icon-info.svg?react';
import isEmail from 'validator/lib/isEmail';
import PropTypes from 'prop-types';

function AuthForm({ mode: modeProp }) {
  const { mode: modeParam } = useParams();
  const mode = modeProp || modeParam;
  const navigate = useNavigate();
  const location = useLocation();
  const formRef = useRef(null);

  const [error, setError] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    const handleResetToken = async () => {
      // Since we're on the reset page, check if we have a hash fragment
      const hash = window.location.hash;
      const query = window.location.search;

      // Check for explicit error parameters (expired link)
      if (hash.includes('error=') || query.includes('error=')) {
        toast.error('Your password reset link has expired. Please request a new one.');
        navigate('/auth/forgot', { replace: true });
        return;
      }

      // Check if we're on the reset page with a recovery token (either from redirect or directly accessed)
      if (mode === 'reset') {
        try {
          // Get the current session - if we're already authenticated for password reset, we can proceed
          const { data: sessionData } = await supabase.auth.getSession();

          if (sessionData.session) {
            // Session exists, no need to do anything, user can reset password
            console.log('Valid session for password reset exists');
            return;
          }

          // If we don't have a session but we have a recovery token, try to process it
          if (hash.includes('type=recovery')) {
            console.log('Processing recovery token from URL hash');

            // Supabase automatically processes the token on page load
            // Just check if we have a session after that automatic processing
            const { data: refreshedSession } = await supabase.auth.getSession();

            if (!refreshedSession.session) {
              // If we still don't have a session, the token might be invalid or expired
              toast.error('Password reset session could not be established. Please request a new link.');
              navigate('/auth/forgot', { replace: true });
            }
          } else {
            // No recovery token and no session - user needs to request a reset link
            toast.error('No active password reset session. Please request a password reset link.');
            navigate('/auth/forgot', { replace: true });
          }
        } catch (error) {
          console.error('Error processing reset token:', error);
          toast.error('Error processing your password reset link. Please try again or request a new one.');
          navigate('/auth/forgot', { replace: true });
        }
      }
    };

    handleResetToken();
  }, [location, navigate, mode]);

  useEffect(() => {
    const timer = setTimeout(() => setError({ email: '', password: '' }), 5000);
    return () => clearTimeout(timer);
  }, [error]);

  // Clear form fields when mode changes (navigating between auth pages)
  useEffect(() => {
    if (formRef.current) {
      formRef.current.reset();
      setError({ email: '', password: '' });
      setShowPassword(false);
    }
  }, [mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({ email: '', password: '' });
    setLoading(true);
    setFormSubmitted(false);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    // Validation logic
    if ((mode === 'login' || mode === 'signup' || mode === 'forgot') && !email) {
      setError({ email: 'Email is required' });
      setLoading(false);
      return;
    }

    if ((mode === 'login' || mode === 'signup' || mode === 'forgot') && (!isEmail(email) || email === 'email@example.com')) {
      setError({ email: 'Invalid email address' });
      setLoading(false);
      return;
    }

    if ((mode === 'login' || mode === 'signup' || mode === 'reset') && !password) {
      setError({ password: 'Password is required' });
      setLoading(false);
      return;
    }

    if ((mode === 'login' || mode === 'signup' || mode === 'reset') && password.length < 8) {
      setError({ password: 'Password must be at least 8 characters' });
      setLoading(false);
      return;
    }

    try {
      if (mode === 'login') {
        const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
        if (authError) throw authError;
        toast.success('Logged in successfully!');
        navigate('/');
      } else if (mode === 'signup') {
        const { error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (authError) throw authError;
        toast.success('Account created! Please check your email.');
        setFormSubmitted(true);
      } else if (mode === 'forgot') {
        const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/reset`,
        });
        if (authError) throw authError;
        toast.success('Password reset link sent! Please check your email.');
        setFormSubmitted(true);
      } else if (mode === 'reset') {
        try {
          // Get the current session using the latest Supabase method
          const { data: sessionData } = await supabase.auth.getSession();

          if (!sessionData.session) {
            toast.error('Your password reset session has expired. Please request a new password reset link.');
            navigate('/auth/forgot', { replace: true });
            return;
          }

          // Using the latest updateUser method to update the password
          const { error: updateError } = await supabase.auth.updateUser({
            password: password,
          });

          if (updateError) throw updateError;

          toast.success('Password updated successfully! Please login with your new password.');
          // Sign out after successful password reset
          await supabase.auth.signOut();
          navigate('/auth/login', { replace: true });
        } catch (error) {
          console.error('Password reset error:', error);
          toast.error(error.message || 'Failed to reset password');
          setLoading(false);
          return;
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(error.message || 'An error occurred');
      if (mode === 'reset') navigate('/auth/forgot');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/',
        },
      });
      if (authError) throw authError;
    } catch (error) {
      toast.error(error.message || 'Failed to sign in with Google');
    }
  };

  const handleEmailChange = () => setError((prev) => ({ ...prev, email: '' }));
  const handlePasswordChange = () => setError((prev) => ({ ...prev, password: '' }));

  if (formSubmitted && mode === 'forgot') {
    return ( 
      <div className="bg-white dark:bg-gray-950 w-full md:w-[522px] lg:w-[540px] p-6 sm:p-12">
        <ToastContainer />
        <div className="flex justify-center dark:text-white">
          <Logo />
        </div>
        <div className="text-center my-8">
          <h1 className="text-2xl font-bold mb-4">Check Your Email</h1>
          <p className="text-gray-600 mb-6">We&apos;ve sent a password reset link to your email address.</p>
          <NavLink to="/auth/login" className="bg-blue-500 text-white font-medium px-6 py-3 rounded-lg inline-block">
            Return to Login
          </NavLink>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-950 w-full md:w-[522px] lg:w-[540px] p-6 sm:p-12">
      <ToastContainer />
      <div className="flex justify-center dark:text-white">
        <Logo />
      </div>

      <div className="text-center my-4">
        {mode === 'login' && (
          <>
            <h1 className="capitalize text-2xl font-bold dark:text-white">Welcome to Note</h1>
            <p className="capitalize text-gray-600 dark:text-gray-300">Please log in to continue</p>
          </>
        )}
        {mode === 'signup' && (
          <>
            <h1 className="capitalize text-2xl font-bold dark:text-white">Sign Up for Note</h1>
            <p className="capitalize text-gray-600 dark:text-gray-300">Create an account to get started</p>
          </>
        )}
        {mode === 'forgot' && (
          <>
            <h1 className="capitalize text-2xl font-bold dark:text-white">Reset Your Password</h1>
            <p className="capitalize text-gray-600 dark:text-gray-300">Enter your email to receive a reset link</p>
          </>
        )}
        {mode === 'reset' && (
          <>
            <h1 className="capitalize text-2xl font-bold dark:text-white">Set New Password</h1>
            <p className="capitalize text-gray-600 dark:text-gray-300">Enter your new password</p>
          </>
        )}
      </div>

      <form ref={formRef} className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {(mode === 'login' || mode === 'signup' || mode === 'forgot') && (
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="capitalize font-medium text-lg dark:text-white">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="email@example.com"
              className={`focus:outline-none placeholder-gray-500 border-2 rounded-lg px-4 py-3 ${error.email ? 'border-red-500' : 'border-gray-300'} dark:bg-transparent dark:border-gray-600 dark:text-white`}
              onChange={handleEmailChange}
              required
            />
            {error.email && (
              <div className="flex items-center text-xs text-red-500">
                <IconInfo className="mr-1" />
                <p>{error.email}</p>
              </div>
            )}
          </div>
        )}

        {(mode === 'login' || mode === 'signup' || mode === 'reset') && (
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <label htmlFor="password" className="capitalize font-medium text-lg dark:text-white">
                Password
              </label>
              {mode === 'login' && (
                <NavLink to="/auth/forgot" className="capitalize underline text-gray-600 dark:text-gray-400">
                  Forgot?
                </NavLink>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                placeholder=""
                className={`focus:outline-none placeholder-gray-500 border-2 rounded-lg px-4 py-3 w-full ${
                  error.password ? 'border-red-500' : 'border-gray-300'
                } dark:bg-transparent dark:border-gray-600 dark:text-white`}
                onChange={handlePasswordChange}
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <IconHidePassword /> : <IconShowPassword />}
              </button>
            </div>
            {mode === 'signup' && !error.password && (
              <div className="flex items-center text-xs text-gray-500">
                <IconInfo className="mr-1" />
                <p>At least 8 characters</p>
              </div>
            )}
            {error.password && (
              <div className="flex items-center text-xs text-red-500">
                <IconInfo className="mr-1" />
                <p>{error.password}</p>
              </div>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white font-medium capitalize text-lg py-3 rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 transition-colors disabled:opacity-70"
        >
          {loading
            ? mode === 'login'
              ? 'Logging in...'
              : mode === 'signup'
              ? 'Signing up...'
              : mode === 'forgot'
              ? 'Sending...'
              : 'Resetting...'
            : mode === 'login'
            ? 'Login'
            : mode === 'signup'
            ? 'Sign Up'
            : mode === 'forgot'
            ? 'Send Reset Link'
            : 'Reset Password'}
        </button>
      </form>

      {(mode === 'login' || mode === 'signup') && (
        <div className="my-4 border-t-2 border-b-2 border-gray-200 dark:border-gray-800 pt-6 pb-4">
          <p className="text-center text-gray-600 mb-4 dark:text-gray-300">Or log in with:</p>
          <button
            onClick={handleGoogleSignIn}
            type="button"
            className="border-2 border-gray-300 flex items-center justify-center rounded-lg w-full transition-all hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800 dark:text-white"
          >
            <div className='dark:text-white dark:fill-white'>
              <IconGoogle className="dark:fill-white" />
            </div>
            <p className="capitalize w-[90px] text-center py-4 font-medium text-lg dark:text-white">Google</p>
          </button>
        </div>
      )}

      <div className="w-full text-center mt-6">
        {mode === 'login' && (
          <>
            <span className='text-gray-600 dark:text-gray-300'>No account yet? </span>
            <NavLink to="/auth/signup" className=" text-gray-950 dark:text-gray-100">
              Sign Up
            </NavLink>
          </>
        )}
        {mode === 'signup' && (
          <>
            <span className='dark:text-gray-300'>Already have an account? </span>
            <NavLink to="/auth/login" className="text-gray-950 dark:text-gray-100">
              Login
            </NavLink>
          </>
        )}
        {(mode === 'forgot' || mode === 'reset') && (
          <>
            <span className='dark:text-gray-300'>Remember your password? </span>
            <NavLink to="/auth/login" className="text-gray-950 dark:text-gray-100">
              Login
            </NavLink>
          </>
        )}
      </div>
    </div>
  );
}
AuthForm.propTypes = {
  mode: PropTypes.string,
};

export default AuthForm;
