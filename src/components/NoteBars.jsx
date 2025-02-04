import { format } from 'date-fns';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import supabase from '../config/SupabaseConfig';
import { noteAction } from '../store';
import { useLocation, useNavigate } from 'react-router-dom';

function NoteBars() {
  const notes = useSelector((state) => state.notes);
  const newNoteI = useSelector((state) => state.newNoteI);
  const noteDetail = useSelector((state) => state.noteDetail);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const archiveNotePath = currentPath === '/archive-notes';
  const allNotePath = currentPath === '/' || currentPath === '/all-notes';

  // --- Handle creating a new note
  const handleNavigateAndCreate = (e) => {
    e.preventDefault();
    navigate('/all-notes');
    dispatch(noteAction.InitiateCreateNote());
  };

  const handleInitiateCreateNote = () => {
    if (allNotePath) {
      dispatch(noteAction.InitiateCreateNote());
    }
    if (archiveNotePath) {
      navigate('/all-notes');
      dispatch(noteAction.InitiateCreateNote());
    }
  };

  const handleShowNoteDetail = (note) => {
    dispatch(noteAction.showNoteDetail(note));
  };
  
  useEffect(() => {
    const fetchNotes = async () => {
      const { data, error } = await supabase
        .from('notes')
        .select()
        .order('created_at', { ascending: false });
      if (error) {
        console.log(error);
        return;
      }
      if (data) {
        const unarchivedData = data.filter((note) => !note.archived);
        const archivedData = data.filter((note) => note.archived);
        const list = allNotePath ? unarchivedData : archiveNotePath ? archivedData : [];
        dispatch(noteAction.allNotes(list));
      }
    };
    fetchNotes();
  }, [dispatch, allNotePath, archiveNotePath]);

  useEffect(() => {
    if (!newNoteI && notes.length > 0 && !noteDetail?.id) {
      dispatch(noteAction.showNoteDetail(notes[0]));
    }
  }, [dispatch, newNoteI, notes, noteDetail?.id]);

  return (
    <div className="px-4 py-5 border-r-2 h-full flex flex-col">
      <button
        className="flex justify-center w-full py-3 rounded-lg bg-blue-500 active:scale-95 text-white mb-4"
        onClick={handleInitiateCreateNote}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M12 5a.75.75 0 0 1 .75.75V11H18a.75.75 0 0 1 0 1.5h-5.25v5.25a.75.75 0 0 1-1.5 0V12.5H6A.75.75 0 0 1 6 11h5.25V5.75A.75.75 0 0 1 12 5Z"
          />
        </svg>
        <p className="capitalize">create new note</p>
      </button>
      {archiveNotePath && (
        <div className="w-full mb-4">
          All your archived notes are stored here. You can restore or delete them anytime.
        </div>
      )}
      {newNoteI && (
        <div className="bg-gray-100 text-lg font-semibold rounded-lg p-2 mb-4">
          Untitled Note
        </div>
      )}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {notes.length === 0 ? (
          <div className="bg-gray-100 rounded-lg p-2">
            {allNotePath ? (
              'You don’t have any notes yet. Start a new note to capture your thoughts and ideas.'
            ) : archiveNotePath ? (
              <>
                No notes have been archived yet. Move notes here for safekeeping, or{' '}
                <button className="underline" onClick={handleNavigateAndCreate}>
                  create a new note.
                </button>
              </>
            ) : null}
          </div>
        ) : (
          notes.map((note, index) => (
            <button
              key={index}
              onClick={() => handleShowNoteDetail(note)}
              className={`flex flex-col p-2 text-start w-full ${
                noteDetail?.id === note.id ? 'bg-gray-200' : ''
              }`}
            >
              <div className="flex flex-col gap-3">
                <h1 className="font-semibold text-lg">{note.title}</h1>
                <div className="flex gap-1">
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
  );
}

export default NoteBars;
