import { NavLink, useLocation } from 'react-router-dom';
import ArrowLeft from '../../assets/images/icon-arrow-left.svg?react';
import IconArchive from '../../assets/images/icon-archive.svg?react';
import IconHome from '../../assets/images/icon-home.svg?react';
import SearchIcon from '../../assets/images/icon-search.svg?react';
import SettingsIcon from '../../assets/images/icon-settings.svg?react';
import TagIcon from '../../assets/images/icon-tag.svg?react';
import { useDispatch, useSelector } from 'react-redux';
import { mobileAction, noteAction } from '../../store';
import Tags from '../notes/Tags';
import { useEffect } from 'react';
/**
 * Responsive Navbar component that handles both desktop sidebar navigation and mobile bottom navigation.
 * This component consolidates what was previously separate MobileNav and Navbar components.
 * - For desktop: Displays as a sidebar with navigation links and Tags component
 * - For mobile: Displays as a fixed bottom navigation bar with icon buttons
 */
function Navbar() {
  const newNoteI = useSelector((state) => state.note.newNoteI);
  const showNote = useSelector((state) => state.mobile.showNote);
  const showSearch = useSelector((state) => state.mobile.showSearch);
  const showTag = useSelector((state) => state.mobile.showTag);
  const settingsActive = useSelector((state) => state.note.settingsActive);
  const notesLoading = useSelector((state) => state.note.loading);
  const dispatch = useDispatch();
  const location = useLocation();
  const currentPath = location.pathname;

  const archiveNotePath = currentPath === '/archive-notes';
  const allNotePath = currentPath === '/' || currentPath === '/all-notes';

  useEffect(() => {
    if (newNoteI && archiveNotePath) {
      const timer = setTimeout(() => {
        dispatch(noteAction.cancelNote());
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [newNoteI, archiveNotePath, dispatch]);

  useEffect(() => {
    dispatch(noteAction.clearFilters());
  }, [dispatch]);

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

  // Determine which icon should be active for mobile
  const isHomeActive = (currentPath === '/' || currentPath === '/all-notes') && !showSearch && !settingsActive && !showTag;
  const isArchiveActive = currentPath === '/archive-notes' && !showSearch && !settingsActive && !showTag;
  const isSearchActive = showSearch;
  const isTagActive = showTag;
  const isSettingsActive = settingsActive;

  if (notesLoading) {
    return (
      <div className="lg:mt-4 lg:flex flex-col gap-2 sm:gap-3 animate-pulse">
        <div className="h-10 sm:h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div className="h-10 sm:h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </div>
    );
  }

  // Desktop navigation
  return (
    <>
      {/* Desktop navigation - hidden on mobile and tablet screens */}
      <div className="hidden lg:block">
        <div className="lg:mt-4 lg:flex flex-col gap-2">
          <NavLink
            to={'/all-notes'}
            end
            onClick={handleOnclickNav}
            className={({ isActive }) =>
              `flex justify-between w-full px-3 py-[10px] rounded-lg group hover:bg-gray-200 dark:hover:bg-gray-800 ${
                isActive || currentPath === '/' ? 'bg-gray-200 dark:bg-gray-800' : ''
              }`
            }
          >
            <div className="flex gap-2">
              <div className={`${allNotePath || currentPath === '/' ? 'text-blue-500' : 'text-gray-950 dark:text-gray-50 group-hover:text-blue-500'}`}>
                <IconHome />
              </div>
              <span className="text-gray-950 dark:text-gray-100">All Notes</span>
            </div>

            <div
              className={`rotate-180 ${
                allNotePath || currentPath === '/' ? 'text-gray-950 dark:text-gray-50' : 'opacity-0 group-hover:opacity-100 text-gray-950 dark:text-gray-50'
              }`}
            >
              <ArrowLeft />
            </div>
          </NavLink>

          <NavLink
            to="/archive-notes"
            end
            onClick={handleOnclickNav}
            className={({ isActive }) =>
              `flex justify-between w-full px-3 py-[10px] rounded-lg group hover:bg-gray-200 dark:hover:bg-gray-800 active:scale-95 ${
                isActive ? 'bg-gray-200 dark:bg-gray-800' : ''
              }`
            }
          >
            <div className="flex gap-2">
              <div className={`${archiveNotePath ? 'text-blue-500' : 'text-gray-950 dark:text-gray-50 group-hover:text-blue-500'}`}>
                <IconArchive />
              </div>
              <span className="text-gray-950 dark:text-gray-100">Archived Notes</span>
            </div>

            <div
              className={`rotate-180 ${
                archiveNotePath ? 'text-gray-950 dark:text-gray-50' : 'opacity-0 group-hover:opacity-100 text-gray-950 dark:text-gray-50'
              }`}
            >
              <ArrowLeft />
            </div>
          </NavLink>
        </div>

        <div className="">
          <Tags />
        </div>
      </div>

      {/* Mobile/Tablet navigation - visible on mobile and tablet screens but hidden on desktop */}
      <div className="lg:hidden px-4 py-3 fixed bottom-0 left-0 right-0 bg-white dark:bg-black border-t-2 dark:border-gray-800 flex justify-between items-center z-50">
        <NavLink
          to="/all-notes"
          end
          onClick={handleOnclickNav}
          className={`flex flex-col items-center rounded-lg w-20 py-1 ${
            isHomeActive ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400 hover:bg-blue-50 hover:text-blue-500'
          }`}
        >
          <IconHome />
          <p className="hidden text-xs mt-1 md:block">Home</p>
        </NavLink>

        <button
          className={`flex flex-col items-center rounded-lg w-20 py-1 ${
            isSearchActive ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400 hover:bg-blue-50 hover:text-blue-500'
          }`}
          onClick={handleShowSearch}
        >
          <SearchIcon />
          <p className="hidden text-xs mt-1 md:block">Search</p>
        </button>

        <NavLink
          to="/archive-notes"
          end
          onClick={handleOnclickNav}
          className={`flex flex-col items-center rounded-lg w-20 py-1 ${
            isArchiveActive ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400 hover:bg-blue-50 hover:text-blue-500'
          }`}
        >
          <IconArchive />
          <p className="hidden text-xs mt-1 md:block">Archive</p>
        </NavLink>

        <button
          onClick={handleShowTag}
          className={`flex flex-col items-center rounded-lg w-20 py-1 ${
            isTagActive ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400 hover:bg-blue-50 hover:text-blue-500'
          }`}
        >
          <TagIcon />
          <p className="hidden text-xs mt-1 md:block">Tags</p>
        </button>

        <button
          className={`flex flex-col items-center rounded-lg w-20 py-1 ${
            isSettingsActive ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400 hover:bg-blue-50 hover:text-blue-500'
          }`}
          onClick={handleToggleSettings}
        >
          <SettingsIcon />
          <p className="hidden text-xs mt-1 md:block">Settings</p>
        </button>
      </div>
    </>
  );
}

export default Navbar;
