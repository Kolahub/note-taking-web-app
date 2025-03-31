import { useState } from 'react';
import supabase from '../config/SupabaseConfig';
import IconShowPassword from '../assets/images/icon-show-password.svg?react';
import IconHidePassword from '../assets/images/icon-hide-password.svg?react';
import IconInfo from '../assets/images/icon-info.svg?react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ChangePassword = () => {
  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [error, setError] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = (field) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    setError({ oldPassword: '', newPassword: '', confirmPassword: '' });
    setLoading(true);

    const formData = new FormData(event.target);
    const oldPassword = formData.get('oldPassword');
    const newPassword = formData.get('newPassword');
    const confirmPassword = formData.get('confirmPassword');

    // Validation checks
    if (!oldPassword) {
      setError((prev) => ({ ...prev, oldPassword: 'Current password is required' }));
      setLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setError((prev) => ({ ...prev, newPassword: 'Password must be at least 8 characters' }));
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError((prev) => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      setLoading(false);
      return;
    }

    try {
      // First verify the old password is correct by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: (await supabase.auth.getUser()).data.user.email,
        password: oldPassword,
      });

      if (signInError) {
        setError((prev) => ({ ...prev, oldPassword: 'Current password is incorrect' }));
        setLoading(false);
        return;
      }

      // If old password verification is successful, update to the new password
      const { error } = await supabase.auth.updateUser({ password: newPassword });

      if (error) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.success('Password changed successfully!');
        event.target.reset();
      }
    } catch (error) {
      toast.error(`Unexpected error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pl-8 pt-8">
      <ToastContainer />
      <h1 className="capitalize text-2xl font-semibold text-gray-950 dark:text-gray-50">Change Password</h1>
      <form onSubmit={handleChangePassword} className="mt-6">
        {['oldPassword', 'newPassword', 'confirmPassword'].map((field, index) => (
          <div key={index} className="flex items-center gap-2 mt-4">
            <div className="flex flex-col gap-1 flex-grow">
              <label htmlFor={field} className="dark:text-white capitalize">
                {field === 'oldPassword' ? 'Current Password' : field.replace(/([A-Z])/g, ' $1')}
              </label>
              <div
                className={`flex items-center gap-3 border-2 rounded-lg w-full py-3 px-4 ${
                  error[field] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <input
                  type={showPassword[field] ? 'text' : 'password'}
                  name={field}
                  id={field}
                  className="focus:outline-none w-full bg-inherit dark:text-white"
                />
                <button type="button" onClick={() => togglePasswordVisibility(field)} className="dark:text-white">
                  {showPassword[field] ? <IconHidePassword /> : <IconShowPassword />}
                </button>
              </div>
              {field === 'newPassword' && !error.newPassword && (
                <div className="flex items-center gap-2 mt-[6.5px] text-gray-600 dark:text-gray-400">
                  <IconInfo />
                  <p>At least 8 characters</p>
                </div>
              )}
              {error[field] && (
                <div className="flex items-center text-xs text-red-500 mt-1">
                  <IconInfo className="mr-1" />
                  <p>{error[field]}</p>
                </div>
              )}
            </div>
          </div>
        ))}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 capitalize text-white w-40 py-3 px-4 rounded-lg mt-4 active:scale-95 disabled:opacity-70"
        >
          {loading ? 'Saving...' : 'Save Password'}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
