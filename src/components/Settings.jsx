// import React from 'react'

import { useSelector } from 'react-redux';
import ColorTheme from './ColorTheme';
import FontTheme from './FontTheme';
import ChangePassword from './ChangePassword';
import MobileSettings from './MobileSettings';

function Settings() {
  const activeSettings = useSelector((state) => state.note.activeSettings);

  // Use the mobile settings component for mobile/tablet
  if (window.innerWidth < 1024) {
    return <MobileSettings />;
  }

  // Desktop settings
  return (
    <div>
      {activeSettings?.toLowerCase() === 'color theme' && <ColorTheme />}

      {activeSettings?.toLowerCase() === 'font theme' && <FontTheme />}

      {activeSettings?.toLowerCase() === 'change password' && <ChangePassword />}
    </div>
  );
}

export default Settings;
