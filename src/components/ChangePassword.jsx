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

  const isMobile = window.innerWidth < 1024;

  return (
    <div className={isMobile ? '' : 'pl-8 pt-8'}>
      <ToastContainer />
      {!isMobile && <h1 className="capitalize text-2xl font-semibold text-gray-950 dark:text-gray-50">Change Password</h1>}

      {isMobile && <p className="text-gray-700 dark:text-gray-300 mb-4">Change your account password.</p>}

      <form onSubmit={handleChangePassword} className="mt-2">
        <div className="flex flex-col gap-4">
          {['oldPassword', 'newPassword', 'confirmPassword'].map((field, index) => (
            <div key={index} className="flex flex-col gap-1">
              <label htmlFor={field} className="text-gray-700 dark:text-gray-300 capitalize">
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
                <div className="flex items-center gap-2 mt-1 text-gray-600 dark:text-gray-400 text-xs">
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
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 active:scale-95'}`}
          >
            {loading ? 'Saving...' : 'Save Password'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
