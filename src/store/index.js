// store.js
import { configureStore, createSlice } from "@reduxjs/toolkit";

const noteInitialState = {
  notes: [],
  archivedNotes: [],
  noteDetail: {},
  filteredNotes: [],
  filteredTag: null,
  searchQuery: null,
  searchQueryNotes: [],
  newNoteI: false,
};

const noteSlice = createSlice({
  name: "note",
  initialState: noteInitialState,
  reducers: {
    allNotes(state, action) {
      state.notes = action.payload;
    },
    allArchivedNotes(state, action) {
      state.archivedNotes = action.payload;
    },

    InitiateCreateNote(state) {
      state.newNoteI = true; // Instead of toggling
      state.noteDetail = {}; 
      state.filteredTag = null;
      state.searchQuery = '';
      state.searchQueryNotes = [];
    },
    
    // clearFilters(state) {
    //   state.filteredTag = null;
    //   state.searchQuery = '';
    //   state.searchQueryNotes = [];
    // },
    
    showNoteDetail(state, action) {
      state.noteDetail = action.payload;
      // Only reset newNoteI if we're showing an existing note with an ID.
      // if (action.payload && action.payload.id) {
      //   state.newNoteI = false;
      // }
    },
    
    
    cancelNote(state) {
      state.newNoteI = false;
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
    },
    
    filterBasedTags(state, action) {
      const allAndArchiveNotes = [...state.notes, ...state.archivedNotes]
      state.filteredNotes = allAndArchiveNotes.filter(note => note.tags.includes(action.payload));
      state.filteredTag = action.payload;
    },

    allSearchQueryNotes(state, action) {
      const allAndArchiveNotes = [...state.notes, ...state.archivedNotes];
    
      if (!action.payload || typeof action.payload !== 'string') {
        state.searchQueryNotes = [];
        state.searchQuery = '';
        return;
      }
    
      const query = action.payload.trim().toLowerCase();
    
      state.searchQueryNotes = allAndArchiveNotes.filter(note => {
      const allAndArchiveNotes = [...state.notes, ...state.archivedNotes];
        const tagsArray = [...new Set(allAndArchiveNotes.map((note) => note.tags).join(',').split(','))];
    
        return (
          tagsArray.some(tag => String(tag).toLowerCase().includes(query)) || 
          (note.title?.toLowerCase().includes(query)) ||
          (note.note_details?.toLowerCase().includes(query))
        );
      });
    
      state.searchQuery = action.payload;
    }
  },
});

export const noteAction = noteSlice.actions;

const store = configureStore({
  reducer: noteSlice.reducer,
});

export default store;
