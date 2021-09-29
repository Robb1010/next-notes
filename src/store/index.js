import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  //States
  state: {
    credentials: {},
    loggedIn: false,
    notes: {},
    categories: [],
    favorites: [],
    current: null,
    textChange: false,
    loading: false,
    error: false,
    errorMsg: 'Test',
    locale: 'en',
    noteLoading: false,
    span: 12,
    editorVisibility: true,
    viewerVisibility: true,
    viewCycle: 0,
    keep: false
  },

  // Getters
  getters: {
    categories: state => {
      let categories = [];
      Object.entries(state.notes).forEach(note => {
        if (note[1].category !== "" && !categories.includes(note[1].category)) {
          categories.push(note[1].category);
        }
      });
      return categories;
    },
    favorites: state => {
      let favorites = [];
      Object.entries(state.notes).forEach(note => {
        if (note[1].favorite) {
          favorites.push(note[0]);
        }
      });
      return favorites;
    },
    note: state => (id) => {
      return state.notes[id];
    },
    current: state => {
      return state.current;
    }
  },

  // Mutations
  mutations: {
    changeLogStatus(state) {
      state.loggedIn = !state.loggedIn
    },
    setNotes(state, notes) {
      notes.map(note => {
        state.notes[note.id] = note;
      })
    },
    updateNote(state, note) {
      state.notes[note.id] = note;
    },
    setCurrent(state, current) {
      state.current = current;
    },
    setCredentials(state, credentials) {
      state.credentials = credentials;
    },
    setLoading(state, load) {
      state.loading = load;
    },
    triggerError(state, timeout) {
      state.error = true;
      setTimeout(() => {
        state.error = false;
      }, timeout);
    },
    setErrorMsg(state, msg) {
      state.errorMsg = msg;
    },
    setLocale(state, locale) {
      state.locale = locale;
    },
    setNoteLoading(state, loading) {
      state.noteLoading = loading;
    },
    createNote(state, note) {
      state.notes[note.id] = note;
    },
    deleteNote(state, noteId) {
      state.categories = [];
      delete state.notes[noteId];
      Object.entries(state.notes).forEach(note => {
        if (note[1].category !== "" && !state.categories.includes(note[1].category)) {
          state.categories.push(note[1].category);
        }
      });
    },
    updateCategories(state) {
      Object.entries(state.notes).forEach(note => {
        if (note[1].category !== "" && !state.categories.includes(note[1].category)) {
          state.categories.push(note[1].category);
        }
      });
    },
    updateFavorites(state) {
      let favorites = [];
      Object.entries(state.notes).forEach(note => {
        if (note[1].favorite) {
          favorites.push(note[0]);
        }
      });
      state.favorites = favorites;
    },
    setSpan(state, span) {
      state.span = span;
    },
    setViewCycle(state, viewCycle) {
      state.viewCycle = viewCycle;
    },
    setEditorVisibility(state, editorVisibility) {
      state.editorVisibility = editorVisibility;
    },
    setViewerVisibility(state, viewerVisibility) {
      state.viewerVisibility = viewerVisibility;
    },
    setKeep(state, keep) {
      state.keep = keep;
    }
  },

  actions: {
    async triggerError({ commit }, args) {
      commit("setErrorMsg", args.message);
      await commit("triggerError", args.timeout);
      commit("setErrorMsg", args.message);
    }
  }
})
