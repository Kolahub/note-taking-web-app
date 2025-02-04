import { useDispatch, useSelector } from 'react-redux';
import supabase from '../config/SupabaseConfig';
import { noteAction } from '../store';
import { useLocation } from 'react-router-dom';

function CleanSweep() {
  const noteDetail = useSelector((state) => state.noteDetail);
  const dispatch = useDispatch();
  const location = useLocation();
  const currentPath = location.pathname;

  // Define current view paths.
  const archiveNotePath = currentPath === '/archive-notes';
  const allNotePath = currentPath === '/' || currentPath === '/all-notes';

  // Merged archive/restore function.
  const handleToggleArchive = async () => {
    // Toggle archived status: if noteDetail.archived is false/undefined, new status becomes true, and vice versa.
    const newArchivedStatus = !noteDetail.archived;
    const { data, error } = await supabase.from('notes').update({ archived: newArchivedStatus }).eq('id', noteDetail.id).select();

    if (error) {
      console.log('Error toggling archive:', error);
      return;
    }

    if (data) {
      console.log('Toggle archive data:', data);
      // Re-fetch all notes to update the UI immediately.
      const { data: allData, error: fetchError } = await supabase.from('notes').select().order('created_at', { ascending: false });
      if (fetchError) {
        console.log('Error fetching notes:', fetchError);
        return;
      }
      if (allData) {
        const unarchivedData = allData.filter((note) => !note.archived);
        const archivedData = allData.filter((note) => note.archived);
        // Dispatch updated notes array based on current route.
        dispatch(noteAction.allNotes(allNotePath ? unarchivedData : archiveNotePath ? archivedData : []));
        // Set the first note in the updated list as the active note.
        dispatch(noteAction.showNoteDetail(allNotePath ? unarchivedData[0] || {} : archiveNotePath ? archivedData[0] || {} : {}));
      }
    }
  };

  const handleDeleteNow = async () => {
    const { data, error } = await supabase.from('notes').delete().eq('id', noteDetail.id).select();
    if (error) {
      console.log('Error deleting note:', error);
      return;
    }
    if (data) {
      console.log('Deleted note:', data);
      // Delete the note from Redux.
      dispatch(noteAction.deleteNote(noteDetail.id));
    }
  };

  return (
    <div className="flex flex-col gap-3 pl-4 py-5 mr-6 h-full">
      <button className="flex items-center gap-2 px-4 py-3 border-2 border-gray-300 w-full rounded-lg active:scale-95" onClick={handleToggleArchive}>
        {archiveNotePath ? (
          // Restore icon (for archived view)
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path
              fill="#0E121B"
              fillRule="evenodd"
              d="M3.708 7.404a.75.75 0 0 1 .983.398l1.316 3.114L9.1 9.608a.75.75 0 0 1 .584 1.382L5.9 12.59a.75.75 0 0 1-.983-.4L3.309 8.387a.75.75 0 0 1 .4-.982Z"
              clipRule="evenodd"
            />
            <path
              fill="#0E121B"
              fillRule="evenodd"
              d="M12.915 5.664c-3.447 0-6.249 2.746-6.335 6.16a.75.75 0 0 1-1.5-.038c.108-4.228 3.575-7.622 7.835-7.622a7.838 7.838 0 0 1 7.835 7.835 7.833 7.833 0 0 1-7.835 7.835 7.843 7.843 0 0 1-6.457-3.384.75.75 0 1 1 1.232-.856 6.343 6.343 0 0 0 5.225 2.74 6.333 6.333 0 0 0 6.335-6.335 6.339 6.339 0 0 0-6.335-6.335Z"
              clipRule="evenodd"
            />
          </svg>
        ) : allNotePath ? (
          // Archive icon (for unarchived view)
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path
              stroke="#0E121B"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M21 7.782v8.435C21 19.165 18.919 21 15.974 21H8.026C5.081 21 3 19.165 3 16.216V7.782C3 4.834 5.081 3 8.026 3h7.948C18.919 3 21 4.843 21 7.782Z"
            />
            <path
              stroke="#0E121B"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="m15 14-3.002 3L9 14M11.998 17v-7M20.934 7H3.059"
            />
          </svg>
        ) : null}
        <p className="capitalize">{archiveNotePath ? 'restore note' : allNotePath ? 'archive note' : ''}</p>
      </button>
      <button className="flex items-center gap-2 px-4 py-3 border-2 border-gray-300 w-full rounded-lg active:scale-95" onClick={handleDeleteNow}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" fill="none" viewBox="0 0 24 25">
          <path
            stroke="#0E121B"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="m14.852 3.879.818 1.785h2.64c.811 0 1.47.658 1.47 1.47V8.22c0 .555-.45 1.005-1.006 1.005H5.005C4.45 9.226 4 8.776 4 8.221V7.133c0-.811.658-1.47 1.47-1.47h2.639l.818-1.784c.246-.536.78-.879 1.37-.879h3.185c.59 0 1.125.343 1.37.879ZM18.24 9.3v8.686c0 1.665-1.333 3.014-2.977 3.014H8.517c-1.644 0-2.977-1.349-2.977-3.014V9.301M10.2 12.816v4.509m3.38-4.509v4.509"
          />
        </svg>
        <p className="capitalize">delete note</p>
      </button>
    </div>
  );
}

export default CleanSweep;
