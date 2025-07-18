import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import IconSearch from '../../assets/images/icon-search.svg?react';
import IconSettings from '../../assets/images/icon-settings.svg?react';
import { noteAction } from '../../store';
import { useLocation } from 'react-router-dom';

function SubNav() {
  const dispatch = useDispatch();
  const filteredTag = useSelector((state) => state.note.filteredTag);
  const searchQuery = useSelector((state) => state.note.searchQuery);
  const settingsActive = useSelector((state) => state.note.settingsActive);
  const activeMobileNav = useSelector((state) => state.mobile.activeMobileNav);
  const [searchText, setSearchText] = useState('');
  const notesLoading = useSelector((state) => state.note.loading);

  const location = useLocation();
  const currentPath = location.pathname;

  const archiveNotePath = currentPath === '/archive-notes';
  const allNotePath = currentPath === '/' || currentPath === '/all-notes';

  // Determine the heading based on filters or search query
  const otherDisplayHeading = filteredTag || searchQuery || settingsActive;

  // Dispatch search query action
  const handleSearchQueryNotes = function (e) {
    const query = e.target.value;
    dispatch(noteAction.allSearchQueryNotes(query));
    setSearchText(query);
  };

  useEffect(() => {
    if (settingsActive) {
      setSearchText('');
    }
  }, [settingsActive]);

  useEffect(() => {
    // When search query changes from mobile search, update desktop search text
    if (searchQuery !== searchText) {
      setSearchText(searchQuery);
    }
  }, [searchQuery, searchText]);

  const toggleOpenSettings = function () {
    const isOpening = !settingsActive;
    dispatch(noteAction.toggleOpenSettings());
    dispatch(noteAction.clearFilters());
    if (isOpening) {
      dispatch(noteAction.applyActiveSettings('color theme'));
    }
  };

  if (notesLoading) {
    return (
      <div className="w-full flex gap-2 sm:gap-4 items-center justify-between px-3 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-[18.5px] animate-pulse">
        {/* Header skeleton */}
        <div className="h-8 sm:h-10 bg-gray-200 dark:bg-gray-700 rounded w-24 sm:w-48"></div>

        {/* Search and settings skeleton */}
        <div className="flex gap-3 sm:gap-6 lg:gap-8">
          <div className="hidden sm:flex items-center gap-3 bg-gray-200 dark:bg-gray-700 rounded-lg w-40 sm:w-60 lg:w-[400px] h-8 sm:h-10 lg:h-12"></div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex gap-4 items-center justify-between px-4 pt-5 pb-4 sm:px-8 sm:pt-6 lg:px-8 lg:py-[18.5px]">
        <h1 className="capitalize text-3xl font-bold text-gray-900 dark:text-gray-100 hidden lg:block">
          {!otherDisplayHeading ? (
            allNotePath ? (
              'All Notes'
            ) : archiveNotePath ? (
              'Archive Notes'
            ) : (
              ''
            )
          ) : (
            <div className="flex-wrap items-center gap-1 hidden lg:flex">
              <div className="text-gray-600 dark:text-gray-400 whitespace-nowrap">
                {filteredTag ? (
                  'note tagged: '
                ) : searchQuery ? (
                  'showing results for: '
                ) : settingsActive ? (
                  <span className="text-gray-800 dark:text-gray-200">settings</span>
                ) : null}
              </div>
              <div className="max-w-xs overflow-x-auto scrollbar-hide whitespace-nowrap text-gray-900 dark:text-gray-100">{otherDisplayHeading}</div>
            </div>
          )}
        </h1>

        <h1 className="lg:hidden text-3xl font-bold text-gray-900 dark:text-gray-100">
          {activeMobileNav}
        </h1>

      <div className="flex gap-4 lg:gap-8 items-center">
        {/* Desktop search */}
        <div className="hidden lg:flex items-center gap-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 px-4 py-3">
          <div className="text-black dark:text-gray-400">
            <IconSearch />
          </div>
          <input
            type="text"
            className="focus:outline-none w-[320px] text-black dark:text-white bg-transparent placeholder-gray-800 dark:placeholder-gray-400"
            value={searchText}
            placeholder="Search by title, content, or tags…"
            onChange={(e) => handleSearchQueryNotes(e)}
          />
          {searchText && (
            <button
              className="text-gray-500 dark:text-gray-400 text-sm"
              onClick={() => {
                setSearchText('');
                dispatch(noteAction.allSearchQueryNotes(''));
              }}
            >
              Clear
            </button>
          )}
        </div>

        <button
          type="button"
          className="active:scale-110 transition-all w-10 h-10 items-center justify-center hidden lg:flex"
          onClick={toggleOpenSettings}
        >
          <div className="text-gray-500 dark:text-gray-400">
            <IconSettings />
          </div>
        </button>
      </div>
    </div>
  );
}

export default SubNav;
