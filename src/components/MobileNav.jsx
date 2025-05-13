// import React from 'react'
import HomeIcon from '../assets/images/icon-home.svg?react';
import SearchIcon from '../assets/images/icon-search.svg?react';
import SettingsIcon from '../assets/images/icon-settings.svg?react';
import ArchiveIcon from '../assets/images/icon-archive.svg?react';
import TagIcon from '../assets/images/icon-tag.svg?react';
import { NavLink, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { mobileAction, noteAction } from '../store';

function MobileNav() {
  const showNote = useSelector((state) => state.mobile.showNote);
  const showSearch = useSelector((state) => state.mobile.showSearch);
  const showTag = useSelector((state) => state.mobile.showTag);
  const settingsActive = useSelector((state) => state.note.settingsActive);
  const location = useLocation();
  const dispatch = useDispatch();
  const currentPath = location.pathname;

  const handleOnclickNav = function () {
    dispatch(noteAction.clearFilters());
    dispatch(noteAction.cancelActiveSettings());
    if (showNote) {
      dispatch(mobileAction.callHideNote());
    }
    if (showSearch) {
      dispatch(mobileAction.callHideSearch());
    }
    if (showTag) {
      dispatch(mobileAction.callHideTag());
    }
  };

  const handleShowSearch = function () {
    dispatch(mobileAction.callShowSearch());
  };

  const handleShowTag = function () {
    dispatch(mobileAction.callShowTag());
  };

  const handleToggleSettings = function () {
    dispatch(noteAction.toggleOpenSettings());
    if (showNote) {
      dispatch(mobileAction.callHideNote());
    }
    if (showSearch) {
      dispatch(mobileAction.callHideSearch());
    }
    if (showTag) {
      dispatch(mobileAction.callHideTag());
    }
  };

  // Determine which icon should be active
  const isHomeActive = (currentPath === '/' || currentPath === '/all-notes') && !showSearch && !settingsActive && !showTag;
  const isArchiveActive = currentPath === '/archive-notes' && !showSearch && !settingsActive && !showTag;
  const isSearchActive = showSearch;
  const isTagActive = showTag;
  const isSettingsActive = settingsActive;

  return (
    <div className="px-4 py-3 sm:px-8 fixed bottom-0 left-0 right-0 bg-white dark:bg-black border-t-2 dark:border-gray-800 flex justify-between items-center z-50">
      <NavLink
        to="/all-notes"
        end
        onClick={handleOnclickNav}
        className={`flex flex-col items-center rounded-lg w-20 py-1 ${
          isHomeActive ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400 hover:bg-blue-50 hover:text-blue-500'
        }`}
      >
        <HomeIcon />
        <p className="text-xs mt-1 sm:hidden">Home</p>
      </NavLink>

      <button
        className={`flex flex-col items-center rounded-lg w-20 py-1 ${
          isSearchActive ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400 hover:bg-blue-50 hover:text-blue-500'
        }`}
        onClick={handleShowSearch}
      >
        <SearchIcon />
        <p className="text-xs mt-1 sm:hidden">Search</p>
      </button>

      <NavLink
        to="/archive-notes"
        end
        onClick={handleOnclickNav}
        className={`flex flex-col items-center rounded-lg w-20 py-1 ${
          isArchiveActive ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400 hover:bg-blue-50 hover:text-blue-500'
        }`}
      >
        <ArchiveIcon />
        <p className="text-xs mt-1 sm:hidden">Archive</p>
      </NavLink>

      <button
        onClick={handleShowTag}
        className={`flex flex-col items-center rounded-lg w-20 py-1 ${
          isTagActive ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400 hover:bg-blue-50 hover:text-blue-500'
        }`}
      >
        <TagIcon />
        <p className="text-xs mt-1 sm:hidden">Tags</p>
      </button>

      <button
        className={`flex flex-col items-center rounded-lg w-20 py-1 ${
          isSettingsActive ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400 hover:bg-blue-50 hover:text-blue-500'
        }`}
        onClick={handleToggleSettings}
      >
        <SettingsIcon />
        <p className="text-xs mt-1 sm:hidden">Settings</p>
      </button>
    </div>
  );
}

export default MobileNav;
