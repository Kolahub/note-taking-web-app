// NoteForm.js
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, useLocation } from 'react-router-dom';
import supabase from '../config/SupabaseConfig';
import { noteAction, toastAction } from '../store';
import { format } from 'date-fns';
import IconTag from '../assets/images/icon-tag.svg?react'
import IconStatus from '../assets/images/icon-status.svg?react'
import IconClock from '../assets/images/icon-clock.svg?react'


function NoteForm() {
  const newNoteI = useSelector((state) => state.note.newNoteI);
  const noteDetail = useSelector((state) => state.note.noteDetail);
  const dispatch = useDispatch();
  const location = useLocation();
  const currentPath = location.pathname;

  // Controlled inputs for form data
  const [formData, setFormData] = useState({
    title: '',
    tags: '',
    last_edited: '',
    noteDetails: '',
  });

  // State to hold the current user's id
  const [userId, setUserId] = useState(null);

  // Fetch current user id on mount
  useEffect(() => {
    const fetchUserId = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error);
      }
      if (user) {
        setUserId(user.id);
      }
    };
    fetchUserId();
  }, []);

  // Initialize formData based on noteDetail when updating
  useEffect(() => {
    if (!newNoteI && noteDetail.id) {
      setFormData({
        title: noteDetail.title || '',
        tags: noteDetail.tags || '',
        last_edited: noteDetail.created_at || '',
        noteDetails: noteDetail.note_details || '',
      });
    }

    if (newNoteI) {
      setFormData({ title: '', tags: '', last_edited: '', noteDetails: '' });
    }
  }, [newNoteI, noteDetail]);

  // Check for changes in update mode
  const changesMade =
    !newNoteI &&
    noteDetail.id &&
    (formData.title !== (noteDetail.title || '') ||
      formData.tags !== (noteDetail.tags || '') ||
      formData.last_edited !== (noteDetail.last_edited || '') ||
      formData.noteDetails !== (noteDetail.note_details || ''));

  const handleSaveNote = async (e) => {
    e.preventDefault();

    // Ensure we have a user id before proceeding
    if (!userId) {
      console.error('No user is logged in.');
      return;
    }

    if (newNoteI) {
      // Create new note including the user_id
      const { data, error } = await supabase
        .from('notes')
        .insert([
          {
            title: formData.title,
            tags: formData.tags,
            note_details: formData.noteDetails,
            user_id: userId,
          },
        ])
        .select();

      if (error) {
        console.log(error);
      } else if (data) {
        // Clear the form and update state
        setFormData({ title: '', tags: '', noteDetails: '' });
        dispatch(noteAction.cancelNote());
        dispatch(noteAction.addNote(data[0]));
        dispatch(noteAction.showNoteDetail(data[0]));
        dispatch(toastAction.showToast({ message: 'New note added successfully', subText: '' }));
      }
    } else {
      // Update existing note – ensure that only the owner’s note is updated
      const { data, error } = await supabase
        .from('notes')
        .update({
          title: formData.title,
          tags: formData.tags,
          note_details: formData.noteDetails,
        })
        .eq('id', noteDetail.id)
        .eq('user_id', userId) // only update if this note belongs to the user
        .select();
      if (error) {
        console.log(error);
      }
      if (data) {
        console.log('Updated:', data);
        dispatch(noteAction.updateNote(data[0]));
        dispatch(noteAction.showNoteDetail(data[0]));
        dispatch(toastAction.showToast({ message: 'New note updated successfully', subText: '' }));
      }
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();

    if (!newNoteI && noteDetail.id) {
      // Reset form to original note values
      setFormData({
        title: noteDetail.title || '',
        tags: noteDetail.tags || '',
        noteDetails: noteDetail.note_details || '',
      });
      dispatch(noteAction.showNoteDetail(noteDetail));
    } else {
      // Clear form and exit create mode
      setFormData({ title: '', tags: '', last_edited: '', noteDetails: '' });
      dispatch(noteAction.cancelNote());
      dispatch(noteAction.showNoteDetail(noteDetail));
    }
  };

  return (
    <Form
      onSubmit={handleSaveNote}
      className="px-6 py-5 flex flex-col border-r-2 border-gray-200 dark:border-gray-800"
      style={{ height: 'calc(100vh - 85px)' }}
    >
      {/* Title Input */}
      <input
        type="text"
        name="title"
        placeholder="Enter a title..."
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="focus:outline-none placeholder-black dark:placeholder-gray-300 text-3xl font-bold w-full bg-transparent dark:text-white"
      />

      <div className="mt-4 flex flex-col flex-1">
        {/* Tags Section */}
        <div className="flex gap-2 py-1 mb-2">
          <div className="flex items-center gap-1 w-48">
            <div className="text-black dark:text-gray-300">
              <IconTag />
            </div>
            <p className="text-gray-800 dark:text-gray-200">Tags</p>
          </div>
          <input
            type="text"
            name="tags"
            placeholder="Add tags separated by commas (e.g. Work, Planning)"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            className="focus:outline-none w-full bg-transparent dark:text-white"
          />
        </div>

        {currentPath === '/archive-notes' && (
          <div className="flex gap-2 py-1 mb-2">
            <div className="flex items-center gap-1 w-48">
            <div className="text-black dark:text-gray-300">
              <IconStatus />
            </div>
              <p className="text-gray-800 dark:text-gray-200">Status</p>
            </div>
            <input
              type="text"
              name="status"
              value={'Archived'}
              disabled
              className="focus:outline-none w-full bg-inherit dark:text-white"
            />
          </div>
        )}

        <div className="flex gap-2 py-1">
          <div className="flex items-center gap-1 w-48">
          <div className="text-black dark:text-gray-300">
              <IconClock />
            </div>
            <p className="text-gray-800 dark:text-gray-200">Last edited</p>
          </div>
          <input
            type="text"
            name="last_edited"
            placeholder="Not yet saved"
            value={
              formData.last_edited
                ? format(new Date(formData.last_edited), 'dd MMM yyyy')
                : ''
            }
            disabled
            className="focus:outline-none w-full bg-inherit dark:text-white"
          />
        </div>

        <div className="w-full border-t-2 border-gray-200 dark:border-gray-800 my-4"></div>

        {/* Note Details */}
        <textarea
          name="noteDetails"
          placeholder="Start typing your note here…"
          value={formData.noteDetails}
          onChange={(e) => setFormData({ ...formData, noteDetails: e.target.value })}
          style={{
            overflow: 'auto',
            resize: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
          className="w-full flex-1 focus:outline-none hide-scrollbar bg-transparent dark:text-white"
        />

        <div className="w-full border-t-2 border-gray-200 dark:border-gray-800 my-4"></div>

        {/* Footer Buttons */}
        <div className="w-full flex gap-4">
          <button
            type="submit"
            className="capitalize text-white bg-blue-500 rounded-lg px-4 py-3 active:scale-95"
          >
            {newNoteI ? 'save note' : 'update note'}
          </button>
          <button
            onClick={handleCancel}
            type="button"
            disabled={!newNoteI && !changesMade}
            className={`capitalize rounded-lg px-4 py-3 active:scale-95 ${
              !newNoteI && !changesMade ? 'bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400' : 'bg-gray-100 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            cancel
          </button>
        </div>
      </div>
    </Form>
  );
}

export default NoteForm;
