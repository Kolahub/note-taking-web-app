import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import supabase from '../../config/SupabaseConfig';
import { noteAction, toastAction } from '../../store';
import { useLocation } from 'react-router-dom';
import IconRestore from '../../assets/images/icon-restore.svg?react';
import IconDelete from '../../assets/images/icon-delete.svg?react';
import IconArchive from '../../assets/images/icon-archive.svg?react';
import ModelMsg from '../ui/ModelMsg';

function CleanSweep() {
  const noteDetail = useSelector((state) => state.note.noteDetail);
  const dispatch = useDispatch();
  const location = useLocation();
  const currentPath = location.pathname;

  const archiveNotePath = currentPath === '/archive-notes';
  const allNotePath = currentPath === '/' || currentPath === '/all-notes';

  // Modal state
  const [modalType, setModalType] = useState(null);

  const openModal = (type) => setModalType(type);
  const closeModal = () => setModalType(null);

  const handleToggleArchive = async () => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return console.error('User error:', userError);

    const newArchivedStatus = !noteDetail.archived;
    const { data, error } = await supabase
      .from('notes')
      .update({ archived: newArchivedStatus })
      .eq('id', noteDetail.id)
      .eq('user_id', user.id)
      .select();

    if (error) return console.log('Error:', error);

    if (data) {
      const { data: allData, error: fetchError } = await supabase
        .from('notes')
        .select()
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) return console.log('Fetch error:', fetchError);

      if (allData) {
        dispatch(noteAction.allNotes(allData.filter((note) => !note.archived)));
        dispatch(noteAction.allArchivedNotes(allData.filter((note) => note.archived)));
        dispatch(noteAction.showNoteDetail(
          allNotePath ? allData[0] || {} : archiveNotePath ? allData[0] || {} : {}
        ));
      }
    }

    closeModal(); // Close modal after success
    const msg = allNotePath ? 'Note archived. ' : archiveNotePath ? 'Note restored to active notes.' : ''
    const sub = allNotePath ? 'Archived Notes' : archiveNotePath ? 'All Notes' : '';
    dispatch(toastAction.showToast({ message: msg, subText: sub }));
    
  };

  const handleDeleteNow = async () => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return console.error('User error:', userError);

    const { data, error } = await supabase
      .from('notes')
      .delete()
      .eq('id', noteDetail.id)
      .eq('user_id', user.id)
      .select();

    if (error) return console.log('Error:', error);

    if (data) {
      dispatch(noteAction.deleteNote(noteDetail.id));
      dispatch(toastAction.showToast({ message: 'Note permanently deleted.', subText: '' }));
    }

    closeModal(); // Close modal after success
  };

  return (
    <div className="flex flex-col gap-3 pl-4 py-5 mr-6 h-full">
      <button className="flex items-center gap-2 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 w-full rounded-lg active:scale-95 dark:text-white" onClick={() => openModal('archive')}>
        <div className="text-black dark:text-white">
          {archiveNotePath ? <IconRestore /> : allNotePath ? <IconArchive /> : null}
        </div>
        <p className="capitalize">{archiveNotePath ? 'restore note' : 'archive note'}</p>
      </button>
      <button className="flex items-center gap-2 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 w-full rounded-lg active:scale-95 dark:text-white" onClick={() => openModal('delete')}>
        <div className="text-black dark:text-white">
          <IconDelete />
        </div>
        <p className="capitalize">delete note</p>
      </button>

      {modalType && (
    <ModelMsg
        type={modalType}
        onCancel={closeModal}
        onConfirm={modalType === 'delete' ? handleDeleteNow : handleToggleArchive}
    />
)}
    </div>
  );
}

export default CleanSweep;