
export type User = {
  id?: number;
  email: string;
  password: string;
}

export type Session = {
  id: string;
  expires_at: number;
  user_id: number;
}

export type Training = {
  id?: number;
  title: string;
  image: string;
  description: string;
}

export type AuthFormMode = 'login' | 'signup'
