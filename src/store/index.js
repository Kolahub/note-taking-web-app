import { configureStore, createSlice, combineReducers } from '@reduxjs/toolkit';

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
  name: 'note',
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
      state.filteredNotes = allAndArchiveNotes.filter((note) => note.tags.includes(action.payload));
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
      state.searchQueryNotes = allAndArchiveNotes.filter((note) => {
        const tagsArray = [
          ...new Set(
            allAndArchiveNotes
              .map((note) => note.tags)
              .join(',')
              .split(',')
          ),
        ];
        return (
          tagsArray.some((tag) => String(tag).toLowerCase().includes(query)) ||
          note.title?.toLowerCase().includes(query) ||
          note.note_details?.toLowerCase().includes(query)
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
    },
  },
});

const toastInitialState = {
  show: false,
  message: '',
  subText: '',
};

const toastSlice = createSlice({
  name: 'toast',
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

const mobileInitialState = {
  showNote: false,
  showSearch: false,
  showTag: false,
  showTaggedNotes: false,
  previousView: null,
};

const mobileSlice = createSlice({
  name: 'mobile',
  initialState: mobileInitialState,
  reducers: {
    callShowNote(state) {
      if (state.showTaggedNotes) {
        state.previousView = 'taggedNotes';
      } else if (state.showTag) {
        state.previousView = 'tag';
      } else if (state.showSearch) {
        state.previousView = 'search';
      } else {
        state.previousView = 'home';
      }

      state.showNote = true;
      state.showSearch = false;
      state.showTag = false;
      state.showTaggedNotes = false;
    },
    callHideNote(state) {
      state.showNote = false;

      if (state.previousView === 'taggedNotes') {
        state.showTaggedNotes = true;
      } else if (state.previousView === 'tag') {
        state.showTag = true;
      } else if (state.previousView === 'search') {
        state.showSearch = true;
      }

      state.previousView = null;
    },
    callShowSearch(state) {
      state.previousView = null;
      state.showSearch = true;
      state.showNote = false;
      state.showTag = false;
      state.showTaggedNotes = false;
    },
    callHideSearch(state) {
      state.showSearch = false;
    },
    callShowTag(state) {
      state.previousView = null;
      state.showTag = true;
      state.showNote = false;
      state.showSearch = false;
      state.showTaggedNotes = false;
    },
    callHideTag(state) {
      state.showTag = false;
    },
    callShowTaggedNotes(state) {
      state.previousView = 'tag';
      state.showTaggedNotes = true;
      state.showTag = false;
      state.showNote = false;
      state.showSearch = false;
    },
    callHideTaggedNotes(state) {
      state.showTaggedNotes = false;
    },
  },
});

const rootReducer = combineReducers({
  note: noteSlice.reducer,
  toast: toastSlice.reducer,
  mobile: mobileSlice.reducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export const noteAction = noteSlice.actions;
export const toastAction = toastSlice.actions;
export const mobileAction = mobileSlice.actions;

export default store;
