import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  updateDoc,
  getDocs,
  getDoc,
} from 'firebase/firestore';

import { db } from '../boot/firebaseConnection';

import { Note } from '../components/models';

const COLLECTION_NAME = 'note';

const collectionInstance = collection(db, COLLECTION_NAME);

export function addNote(note: Partial<Note>) {
  return addDoc(collectionInstance, note);
}

export function getNotes() {
  return getDocs(collectionInstance);
}

export async function getNote({ id }: { id: string }) {
  const docRef = doc(db, COLLECTION_NAME, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) return docSnap.data();
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
  const dto: { title?: string; noteData?: string } = {};
  if (title) dto.title = title;
  if (noteData) dto.noteData = noteData;

  return updateDoc(docRef, dto);
}

export async function deleteNote({ id }: { id: string }) {
  return deleteDoc(doc(db, COLLECTION_NAME, id));
}
