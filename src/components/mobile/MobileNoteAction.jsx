// import React from 'react'
import ArrowLeft from '../../assets/images/icon-arrow-left.svg?react';
import IconDelete from '../../assets/images/icon-delete.svg?react';
import IconArchive from '../../assets/images/icon-archive.svg?react';
import IconRestore from '../../assets/images/icon-restore.svg?react';
import { useDispatch, useSelector } from 'react-redux';
import { mobileAction, noteAction, toastAction } from '../../store';
import supabase from '../../config/SupabaseConfig';
import { useState } from 'react';
import ModelMsg from '../ui/ModelMsg';
import { useLocation } from 'react-router-dom';

function MobileNoteAction() {
  const noteDetail = useSelector((state) => state.note.noteDetail);
  const newNoteI = useSelector((state) => state.note.newNoteI);
  // We don't need formData here as it's managed in NoteForm.jsx

  const dispatch = useDispatch();

  const location = useLocation();
  const currentPath = location.pathname;

  const archiveNotePath = currentPath === '/archive-notes';
  const allNotePath = currentPath === '/' || currentPath === '/all-notes';

  // Modal state
  const [modalType, setModalType] = useState(null);

  const openModal = (type) => setModalType(type);
  const closeModal = () => setModalType(null);

  const handleGoBack = function () {
    // If we're in new note mode, cancel the note creation
    if (newNoteI) {
      dispatch(noteAction.cancelNote());
      dispatch(noteAction.showNoteDetail(noteDetail));
    } else if (noteDetail?.id) {
      // Reset form to original note values
      dispatch(noteAction.showNoteDetail(noteDetail));
    }

    // Ensure we have a previous view to return to
    if (noteDetail?.id) {
      dispatch(mobileAction.callHideNote());
    } else {
      dispatch(mobileAction.callShowNote());
    }
  };

  const handleDelete = async function () {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) return console.error('User error:', userError);

    const { data, error } = await supabase.from('notes').delete().eq('id', noteDetail.id).eq('user_id', user.id).select();

    if (error) return console.log('Error:', error);

    if (data) {
      dispatch(noteAction.deleteNote(noteDetail.id));
      dispatch(toastAction.showToast({ message: 'Note permanently deleted.', subText: '' }));
    }

    closeModal(); // Close modal after success
  };

  const handleToggleArchive = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) return console.error('User error:', userError);

    const newArchivedStatus = !noteDetail.archived;
    const { data, error } = await supabase.from('notes').update({ archived: newArchivedStatus }).eq('id', noteDetail.id).eq('user_id', user.id).select();

    if (error) return console.log('Error:', error);

    if (data) {
      const { data: allData, error: fetchError } = await supabase.from('notes').select().eq('user_id', user.id).order('created_at', { ascending: false });

      if (fetchError) return console.log('Fetch error:', fetchError);

      if (allData) {
        dispatch(noteAction.allNotes(allData.filter((note) => !note.archived)));
        dispatch(noteAction.allArchivedNotes(allData.filter((note) => note.archived)));
        dispatch(noteAction.showNoteDetail(allNotePath ? allData[0] || {} : archiveNotePath ? allData[0] || {} : {}));
      }
    }

    closeModal(); // Close modal after success
    const msg = allNotePath ? 'Note archived. ' : archiveNotePath ? 'Note restored to active notes.' : '';
    const sub = allNotePath ? 'Archived Notes' : archiveNotePath ? 'All Notes' : '';
    dispatch(toastAction.showToast({ message: msg, subText: sub }));

    dispatch(mobileAction.callHideNote());
  };

  const handleCancel = (e) => {
    if (e) e.preventDefault();

    // Get the form element and reset it directly
    const form = document.getElementById('note-form');
    if (form) {
      // Reset all form fields
      const titleInput = form.querySelector('input[name="title"]');
      const tagsInput = form.querySelector('input[name="tags"]');
      const noteDetailsTextarea = form.querySelector('textarea[name="noteDetails"]');

      if (titleInput) titleInput.value = !newNoteI && noteDetail.id ? noteDetail.title || '' : '';
      if (tagsInput) tagsInput.value = !newNoteI && noteDetail.id ? noteDetail.tags || '' : '';
      if (noteDetailsTextarea) noteDetailsTextarea.value = !newNoteI && noteDetail.id ? noteDetail.note_details || '' : '';
    }

    if (!newNoteI && noteDetail.id) {
      // Reset form to original note values
      dispatch(noteAction.showNoteDetail(noteDetail));
    } else {
      // Clear form and exit create mode
      dispatch(noteAction.cancelNote());
      dispatch(noteAction.showNoteDetail(noteDetail));
    }
  };

  const handleSaveNote = async (e) => {
    e.preventDefault();

    // Get the form element
    const form = document.getElementById('note-form');
    if (!form) return;

    // Get form data
    const formData = new FormData(form);
    const title = formData.get('title');
    const tags = formData.get('tags');
    const noteDetails = formData.get('noteDetails');

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      dispatch(toastAction.showToast({ message: 'Please log in to save notes', subText: '' }));
      return;
    }

    if (newNoteI) {
      // Create new note
      const { data, error } = await supabase
        .from('notes')
        .insert([
          {
            title,
            tags,
            note_details: noteDetails,
            user_id: user.id,
          },
        ])
        .select();

      if (error) {
        dispatch(toastAction.showToast({ message: 'Error saving note', subText: error.message }));
      } else if (data) {
        dispatch(noteAction.cancelNote());
        dispatch(noteAction.addNote(data[0]));
        dispatch(noteAction.showNoteDetail(data[0]));
        dispatch(toastAction.showToast({ message: 'New note added successfully', subText: '' }));
        dispatch(mobileAction.callHideNote());
      }
    } else {
      // Update existing note
      const { data, error } = await supabase
        .from('notes')
        .update({
          title,
          tags,
          note_details: noteDetails,
        })
        .eq('id', noteDetail.id)
        .eq('user_id', user.id)
        .select();

      if (error) {
        dispatch(toastAction.showToast({ message: 'Error updating note', subText: error.message }));
      } else if (data) {
        dispatch(noteAction.updateNote(data[0]));
        dispatch(noteAction.showNoteDetail(data[0]));
        dispatch(toastAction.showToast({ message: 'Note updated successfully', subText: '' }));
        dispatch(mobileAction.callHideNote());
      }
    }
  };

  return (
    <div className="px-4 py-3 sm:px-6 md:px-8 sm:py-3 md:py-4 flex items-center justify-between border-b dark:border-gray-800 bg-white dark:bg-black mt-0">
      <button className="flex items-center gap-1 sm:gap-1.5 md:gap-2 text-gray-700 dark:text-gray-300 active:scale-95" onClick={handleGoBack}>
        <ArrowLeft />
        <p className="capitalize">go back</p>
      </button>

      <div className="flex items-center gap-3">
        {!newNoteI && noteDetail.id && (
          <>
            <button onClick={() => openModal('delete')} className="text-gray-700 dark:text-gray-300 active:scale-95">
              <IconDelete />
            </button>
            <button onClick={() => openModal('archive')} className="text-gray-700 dark:text-gray-300 active:scale-95">
              {archiveNotePath ? <IconRestore /> : allNotePath ? <IconArchive /> : null}
            </button>
          </>
        )}

        <button type="button" onClick={handleCancel} className="active:scale-95 text-sm dark:text-gray-300">
          Cancel
        </button>

        <button type="button" onClick={handleSaveNote} className="active:scale-95 text-sm text-blue-500">
          {newNoteI ? 'Save Note' : 'Update Note'}
        </button>
      </div>

      {modalType && <ModelMsg type={modalType} onCancel={closeModal} onConfirm={modalType === 'delete' ? handleDelete : handleToggleArchive} />}
    </div>
  );
}

export default MobileNoteAction;
