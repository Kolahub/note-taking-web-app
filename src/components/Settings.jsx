// import React from 'react'

import { useSelector } from 'react-redux';
import ColorTheme from './ColorTheme';
import FontTheme from './FontTheme';
import ChangePassword from './ChangePassword';

function Settings() {
  const activeSettings = useSelector((state) => state.activeSettings);

  return (
    <div>
      {activeSettings?.toLowerCase() === 'color theme' && <ColorTheme />}

      {activeSettings?.toLowerCase() === 'font theme' && <FontTheme />}

      {activeSettings?.toLowerCase() === 'change password' && <ChangePassword />}
    </div>
  );
}

export default Settings;
