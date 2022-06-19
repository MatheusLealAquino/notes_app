import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';

import { Note } from '../components/models';

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
    addNote({ title }: { title: string }) {
      const foundFolder = this.notes.find((note) => note.title === title);
      if (foundFolder) return;

      this.notes.push({
        id: new Date().getTime().toString(),
        title,
        noteData: '',
        createdAt: new Date(),
      });
    },
    getNoteById({ id }: { id: string }) {
      return this.notes.find((note) => note.id === id);
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
