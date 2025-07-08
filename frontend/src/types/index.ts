export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

export interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
}

export interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}