import { NavLink, useLocation } from 'react-router-dom';
import ArrowLeft from '../assets/images/icon-arrow-left.svg?react';
import IconArchive from '../assets/images/icon-archive.svg?react';
import IconHome from '../assets/images/icon-home.svg?react';
import { useDispatch, useSelector } from 'react-redux';
import { noteAction } from '../store';
import Tags from './Tags';
import { useEffect } from 'react';
import { useTheme } from '../context/theme/ThemeContext';

function Navbar() {
  const { isLoading } = useTheme();
  const newNoteI = useSelector((state) => state.newNoteI);
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
  };

  if (isLoading) {
    return (
      <div className="lg:mt-4 lg:flex flex-col gap-3 animate-pulse">
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="lg:mt-4 lg:flex flex-col gap-2">
        <NavLink
          to={'/all-notes'}
          end
          onClick={handleOnclickNav}
          className={({ isActive }) =>
            `flex justify-between w-full px-3 py-[10px] rounded-lg group hover:bg-gray-200 dark:hover:bg-gray-800 ${
              (isActive || currentPath === '/') ? 'bg-gray-200 dark:bg-gray-800' : ''
            }`
          }
        >
          <div className="flex gap-2">
            <div className={`${(allNotePath || currentPath === '/') ? 'text-blue-500' : 'text-gray-950 dark:text-gray-50 group-hover:text-blue-500'}`}>
              <IconHome />
            </div>
            <span className="text-gray-950 dark:text-gray-100">All Notes</span>
          </div>

          <div
            className={`rotate-180 ${(allNotePath || currentPath === '/') ? 'text-gray-950 dark:text-gray-50' : 'opacity-0 group-hover:opacity-100 text-gray-950 dark:text-gray-50'}`}
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
  );
}

export default Navbar;