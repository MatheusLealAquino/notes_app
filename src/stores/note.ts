import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';

import { Note } from '../components/models';

import {
  addNote,
  getNote,
  getNotes,
  updateNote,
  deleteNote,
} from '../service/note.service';

export const useNoteStore = defineStore('note', {
  state: () => ({
    notes: useStorage('notes', [] as Note[]),
  }),
  getters: {
    getAllNotes(): Note[] {
      return this.notes;
    },
  },
  actions: {
    async addNote({ title }: { title: string }) {
      const foundFolder = this.notes.find((note) => note.title === title);
      if (foundFolder) return;

      const toInsert = {
        title,
        noteData: '',
        createdAt: new Date(),
      };

      const addedNote = await addNote(toInsert);

      this.notes.push({
        id: addedNote.id,
        ...toInsert,
      });
    },
    getNoteById({ id }: { id: string }) {
      const localNote = this.notes.find((note) => note.id === id);
      if (localNote) return localNote;

      return getNote({
        id,
      });
    },
    updateTitle({ id, title }: { id: string; title: string }) {
      const index = this.notes.findIndex((note) => note.id === id);
      if (this.notes[index]) {
        this.notes[index].title = title;
        this.notes[index].updatedAt = new Date();
      }
    },
    updateText({ id, text }: { id: string; text: string }) {
      const index = this.notes.findIndex((note) => note.id === id);
      if (this.notes[index]) {
        this.notes[index].noteData = text;
        this.notes[index].updatedAt = new Date();
      }
    },
    removeNote({ id }: { id: string }) {
      const index = this.notes.findIndex((note) => note.id === id);
      this.notes.splice(index, 1);
    },
  },
});
