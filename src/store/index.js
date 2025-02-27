// store.js
import { configureStore, createSlice, combineReducers } from "@reduxjs/toolkit";

const noteInitialState = {
  notes: [],
  archivedNotes: [],
  noteDetail: {},
  filteredNotes: [],
  filteredTag: null,
  searchQuery: null,
  searchQueryNotes: [],
  newNoteI: false,
  settingsActive: false,
  activeSettings: null,
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
      state.newNoteI = true;
      state.noteDetail = {};
      state.filteredTag = null;
      state.searchQuery = '';
      state.searchQueryNotes = [];
    },
    clearFilters(state) {
      state.filteredTag = null;
      state.searchQuery = '';
      state.searchQueryNotes = [];
    },
    showNoteDetail(state, action) {
      state.noteDetail = action.payload;
    },
    cancelNote(state) {
      state.newNoteI = false;
    },
    addNote(state, action) {
      state.notes.unshift(action.payload);
    },
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
      state.noteDetail = state.notes.length > 0 ? state.notes[0] : {};
    },
    filterBasedTags(state, action) {
      const allAndArchiveNotes = [...state.notes, ...state.archivedNotes];
      state.filteredNotes = allAndArchiveNotes.filter(note => note.tags.includes(action.payload));
      state.filteredTag = action.payload;
    },
    allSearchQueryNotes(state, action) {
      state.settingsActive = false;
      const allAndArchiveNotes = [...state.notes, ...state.archivedNotes];
      state.filteredTag = null;
      if (!action.payload || typeof action.payload !== 'string') {
        state.searchQueryNotes = [];
        state.searchQuery = '';
        return;
      }
      const query = action.payload.trim().toLowerCase();
      state.searchQueryNotes = allAndArchiveNotes.filter(note => {
        const tagsArray = [...new Set(allAndArchiveNotes.map((note) => note.tags).join(',').split(','))];
        return (
          tagsArray.some(tag => String(tag).toLowerCase().includes(query)) || 
          (note.title?.toLowerCase().includes(query)) ||
          (note.note_details?.toLowerCase().includes(query))
        );
      });
      state.searchQuery = action.payload;
    },
    toggleOpenSettings(state) {
      state.settingsActive = !state.settingsActive;
    },
    cancelActiveSettings(state) {
      state.settingsActive = false;
    },
    applyActiveSettings(state, action) {
      state.activeSettings = action.payload;
    }
  },
});

const toastInitialState = {
  show: false,
  message: '',
  subText: '',
};

const toastSlice = createSlice({
  name: "toast",
  initialState: toastInitialState,
  reducers: {
    showToast(state, action) {
      state.show = true;
      state.message = action.payload.message;
      state.subText = action.payload.subText;
    },
    hideToast(state) {
      state.show = false;
      state.message = '';
      state.subText = '';
    },
  },
});

const rootReducer = combineReducers({
  note: noteSlice.reducer,
  toast: toastSlice.reducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export const noteAction = noteSlice.actions;
export const toastAction = toastSlice.actions;

export default store;
