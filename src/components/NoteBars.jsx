// NoteBars.js
import { format } from 'date-fns';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import supabase from '../config/SupabaseConfig';
import { noteAction } from '../store';
import { useLocation, useNavigate } from 'react-router-dom';
import IconSun from '../assets/images/icon-sun.svg?react';
import IconFont from '../assets/images/icon-font.svg?react';
import IconLock from '../assets/images/icon-lock.svg?react';
import IconLogout from '../assets/images/icon-logout.svg?react';
import ArrowLeft from '../assets/images/icon-arrow-left.svg?react';

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
  const notes = useSelector((state) => state.notes);
  const archiveNotes = useSelector((state) => state.archivedNotes);
  const newNoteI = useSelector((state) => state.newNoteI);
  const noteDetail = useSelector((state) => state.noteDetail);
  const filteredNotes = useSelector((state) => state.filteredNotes);
  const filteredTag = useSelector((state) => state.filteredTag);
  const searchQueryNotes = useSelector((state) => state.searchQueryNotes);
  const searchQuery = useSelector((state) => state.searchQuery);
  const settingsActive = useSelector((state) => state.settingsActive);
  const activeSettings = useSelector((state) => state.activeSettings);

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  // Determine the current path to set active states
  const archiveNotePath = currentPath === '/archive-notes';
  const allNotePath = currentPath === '/' || currentPath === '/all-notes';

  // Select notes to display based on filters and current path
  const allOrArchiveNotes = allNotePath ? notes : archiveNotePath ? archiveNotes : [];
  const displayNotes = filteredTag ? filteredNotes : searchQuery ? searchQueryNotes : allOrArchiveNotes;
  console.log(allOrArchiveNotes, displayNotes, "😍😭");
  

  const handleInitiateCreateNote = () => {
    if (!allNotePath) {
      navigate('/all-notes');
    }
    dispatch(noteAction.InitiateCreateNote());
  };

  const handleShowNoteDetail = (note) => {
    dispatch(noteAction.showNoteDetail(note));
  };

  useEffect(() => {
    const fetchNotes = async () => {
      // Fetch the current user ID
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('Error fetching user:', userError);
        return;
      }
      if (!user) return;
      
      // Fetch only the notes for the current user
      const { data, error } = await supabase
        .from('notes')
        .select()
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
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

  // Logout function using Supabase's signOut method
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
    } else {
      navigate('/auth/login');
    }
  };

  return (
    <div className="px-4 py-5 border-r-2 flex flex-col" style={{ height: 'calc(100vh - 85px)' }}>
      {settingsActive ? (
        <div>
          <div className="flex flex-col gap-4 border-b-2">
            {SETTINGS_OPT.map((opt) => (
              <button
                className={`flex justify-between gap-3 items-center p-2 active:scale-95 ${
                  activeSettings === opt.name && 'bg-gray-200 rounded-lg'
                }`}
                key={opt.id}
                onClick={() => handleApplyActiveSettings(opt.name)}
              >
                <div className="flex items-center gap-3">
                  <div className="text-gray-800">{opt.image}</div>
                  <h1 className="capitalize">{opt.name}</h1>
                </div>
                <div className="text-gray-800 rotate-180">
                  <ArrowLeft />
                </div>
              </button>
            ))}
          </div>
          <button
            className="flex gap-3 items-center p-3 w-full active:scale-95"
            onClick={handleLogout}
          >
            <IconLogout />
            <p className="capitalize">logout</p>
          </button>
        </div>
      ) : (
        <div>
          <button
            className="flex justify-center w-full py-3 rounded-lg bg-blue-500 active:scale-95 text-white mb-4"
            onClick={handleInitiateCreateNote}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M12 5a.75.75 0 0 1 .75.75V11H18a.75.75 0 0 1 0 1.5h-5.25v5.25a.75.75 0 0 1-1.5 0V12.5H6A.75.75 0 0 1 6 11h5.25V5.75A.75.75 0 0 1 12 5Z"
              />
            </svg>
            <p className="capitalize">create new note</p>
          </button>

          {archiveNotePath && !filteredTag && (
            <div className="w-full mb-4">
              All your archived notes are stored here. You can restore or delete them anytime.
            </div>
          )}

          {newNoteI && !filteredTag && (
            <div className="bg-gray-100 text-lg font-semibold rounded-lg p-2 mb-4">Untitled Note</div>
          )}

          {filteredTag && (
            <div className="bg-gray-100 rounded-lg p-2 mb-4">
              All notes with the <span className="font-semibold">{`"${filteredTag}"`}</span> tag are shown here.
            </div>
          )}

          {searchQuery && searchQueryNotes.length === 0 && (
            <div className="bg-gray-100 rounded-lg p-2 mb-4">
              No notes match your search. Try a different keyword or{' '}
              <button className="underline" onClick={handleInitiateCreateNote}>
                create a new note.
              </button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto scrollbar-hide">
            {displayNotes.length === 0 && !filteredTag && !searchQuery ? (
              <div className="bg-gray-100 rounded-lg p-2">
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
              displayNotes.map((note, index) => (
                <button
                  key={index}
                  onClick={() => handleShowNoteDetail(note)}
                  className={`flex flex-col p-2 text-start w-full ${
                    noteDetail?.id === note.id ? 'bg-gray-200' : ''
                  }`}
                >
                  <div className="flex flex-col gap-3">
                    <h1 className="font-semibold text-lg">{note.title}</h1>
                    <div className="flex flex-wrap gap-1">
                      {note.tags.split(',').map((tag, i) => (
                        <div key={i} className="bg-gray-200 brightness-90 rounded-md px-[6px] py-[2px] text-sm">
                          <p className="capitalize">{tag}</p>
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="text-sm">{format(new Date(note.created_at), 'dd MMM yyyy')}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NoteBars;
