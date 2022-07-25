export interface Note {
  id: string;
  title: string;
  noteData: string;
  orderIndex: number;
  createdAt: Date;
  updatedAt?: Date;
  userId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  lastLoginAt?: Date;
}
