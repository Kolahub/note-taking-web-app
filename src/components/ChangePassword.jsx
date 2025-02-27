import { useState } from 'react';
import supabase from '../config/SupabaseConfig';
import IconShowPassword from '../assets/images/icon-show-password.svg?react';
import IconHidePassword from '../assets/images/icon-hide-password.svg?react';
// import IconInfo from '../assets/images/icon-info.svg?react';
import IconInfo from '../assets/images/icon-info.svg?react'
import { toastAction } from '../store';
import { useDispatch } from 'react-redux';


const ChangePassword = () => {
  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const togglePasswordVisibility = (field) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const dispatch = useDispatch()

  const handleChangePassword = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newPassword = formData.get('newPassword');

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      console.error(`Error: ${error.message}`);
      alert(`Error: ${error.message}`);
    } else {
      dispatch(toastAction.showToast({ message: 'Password changed successfully!', subText: '' }));
      event.target.reset()
    }
  };

  return (
    <div className="pl-8 pt-8">
      <h1 className="capitalize text-2xl font-semibold text-gray-950 dark:text-gray-50">Change Password</h1>
      <form onSubmit={handleChangePassword} className="mt-6">
        {['oldPassword', 'newPassword', 'confirmPassword'].map((field, index) => (
          <div key={index} className="flex items-center gap-2 mt-4">
            <div className="flex flex-col gap-1 flex-grow">
              <label htmlFor={field} className="dark:text-white capitalize">
                {field.replace(/([A-Z])/g, ' $1')}
              </label>
              <div className="flex items-center gap-3 border-2 rounded-lg border-gray-300 dark:border-gray-600 w-full py-3 px-4">
                <input type={showPassword[field] ? 'text' : 'password'} name={field} className="focus:outline-none w-full bg-inherit dark:text-white" />
                <button type="button" onClick={() => togglePasswordVisibility(field)} className="dark:text-white">
                  {showPassword[field] ? <IconHidePassword /> : <IconShowPassword />}
                </button>
              </div>
              {field === 'newPassword' && (<div className='flex items-center gap-2 mt-[6.5px] text-gray-600 dark:text-gray-400'>
                  <div className="">
                    <IconInfo />
                  </div>
                  <p>At least 8 characters</p>
                </div>)}
            </div>
          </div>
        ))}
        <button type="submit" className="bg-blue-500 capitalize text-white w-40 py-3 px-4 rounded-lg mt-4 active:scale-95">
          Save Password
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
