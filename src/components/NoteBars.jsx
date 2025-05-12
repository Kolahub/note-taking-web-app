import { format } from 'date-fns';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import supabase from '../config/SupabaseConfig';
import { mobileAction, noteAction } from '../store';
import { useLocation, useNavigate } from 'react-router-dom';
import IconSun from '../assets/images/icon-sun.svg?react';
import IconFont from '../assets/images/icon-font.svg?react';
import IconLock from '../assets/images/icon-lock.svg?react';
import IconLogout from '../assets/images/icon-logout.svg?react';
import ArrowLeft from '../assets/images/icon-arrow-left.svg?react';
import { useTheme } from '../context/theme/ThemeContext';

const SETTINGS_OPT = [
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

function NoteBars() {
  const { isLoading: themeLoading } = useTheme();
  const notes = useSelector((state) => state.note.notes);
  const archiveNotes = useSelector((state) => state.note.archivedNotes);
  const newNoteI = useSelector((state) => state.note.newNoteI);
  const noteDetail = useSelector((state) => state.note.noteDetail);
  const filteredNotes = useSelector((state) => state.note.filteredNotes);
  const filteredTag = useSelector((state) => state.note.filteredTag);
  const searchQueryNotes = useSelector((state) => state.note.searchQueryNotes);
  const searchQuery = useSelector((state) => state.note.searchQuery);
  const settingsActive = useSelector((state) => state.note.settingsActive);
  const activeSettings = useSelector((state) => state.note.activeSettings);

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const archiveNotePath = currentPath === '/archive-notes';
  const allNotePath = currentPath === '/' || currentPath === '/all-notes';

  const allOrArchiveNotes = allNotePath ? notes : archiveNotePath ? archiveNotes : [];
  const displayNotes = filteredTag ? filteredNotes : searchQuery ? searchQueryNotes : allOrArchiveNotes;

  const handleInitiateCreateNote = () => {
    if (!allNotePath) {
      navigate('/all-notes');
    }
    if (window.innerWidth < 1024) {
      dispatch(mobileAction.callShowNote());
    }
    dispatch(noteAction.InitiateCreateNote());
  };

  const handleShowNoteDetail = (note) => {
    dispatch(noteAction.showNoteDetail(note));

    if (window.innerWidth < 1024) {
      dispatch(mobileAction.callShowNote());
    }
  };

  useEffect(() => {
    const fetchNotes = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) {
        console.error('Error fetching user:', userError);
        return;
      }
      if (!user) return;

      const { data, error } = await supabase.from('notes').select().eq('user_id', user.id).order('created_at', { ascending: false });
      if (error) {
        console.log(error);
        return;
      }
      if (data) {
        const unarchivedData = data.filter((note) => !note.archived);
        const archivedData = data.filter((note) => note.archived);
        dispatch(noteAction.allNotes(unarchivedData));
        dispatch(noteAction.allArchivedNotes(archivedData));
      }
    };

    fetchNotes();
    dispatch(noteAction.applyActiveSettings('color theme'));
  }, [dispatch]);

  useEffect(() => {
    if (!newNoteI && displayNotes.length > 0) {
      dispatch(noteAction.showNoteDetail(displayNotes[0]));
    }
  }, [dispatch, newNoteI, displayNotes]);

  const handleApplyActiveSettings = (opt) => {
    dispatch(noteAction.applyActiveSettings(opt));
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
    } else {
      navigate('/auth/login');
    }
  };

  if (themeLoading) {
    return (
      <div className="flex-1 space-y-4 animate-pulse">
        {/* Search bar skeleton */}
        <div className="flex gap-2 items-center px-2">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex-1"></div>
        </div>

        {/* Notes list skeleton */}
        <div className="space-y-3 px-2">
          {[1, 2, 3].map((item) => (
            <div key={item} className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="space-y-3">
                {/* Title */}
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>

                {/* Tags */}
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>

                {/* Date */}
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:px-8 sm:py-4 lg:px-4 lg:py-5 border-r-2 dark:border-gray-800 flex flex-col w-full" style={{ height: 'calc(100vh - 85px)' }}>
      {settingsActive ? (
        <div>
          <div className="flex flex-col gap-4 border-b-2 dark:border-gray-800 pb-3">
            {SETTINGS_OPT.map((opt) => (
              <button
                className={`flex justify-between gap-3 items-center p-2 active:scale-95 transition-colors
                  ${
                    activeSettings === opt.name
                      ? 'bg-gray-200 dark:bg-gray-800 rounded-lg text-gray-900 dark:text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg'
                  }`}
                key={opt.id}
                onClick={() => handleApplyActiveSettings(opt.name)}
              >
                <div className="flex items-center gap-3">
                  <div className="text-gray-800 dark:text-gray-200">{opt.image}</div>
                  <h1 className="capitalize">{opt.name}</h1>
                </div>
                <div className="text-gray-800 dark:text-gray-200 rotate-180">
                  <ArrowLeft />
                </div>
              </button>
            ))}
          </div>
          <button
            className="flex gap-3 items-center p-3 w-full active:scale-95 text-gray-700 dark:text-gray-200 
                       hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg mt-3 transition-colors"
            onClick={handleLogout}
          >
            <IconLogout />
            <p className="capitalize">logout</p>
          </button>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <button
            className="flex justify-center items-center lg:w-full py-3 rounded-full lg:rounded-lg absolute lg:static right-9 bottom-24
            h-16 w-16 lg:h-auto bg-blue-500 hover:bg-blue-600 
                       dark:bg-blue-600 dark:hover:bg-blue-700 active:scale-95 text-white lg:mb-4 
                       transition-colors"
            onClick={handleInitiateCreateNote}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12 5a.75.75 0 0 1 .75.75V11H18a.75.75 0 0 1 0 1.5h-5.25v5.25a.75.75 0 0 1-1.5 0V12.5H6A.75.75 0 0 1 6 11h5.25V5.75A.75.75 0 0 1 12 5Z"
              />
            </svg>
            <p className="capitalize hidden lg:block">create new note</p>
          </button>

          <div className="flex-1 overflow-y-auto scrollbar-hide">
            {archiveNotePath && !filteredTag && (
              <div className="w-full mb-4 text-gray-700 dark:text-gray-300">
                All your archived notes are stored here. You can restore or delete them anytime.
              </div>
            )}

            {newNoteI && !filteredTag && (
              <div
                className="bg-gray-100 dark:bg-gray-800 text-lg font-semibold rounded-lg p-2 mb-4 
                            text-gray-900 dark:text-white"
              >
                Untitled Note
              </div>
            )}

            {filteredTag && (
              <div className="bg-gray-100 dark:bg-gray-800 dark:text-gray-100 rounded-lg p-2 mb-4">
                All notes with the <span className="font-semibold">{`"${filteredTag}"`}</span> tag are shown here.
              </div>
            )}

            {searchQuery && searchQueryNotes.length === 0 && (
              <div className="bg-gray-100 dark:bg-gray-800 dark:text-gray-100 rounded-lg p-2 mb-4">
                No notes match your search. Try a different keyword or{' '}
                <button className="underline" onClick={handleInitiateCreateNote}>
                  create a new note.
                </button>
              </div>
            )}

            <div className="flex-1 flex flex-col gap-2">
              {displayNotes.length === 0 && !filteredTag && !searchQuery ? (
                <div className="bg-gray-100 dark:bg-gray-800 dark:text-gray-100 rounded-lg p-2">
                  {allNotePath ? (
                    'You don’t have any notes yet. Start a new note to capture your thoughts and ideas.'
                  ) : archiveNotePath ? (
                    <>
                      No notes have been archived yet. Move notes here for safekeeping, or{' '}
                      <button className="underline" onClick={handleInitiateCreateNote}>
                        create a new note.
                      </button>
                    </>
                  ) : null}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {displayNotes.map((note, index) => (
                    <button
                      key={index}
                      onClick={() => handleShowNoteDetail(note)}
                      className={`flex flex-col p-2 text-start w-full rounded-lg border-b-2 border-gray-300 dark:border-gray-800 transition-colors
                        ${
                          noteDetail?.id === note.id
                            ? 'lg:bg-gray-200 lg:dark:bg-gray-800 lg:text-gray-900 lg:dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                            : 'lg:text-gray-700 lg:dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        } last:border-b-0`}
                    >
                      <div className="flex flex-col gap-3">
                        <h1 className="font-semibold text-lg">{note.title}</h1>
                        <div className="flex flex-wrap gap-1">
                          {note.tags.split(',').map((tag, i) => (
                            <div
                              key={i}
                              className={`rounded-md px-[6px] py-[2px] text-sm
                                ${
                                  noteDetail?.id === note.id
                                    ? 'lg:bg-gray-300 lg:dark:bg-gray-600 lg:text-gray-800 lg:dark:text-gray-200 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                                    : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                                }`}
                            >
                              <p className="capitalize">{tag}</p>
                            </div>
                          ))}
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{format(new Date(note.created_at), 'dd MMM yyyy')}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NoteBars;
