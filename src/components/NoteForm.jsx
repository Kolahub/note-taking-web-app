// NoteForm.js
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form } from "react-router-dom";
import supabase from "../config/SupabaseConfig";
import { noteAction } from "../store";
import { format } from "date-fns";

function NoteForm() {
  const allNotes = useSelector((state) => state.notes);
  const newNoteI = useSelector((state) => state.newNoteI);
  const noteDetail = useSelector((state) => state.noteDetail);
  const dispatch = useDispatch();

  // Always use controlled inputs.
  const [formData, setFormData] = useState({
    title: "",
    tags: "",
    last_edited: "",
    noteDetails: "",
  });

  // On update mode, initialize formData with noteDetail.
  useEffect(() => {
    if (!newNoteI && noteDetail.id) {
      setFormData({
        title: noteDetail.title || "",
        tags: noteDetail.tags || "",
        last_edited: noteDetail.created_at || "",
        noteDetails: noteDetail.note_details || "",
      });
    }

    if (newNoteI) {
      setFormData({ title: "", tags: "", last_edited: "", noteDetails: "" });
    }
  }, [newNoteI, noteDetail]);

  // Check if any changes were made in update mode.
  const changesMade =
    !newNoteI &&
    noteDetail.id &&
    (formData.title !== (noteDetail.title || "") ||
      formData.tags !== (noteDetail.tags || "") ||
      formData.last_edited !== (noteDetail.last_edited || "") ||
      formData.noteDetails !== (noteDetail.note_details || ""));

  const handleSaveNote = async (e) => {
    e.preventDefault();

    if (newNoteI) {
      // Create new note.
      const { data, error } = await supabase
        .from("notes")
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
        setFormData({ title: "", tags: "", noteDetails: "" });
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
        .from("notes")
        .update({
          title: formData.title,
          tags: formData.tags,
          note_details: formData.noteDetails,
        })
        .eq("id", noteDetail.id)
        .select();
      if (error) {
        console.log(error);
      }
      if (data) {
        console.log("Updated:", data);
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
        title: noteDetail.title || "",
        tags: noteDetail.tags || "",
        last_edited: noteDetail.created_at || "",
        noteDetails: noteDetail.note_details || "",
      });
    } else {
      // Clear the form and exit create mode.
      setFormData({ title: "", tags: "", last_edited: "", noteDetails: "" });
      dispatch(noteAction.cancelNote());
      dispatch(noteAction.showNoteDetail(allNotes[0]));
    }
  };

  return (
    <Form
      onSubmit={handleSaveNote}
      className="px-6 py-5 flex flex-col border-r-2 border-gray-200"
      style={{ height: "calc(100vh - 85px)" }}
    >
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
        <div className="flex gap-2 py-1">
          <p className="w-[125px]">Tags</p>
          <input
            type="text"
            name="tags"
            placeholder="Add tags separated by commas (e.g. Work, Planning)"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            className="focus:outline-none w-full"
          />
        </div>

        <div className="flex gap-2 py-1">
          <p className="w-[125px]">Last edited</p>
          <input
            type="text"
            name="last_edited"
            placeholder="Not yet saved"
            value={
              formData.last_edited
                ? format(new Date(formData.last_edited), "dd MMM yyyy")
                : ""
            }
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
          onChange={(e) =>
            setFormData({ ...formData, noteDetails: e.target.value })
          }
          style={{
            overflow: "auto",
            resize: "none",
            WebkitOverflowScrolling: "touch",
          }}
          className="w-full flex-1 focus:outline-none hide-scrollbar"
        />

        <div className="w-full border-t-2 border-gray-200 my-4"></div>

        {/* Footer Buttons */}
        <div className="w-full flex gap-4">
          <button
            type="submit"
            className="capitalize text-white bg-blue-500 rounded-lg px-4 py-3 active:scale-95"
          >
            {newNoteI ? "save note" : "update note"}
          </button>
          <button
            onClick={handleCancel}
            disabled={!newNoteI && !changesMade}
            className={`capitalize rounded-lg px-4 py-3 active:scale-95 ${
              !newNoteI && !changesMade
                ? "bg-gray-300 text-gray-500"
                : "bg-gray-100"
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
