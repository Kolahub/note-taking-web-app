import { useDispatch, useSelector } from 'react-redux';
import { mobileAction, noteAction } from '../../store';
import { format } from 'date-fns';
import supabase from '../../config/SupabaseConfig';

function MobileTaggedNotes() {
  const dispatch = useDispatch();
  const activeTag = useSelector((state) => state.note.filteredTag);
  const allNotes = useSelector((state) => state.note.notes);
  const allArchiveNotes = useSelector((state) => state.note.archivedNotes);

  // Get filtered notes with the active tag
  const allAndArchiveNotes = [...allNotes, ...allArchiveNotes];
  const filteredNotes = allAndArchiveNotes
    .filter((note) => note.tags && note.tags.includes(activeTag))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const handleGoBack = () => {
    dispatch(mobileAction.callShowTag());
  };

  const handleNoteClick = async (note) => {
    try {
      // First, ensure we have the latest note data
      const { data: latestNote, error } = await supabase
        .from('notes')
        .select('*')
        .eq('id', note.id)
        .single();

      if (error) throw error;

      // Update the note detail in the store with the latest data
      dispatch(noteAction.showNoteDetail(latestNote || note));
      
      // Then show the note view
      dispatch(mobileAction.callShowNote());
    } catch (error) {
      console.error('Error loading note:', error);
      // Fallback to the existing note data if there's an error
      dispatch(noteAction.showNoteDetail(note));
      dispatch(mobileAction.callShowNote());
    }
  };

  const renderTagPills = (noteTags) => {
    if (!noteTags) return null;

    const tagArray = noteTags.split(',').filter((tag) => tag.trim() !== '');

    return tagArray.map((tag, index) => (
      <span
        key={index}
        className={`inline-block text-xs py-1 px-2 mr-1 rounded-md ${
          tag.trim() === activeTag
            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
        }`}
      >
        {tag.trim()}
      </span>
    ));
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd MMM yyyy').replace(/ /g, ' ');
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <div className="bg-white dark:bg-black h-full overflow-y-auto">
      <div className="p-4">
        <button onClick={handleGoBack} className="flex items-center text-gray-500 dark:text-gray-400 mb-5">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" className="mr-2">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          <span>Go Back</span>
        </button>

        <h1 className="text-2xl font-semibold text-gray-950 dark:text-gray-100 mb-2">Notes Tagged: {activeTag}</h1>

        <p className="text-gray-500 dark:text-gray-400 mb-6">All notes with the &quot;{activeTag}&quot; tag are shown here.</p>

        {filteredNotes.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 dark:text-gray-400">No notes found with this tag</p>
          </div>
        ) : (
          <div className="space-y-0">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className="border-b border-gray-200 dark:border-gray-800 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 active:bg-gray-100 dark:active:bg-gray-800 transition-colors"
                onClick={() => handleNoteClick(note)}
              >
                <h3 className="font-medium text-gray-900 dark:text-gray-100 text-base">{note.title || 'Untitled'}</h3>

                <div className="my-2">{renderTagPills(note.tags)}</div>

                <p className="text-gray-500 dark:text-gray-400 text-xs">{formatDate(note.created_at)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MobileTaggedNotes;
