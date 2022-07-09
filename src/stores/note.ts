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
    async syncNotes({ userId }: { userId: string }) {
      const notes = await getNotes({
        userId,
      });
      this.notes = notes;
      return notes;
    },
    async addNote({ userId, title }: { userId: string; title: string }) {
      const foundFolder = this.notes.find((note) => note.title === title);
      if (foundFolder) return;

      const toInsert = {
        title,
        noteData: '',
        createdAt: new Date(),
        userId,
      };

      const addedNote = await addNote(toInsert);

      this.notes.push({
        id: addedNote.id,
        ...toInsert,
      });
    },
    async getNoteById({ id }: { id: string }) {
      const localNote = this.notes.find((note) => note.id === id);
      if (localNote) return localNote;

      return getNote({
        id,
      });
    },
    async updateTitle({ id, title }: { id: string; title: string }) {
      const index = this.notes.findIndex((note) => note.id === id);
      const note = this.notes[index];
      if (note) {
        note.title = title;
        note.updatedAt = new Date();
        await updateNote({
          id: note.id,
          title,
        });
      }
    },
    async updateText({ id, text }: { id: string; text: string }) {
      const index = this.notes.findIndex((note) => note.id === id);

      const note = this.notes[index];
      if (note) {
        note.noteData = text;
        note.updatedAt = new Date();
        await updateNote({
          id: note.id,
          noteData: text,
        });
      }
    },
    async removeNote({ id }: { id: string }) {
      const index = this.notes.findIndex((note) => note.id === id);
      this.notes.splice(index, 1);
      await deleteNote({ id });
    },
    clearLocalNotes() {
      this.notes = [];
    },
  },
});
