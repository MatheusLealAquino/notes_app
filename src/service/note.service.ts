import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  updateDoc,
  getDocs,
  getDoc,
  query,
  where,
} from 'firebase/firestore';

import { db } from '../boot/firebaseConnection';

import { Note } from '../components/models';

const COLLECTION_NAME = 'note';

const collectionInstance = collection(db, COLLECTION_NAME);

export function addNote(note: Partial<Note>) {
  return addDoc(collectionInstance, note);
}

export async function getNotes({
  userId,
}: {
  userId: string;
}): Promise<Note[]> {
  const q = query(collectionInstance, where('userId', '==', userId));
  const notes = await getDocs(q);
  return notes.docs.map((note) => ({
    id: note.id,
    ...note.data(),
  })) as Note[];
}

export async function getNote({ id }: { id: string }): Promise<Note | null> {
  const docRef = doc(db, COLLECTION_NAME, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as Note;
  }

  return null;
}

export function updateNote({
  id,
  title,
  noteData,
}: {
  id: string;
  title?: string;
  noteData?: string;
}) {
  const docRef = doc(db, COLLECTION_NAME, id);
  const dto: {
    title?: string;
    noteData?: string;
    updatedAt: Date;
  } = {
    updatedAt: new Date(),
  };

  if (title) dto.title = title;
  if (noteData) dto.noteData = noteData;

  return updateDoc(docRef, dto);
}

export async function deleteNote({ id }: { id: string }) {
  return deleteDoc(doc(db, COLLECTION_NAME, id));
}
