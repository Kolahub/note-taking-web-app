import { format } from 'date-fns';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import supabase from '../config/SupabaseConfig';
import { noteAction } from '../store';
import { useLocation } from 'react-router-dom';

function NoteBars() {
  const notes = useSelector((state) => state.notes);
  const newNoteI = useSelector((state) => state.newNoteI);
  const noteDetail = useSelector((state) => state.noteDetail);
  const dispatch = useDispatch();
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    const fetchNotes = async () => {
      const { data, error } = await supabase.from('notes').select().order('created_at', { ascending: false });
      if (error) console.log(error);
      if (data) {
        const unarchivedData = data.filter((note) => !note.archived);
        const archivedData = data.filter((note) => note.archived);
        dispatch(
          noteAction.allNotes(
            currentPath === '/all-notes' || currentPath === '/' ? unarchivedData : currentPath === '/archive-notes' ? archivedData : []
          )
        );
        dispatch(
          noteAction.showNoteDetail(
            currentPath === '/all-notes' || currentPath === '/'
              ? unarchivedData[0] || {}
              : currentPath === '/archive-notes'
              ? archivedData[0] || {}
              : {}
          )
        );
      }
    };
    fetchNotes();
  }, [dispatch, currentPath]);

  const handleInitiateCreateNote = () => {
    dispatch(noteAction.InitiateCreateNote());
  };

  const handleShowNoteDetail = (note) => {
    dispatch(noteAction.showNoteDetail(note));
  };

  return (
    <div className="px-4 py-5 border-r-2 h-full flex flex-col">
      <button className="flex justify-center w-full py-3 rounded-lg bg-blue-500 active:scale-95 text-white" onClick={handleInitiateCreateNote}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M12 5a.75.75 0 0 1 .75.75V11H18a.75.75 0 0 1 0 1.5h-5.25v5.25a.75.75 0 0 1-1.5 0V12.5H6A.75.75 0 0 1 6 11h5.25V5.75A.75.75 0 0 1 12 5Z"
          />
        </svg>
        <p className="capitalize">create new note</p>
      </button>
      {newNoteI && <div className="bg-gray-100 text-lg font-semibold rounded-lg p-2 mt-4">Untitled Note</div>}
      <div className="mt-4 flex-1 overflow-y-auto scrollbar-hide">
        {notes.length === 0 ? (
          <div className="bg-gray-200 rounded-lg p-2">You don’t have any notes yet. Start a new note to capture your thoughts and ideas.</div>
        ) : (
          notes.map((note, index) => (
            <button
              key={index}
              onClick={() => handleShowNoteDetail(note)}
              className={`flex flex-col p-2 text-start w-full ${noteDetail?.id === note.id ? 'bg-gray-200' : ''}`}
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
