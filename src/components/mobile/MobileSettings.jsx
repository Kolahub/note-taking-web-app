import { useDispatch, useSelector } from 'react-redux';
import ArrowLeft from '../../assets/images/icon-arrow-left.svg?react';
import IconSun from '../../assets/images/icon-sun.svg?react';
import IconFont from '../../assets/images/icon-font.svg?react';
import IconLock from '../../assets/images/icon-lock.svg?react';
import IconLogout from '../../assets/images/icon-logout.svg?react';
import { noteAction } from '../../store';
import supabase from '../../config/SupabaseConfig';
import ColorTheme from '../settings/ColorTheme';
import FontTheme from '../settings/FontTheme';
import ChangePassword from '../settings/ChangePassword';

const SETTINGS_OPTIONS = [
  {
    id: 'so1',
    name: 'color theme',
    image: <IconSun />,
  },
  {
    id: 'so2',
    name: 'font theme',
    image: <IconFont />,
  },
  {
    id: 'so3',
    name: 'change password',
    image: <IconLock />,
  },
];

function MobileSettings() {
  const dispatch = useDispatch();
  const activeSettings = useSelector((state) => state.note.activeSettings);

  const handleApplyActiveSettings = (setting) => {
    dispatch(noteAction.applyActiveSettings(setting));
  };

  const handleGoBack = () => {
    if (activeSettings) {
      dispatch(noteAction.applyActiveSettings(null));
    } else {
      dispatch(noteAction.cancelActiveSettings());
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  // If a specific setting is active, show its detail view
  if (activeSettings) {
    return (
      <div className="h-full flex flex-col bg-white dark:bg-black">
        <div className="px-4 sm:px-6 md:px-8 flex items-center border-b dark:border-gray-800 shrink-0 h-[57px] md:h-[72px]">
          <button className="flex items-center gap-2 text-gray-700 dark:text-gray-300 active:scale-95" onClick={handleGoBack}>
            <ArrowLeft />
            <span className="capitalize">Go Back</span>
          </button>
        </div>

        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="px-4 py-2 sm:px-8 shrink-0">
            <h1 className="capitalize text-2xl font-bold text-gray-900 dark:text-gray-100">{activeSettings}</h1>
          </div>

          <div className="px-4 sm:px-8 flex-1">
            {activeSettings.toLowerCase() === 'color theme' && <ColorTheme />}
            {activeSettings.toLowerCase() === 'font theme' && <FontTheme />}
            {activeSettings.toLowerCase() === 'change password' && <ChangePassword />}
          </div>
        </div>
      </div>
    );
  }

  // Main settings list view
  return (
    <div className="h-full flex flex-col bg-white dark:bg-black">
      <div className="px-4 sm:px-6 md:px-8 shrink-0 border-b dark:border-gray-800 h-[57px] md:h-[72px] flex items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
      </div>

      <div className="flex-1 overflow-y-auto pb-20">
        <div className="flex flex-col">
          {SETTINGS_OPTIONS.map((option) => (
            <button
              key={option.id}
              className="flex justify-between items-center px-4 sm:px-8 py-4 border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-95"
              onClick={() => handleApplyActiveSettings(option.name)}
            >
              <div className="flex items-center gap-3">
                <span className="text-gray-800 dark:text-gray-200">{option.image}</span>
                <span className="capitalize text-gray-900 dark:text-gray-100">{option.name}</span>
              </div>
              <div className="text-gray-500 dark:text-gray-400">
                <ArrowLeft className="rotate-180" />
              </div>
            </button>
          ))}

          <button
            className="flex items-center gap-3 px-4 sm:px-8 py-4 border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-95 w-full text-left"
            onClick={handleLogout}
          >
            <span className="text-gray-800 dark:text-gray-200">
              <IconLogout />
            </span>
            <span className="text-gray-900 dark:text-gray-100">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default MobileSettings;
