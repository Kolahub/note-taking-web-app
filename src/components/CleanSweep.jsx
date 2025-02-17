import { useDispatch, useSelector } from 'react-redux';
import supabase from '../config/SupabaseConfig';
import { noteAction } from '../store';
import { useLocation } from 'react-router-dom';
import IconRestore from '../assets/images/icon-restore.svg?react'
import IconDelete from '../assets/images/icon-delete.svg?react'
import IconArchive from '../assets/images/icon-archive.svg?react'


function CleanSweep() {
  const noteDetail = useSelector((state) => state.noteDetail);
  const dispatch = useDispatch();
  const location = useLocation();
  const currentPath = location.pathname;

  // Determine the current view based on the path
  const archiveNotePath = currentPath === '/archive-notes';
  const allNotePath = currentPath === '/' || currentPath === '/all-notes';

  // Toggle the archived status of a note (scoped to the current user)
  const handleToggleArchive = async () => {
    // Retrieve the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError) {
      console.error('Error fetching user:', userError);
      return;
    }
    if (!user) {
      console.error('No user is logged in.');
      return;
    }

    const newArchivedStatus = !noteDetail.archived;
    const { data, error } = await supabase
      .from('notes')
      .update({ archived: newArchivedStatus })
      .eq('id', noteDetail.id)
      .eq('user_id', user.id) // ensure only the owner’s note is updated
      .select();

    if (error) {
      console.log('Error toggling archive:', error);
      return;
    }

    if (data) {
      console.log('Toggle archive data:', data);
      // Fetch and update notes in the UI for the current user only
      const { data: allData, error: fetchError } = await supabase
        .from('notes')
        .select()
        .eq('user_id', user.id) // only fetch notes for the current user
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.log('Error fetching notes:', fetchError);
        return;
      }

      if (allData) {
        const unarchivedData = allData.filter((note) => !note.archived);
        const archivedData = allData.filter((note) => note.archived);

        // Update Redux state with the fetched notes
        dispatch(noteAction.allNotes(unarchivedData));
        dispatch(noteAction.allArchivedNotes(archivedData));

        // Set the first note in the appropriate list as active
        dispatch(noteAction.showNoteDetail(allNotePath ? unarchivedData[0] || {} : archiveNotePath ? archivedData[0] || {} : {}));
      }
    }
  };

  // Delete a note (scoped to the current user)
  const handleDeleteNow = async () => {
    // Retrieve the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError) {
      console.error('Error fetching user:', userError);
      return;
    }
    if (!user) {
      console.error('No user is logged in.');
      return;
    }

    const { data, error } = await supabase
      .from('notes')
      .delete()
      .eq('id', noteDetail.id)
      .eq('user_id', user.id) // only delete if this note belongs to the user
      .select();

    if (error) {
      console.log('Error deleting note:', error);
      return;
    }

    if (data) {
      console.log('Deleted note:', data);
      // Remove the note from Redux state
      dispatch(noteAction.deleteNote(noteDetail.id));
    }
  };

  return (
    <div className="flex flex-col gap-3 pl-4 py-5 mr-6 h-full">
      <button className="flex items-center gap-2 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 w-full rounded-lg active:scale-95 dark:text-white" onClick={handleToggleArchive}>
        {archiveNotePath ? (
          // Restore icon
          <div className="text-black dark:text-white">
            <IconRestore />
          </div>
        ) : allNotePath ? (
          // Archive icon
          <div className="text-black dark:text-white">
          <IconArchive />
        </div>
        ) : null}
        <p className="capitalize">{archiveNotePath ? 'restore note' : allNotePath ? 'archive note' : ''}</p>
      </button>
      <button className="flex items-center gap-2 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 w-full rounded-lg active:scale-95 dark:text-white" onClick={handleDeleteNow}>
      <div className="text-black dark:text-white">
            <IconDelete />
          </div>
        <p className="capitalize">delete note</p>
      </button>
    </div>
  );
}

export default CleanSweep;