// NoteForm.js
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, useLocation } from 'react-router-dom';
import supabase from '../config/SupabaseConfig';
import { noteAction } from '../store';
import { format } from 'date-fns';

function NoteForm() {
  const allNotes = useSelector((state) => state.notes);
  const newNoteI = useSelector((state) => state.newNoteI);
  const noteDetail = useSelector((state) => state.noteDetail);
  const dispatch = useDispatch();
  const location = useLocation();
  const currentPath = location.pathname;

  // Always use controlled inputs.
  const [formData, setFormData] = useState({
    title: '',
    tags: '',
    last_edited: '',
    noteDetails: '',
  });

  // On update mode, initialize formData with noteDetail.
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

  // Check if any changes were made in update mode.
  const changesMade =
    !newNoteI &&
    noteDetail.id &&
    (formData.title !== (noteDetail.title || '') ||
      formData.tags !== (noteDetail.tags || '') ||
      formData.last_edited !== (noteDetail.last_edited || '') ||
      formData.noteDetails !== (noteDetail.note_details || ''));

  const handleSaveNote = async (e) => {
    e.preventDefault();

    if (newNoteI) {
      // Create new note.
      const { data, error } = await supabase
        .from('notes')
        .insert([
          {
            title: formData.title,
            tags: formData.tags,
            note_details: formData.noteDetails,
          },
        ])
        .select();

      if (error) {
        console.log(error);
      } else if (data) {
        // Clear the form.
        setFormData({ title: '', tags: '', noteDetails: '' });
        // Toggle off the create mode.
        dispatch(noteAction.InitiateCreateNote());
        // Add the new note to the Redux store.
        dispatch(noteAction.addNote(data[0]));
        // set this note as the currently active one.
        dispatch(noteAction.showNoteDetail(data[0]));
      }
    } else {
      // Update mode:
      const { data, error } = await supabase
        .from('notes')
        .update({
          title: formData.title,
          tags: formData.tags,
          note_details: formData.noteDetails,
        })
        .eq('id', noteDetail.id)
        .select();
      if (error) {
        console.log(error);
      }
      if (data) {
        console.log('Updated:', data);
        // Update the note in the Redux store.
        dispatch(noteAction.updateNote(data[0]));
        // Optionally, update the noteDetail so it reflects the updated data.
        dispatch(noteAction.showNoteDetail(data[0]));
      }
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    if (!newNoteI && noteDetail.id) {
      // Reset to original note values in update mode.
      setFormData({
        title: noteDetail.title || '',
        tags: noteDetail.tags || '',
        last_edited: noteDetail.created_at || '',
        noteDetails: noteDetail.note_details || '',
      });
    } else {
      // Clear the form and exit create mode.
      setFormData({ title: '', tags: '', last_edited: '', noteDetails: '' });
      dispatch(noteAction.cancelNote());
      dispatch(noteAction.showNoteDetail(allNotes[0]));
    }
  };

  return (
    <Form onSubmit={handleSaveNote} className="px-6 py-5 flex flex-col border-r-2 border-gray-200" style={{ height: 'calc(100vh - 85px)' }}>
      {/* Title Input */}
      <input
        type="text"
        name="title"
        placeholder="Enter a title..."
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="focus:outline-none placeholder-black text-3xl font-bold w-full"
      />

      <div className="mt-4 flex flex-col flex-1">
        {/* Tags Section */}
        <div className="flex gap-2 py-1 mb-2">
          <div className="flex items-center gap-1 w-[145px]">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path
                stroke="#0E121B"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                d="M3.016 5.966c.003-1.411 1.07-2.677 2.456-2.916.284-.05 3.616-.042 4.995-.041 1.364 0 2.527.491 3.49 1.452 2.045 2.042 4.088 4.085 6.128 6.13 1.208 1.21 1.224 3.066.022 4.28a805.496 805.496 0 0 1-5.229 5.228c-1.212 1.201-3.069 1.186-4.279-.022-2.064-2.058-4.127-4.115-6.182-6.182-.795-.8-1.264-1.766-1.368-2.895-.084-.903-.035-4.26-.033-5.034Z"
                clipRule="evenodd"
              />
              <path
                stroke="#0E121B"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                d="M9.907 8.315a1.607 1.607 0 0 1-1.61 1.583c-.872-.002-1.599-.73-1.594-1.596a1.604 1.604 0 0 1 1.633-1.607c.864.003 1.575.736 1.571 1.62Z"
                clipRule="evenodd"
              />
            </svg>
            <p className="">Tags</p>
          </div>
          <input
            type="text"
            name="tags"
            placeholder="Add tags separated by commas (e.g. Work, Planning)"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            className="focus:outline-none w-full"
          />
        </div>

        {currentPath === '/archive-notes' && (
          <div className="flex gap-2 py-1 mb-2">
            <div className="flex  items-center gap-1 w-[145px]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.65775 6.3478C5.92811 6.07743 6.36646 6.07742 6.63682 6.34778L7.51281 7.22375C7.78317 7.49411 7.78318 7.93245 7.51282 8.20282C7.24246 8.47319 6.80412 8.47319 6.53375 8.20283L5.65777 7.32687C5.3874 7.05651 5.38739 6.61816 5.65775 6.3478ZM7.51267 15.794C7.78312 16.0643 7.78324 16.5026 7.51295 16.7731L5.92417 18.3627C5.65388 18.6332 5.21553 18.6333 4.9451 18.363C4.67466 18.0927 4.67454 17.6545 4.94482 17.384L6.5336 15.7943C6.80389 15.5238 7.24224 15.5237 7.51267 15.794ZM15.1052 15.794C15.3756 15.5237 15.8139 15.5238 16.0842 15.7943L17.673 17.384C17.9433 17.6545 17.9432 18.0927 17.6727 18.363C17.4023 18.6333 16.964 18.6332 16.6937 18.3627L15.1049 16.7731C14.8346 16.5026 14.8347 16.0643 15.1052 15.794Z"
                  fill="#2B303B"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11.308 4.5835C11.6904 4.5835 12.0003 4.89346 12.0003 5.2758V5.93838C12.0003 6.32073 11.6904 6.63069 11.308 6.63069C10.9257 6.63069 10.6157 6.32073 10.6157 5.93838V5.2758C10.6157 4.89346 10.9257 4.5835 11.308 4.5835ZM2.82373 11.9989C2.82373 11.6166 3.13369 11.3066 3.51604 11.3066H5.24746C5.62981 11.3066 5.93977 11.6166 5.93977 11.9989C5.93977 12.3812 5.62981 12.6912 5.24746 12.6912H3.51604C3.13369 12.6912 2.82373 12.3812 2.82373 11.9989ZM16.6764 11.9989C16.6764 11.6166 16.9862 11.3066 17.3687 11.3066H19.6157C19.998 11.3066 20.308 11.6166 20.308 11.9989C20.308 12.3812 19.998 12.6912 19.6157 12.6912H17.3687C16.9862 12.6912 16.6764 12.3812 16.6764 11.9989ZM11.308 17.3672C11.6904 17.3672 12.0003 17.6772 12.0003 18.0596V20.3067C12.0003 20.689 11.6904 20.999 11.308 20.999C10.9257 20.999 10.6157 20.689 10.6157 20.3067V18.0596C10.6157 17.6772 10.9257 17.3672 11.308 17.3672Z"
                  fill="#2B303B"
                />
              </svg>

              <p className="">Status</p>
            </div>
            <input type="text" name="status" value={'Archived'} disabled className="focus:outline-none w-full bg-inherit" />
          </div>
        )}

        <div className="flex gap-2 py-1">
          <div className="flex items-center gap-1 w-[145px]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.2505 3.75C7.69378 3.75 4.00049 7.44329 4.00049 12C4.00049 16.5558 7.69384 20.25 12.2505 20.25C16.8072 20.25 20.5005 16.5558 20.5005 12C20.5005 7.44329 16.8072 3.75 12.2505 3.75ZM2.50049 12C2.50049 6.61487 6.86536 2.25 12.2505 2.25C17.6356 2.25 22.0005 6.61487 22.0005 12C22.0005 17.3841 17.6357 21.75 12.2505 21.75C6.8653 21.75 2.50049 17.3841 2.50049 12Z"
                fill="#2B303B"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.9224 7.82666C12.3366 7.82666 12.6724 8.16245 12.6724 8.57666V12.2493L15.4819 13.9283C15.8375 14.1408 15.9535 14.6013 15.741 14.9569C15.5285 15.3124 15.068 15.4284 14.7124 15.2159L11.5376 13.3186C11.3111 13.1832 11.1724 12.9388 11.1724 12.6748V8.57666C11.1724 8.16245 11.5082 7.82666 11.9224 7.82666Z"
                fill="#2B303B"
              />
            </svg>

            <p className="">Last edited</p>
          </div>
          <input
            type="text"
            name="last_edited"
            placeholder="Not yet saved"
            value={formData.last_edited ? format(new Date(formData.last_edited), 'dd MMM yyyy') : ''}
            disabled
            className="focus:outline-none w-full bg-inherit"
          />
        </div>

        <div className="w-full border-t-2 border-gray-200 my-4"></div>

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
          className="w-full flex-1 focus:outline-none hide-scrollbar"
        />

        <div className="w-full border-t-2 border-gray-200 my-4"></div>

        {/* Footer Buttons */}
        <div className="w-full flex gap-4">
          <button type="submit" className="capitalize text-white bg-blue-500 rounded-lg px-4 py-3 active:scale-95">
            {newNoteI ? 'save note' : 'update note'}
          </button>
          <button
            onClick={handleCancel}
            disabled={!newNoteI && !changesMade}
            className={`capitalize rounded-lg px-4 py-3 active:scale-95 ${!newNoteI && !changesMade ? 'bg-gray-300 text-gray-500' : 'bg-gray-100'}`}
          >
            cancel
          </button>
        </div>
      </div>
    </Form>
  );
}

export default NoteForm;
