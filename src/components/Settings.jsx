// import React from 'react'

import { useSelector } from 'react-redux';
import ColorTheme from './ColorTheme';
import FontTheme from './FontTheme';
import ChangePassword from './ChangePassword';
import Logout from './Logout';

function Settings() {
  const activeSettings = useSelector((state) => state.activeSettings);

  return (
    <div>
      {activeSettings?.toLowerCase() === 'color theme' && <ColorTheme />}

      {activeSettings?.toLowerCase() === 'font theme' && <FontTheme />}

      {activeSettings?.toLowerCase() === 'change password' && <ChangePassword />}

      {activeSettings?.toLowerCase() === 'logout' && <Logout />}
    </div>
  );
}

export default Settings;
