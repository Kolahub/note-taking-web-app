import { format } from 'date-fns';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import supabase from '../config/SupabaseConfig';
import { noteAction } from '../store';
import { useLocation, useNavigate } from 'react-router-dom';

function NoteBars() {
  const notes = useSelector((state) => state.notes);
  const archiveNotes = useSelector((state) => state.archivedNotes);
  const newNoteI = useSelector((state) => state.newNoteI);
  const noteDetail = useSelector((state) => state.noteDetail);
  // Using the updated names for filtered data
  const filteredNotes = useSelector((state) => state.filteredNotes);
  const filteredTag = useSelector((state) => state.filteredTag);

  const searchQueryNotes = useSelector((state) => state.searchQueryNotes);
  const searchQuery = useSelector((state) => state.searchQuery);

  console.log(searchQuery, searchQueryNotes, '😍😍🟢🟢');
  console.log(newNoteI, "🤣🤣💕💕✅");
  

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const archiveNotePath = currentPath === '/archive-notes';
  const allNotePath = currentPath === '/' || currentPath === '/all-notes';

  // Determine which list to use if no filter is applied.
  const allOrArchiveNotes = allNotePath ? notes : archiveNotePath ? archiveNotes : [];

  const displayNotes = filteredTag ? filteredNotes : searchQuery ? searchQueryNotes : allOrArchiveNotes;

const handleInitiateCreateNote = () => {
  if (!allNotePath) {
    navigate('/all-notes');
  }
  // Dispatch after navigation
  dispatch(noteAction.InitiateCreateNote());
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
        dispatch(noteAction.allNotes(unarchivedData));
        dispatch(noteAction.allArchivedNotes(archivedData));
      }
    };
  
    fetchNotes();
  }, [dispatch]);
  
  useEffect(() => {
    if (!newNoteI && displayNotes.length > 0) {
      // This will set the active note detail when displayNotes change.
      dispatch(noteAction.showNoteDetail(displayNotes[0]));
    }
  }, [dispatch, newNoteI, displayNotes]);
  

  return (
    <div className="px-4 py-5 border-r-2 h-full flex flex-col">
      <button className="flex justify-center w-full py-3 rounded-lg bg-blue-500 active:scale-95 text-white mb-4" onClick={handleInitiateCreateNote}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M12 5a.75.75 0 0 1 .75.75V11H18a.75.75 0 0 1 0 1.5h-5.25v5.25a.75.75 0 0 1-1.5 0V12.5H6A.75.75 0 0 1 6 11h5.25V5.75A.75.75 0 0 1 12 5Z"
          />
        </svg>
        <p className="capitalize">create new note</p>
      </button>

      {archiveNotePath && !filteredTag && (
        <div className="w-full mb-4">All your archived notes are stored here. You can restore or delete them anytime.</div>
      )}

      {(newNoteI && !filteredTag) && <div className="bg-gray-100 text-lg font-semibold rounded-lg p-2 mb-4">Untitled Note</div>}

      {/* If a tag filter is active, display a message */}
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
          .
        </div>
      )}

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {(displayNotes.length === 0 && !filteredTag && !searchQuery) ? (
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
