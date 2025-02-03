// store.js
import { configureStore, createSlice } from "@reduxjs/toolkit";

const noteInitialState = {
  notes: [],
  noteDetail: {},
  newNoteI: false,
};

const noteSlice = createSlice({
  name: "note",
  initialState: noteInitialState,
  reducers: {
    allNotes(state, action) {
      state.notes = action.payload;
    },
    InitiateCreateNote(state) {
      state.newNoteI = !state.newNoteI;
      state.noteDetail = {}; // clear any existing detail
    },
    showNoteDetail(state, action) {
      state.noteDetail = action.payload;
      state.newNoteI = false; // ensure we’re not in create mode
    },
    cancelNote(state) {
      state.newNoteI = false;
      // Optionally clear noteDetail if you want:
      // state.noteDetail = {};
    },
    // New reducer to add a note to the array.
    addNote(state, action) {
      // Prepend the new note (if you want it to appear at the top).
      state.notes.unshift(action.payload);
    },
    // New reducer to update an existing note in the array.
    updateNote(state, action) {
      const updatedNote = action.payload;
      const index = state.notes.findIndex((note) => note.id === updatedNote.id);
      if (index !== -1) {
        state.notes[index] = updatedNote;
      }
    },

    deleteNote(state, action) {
        const index = state.notes.findIndex((note) => note.id === action.payload);
        if (index !== -1) {
            state.notes.splice(index, 1);
        }
        // Set the new first note as the active one
        state.noteDetail = state.notes.length > 0 ? state.notes[0] : {};
    }
    
  },
});

export const noteAction = noteSlice.actions;

const store = configureStore({
  reducer: noteSlice.reducer,
});

export default store;
