import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import IconSuccess from '../assets/images/icon-checkmark.svg?react';
import IconCross from '../assets/images/icon-cross.svg?react';
import { NavLink, useLocation } from 'react-router-dom';

function Toast({ message, subText, onClose }) {
  const [visible, setVisible] = useState(true);
  const location = useLocation();
  const currentPath = location.pathname;

  const archiveNotePath = currentPath === '/archive-notes';
  const allNotePath = currentPath === '/' || currentPath === '/all-notes';

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-[58px] right-4 sm:right-6 toast-slide-in flex gap-3 items-center w-[360px]  sm:w-[400px] border-2 p-2 rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 shadow-lg z-50 text-sm sm:text-base">
      <div className="text-green-500 dark:text-green-400">
        <IconSuccess />
      </div>
      <div className="flex-1">
        <p className="text-gray-900 dark:text-gray-100">{message}</p>
      </div>
      <div className="">
        <NavLink to={allNotePath ? '/archive-notes' : archiveNotePath ? 'all-notes' : ''} onClick={onClose} className="underline text-blue-500 dark:text-blue-400">{subText}</NavLink>
      </div>
      <button onClick={() => { setVisible(false); onClose(); }} className="text-gray-500 dark:text-gray-300">
        <IconCross />
      </button>
    </div>
  );
}

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  subText: PropTypes.string.isRequired,
};

export default Toast;
