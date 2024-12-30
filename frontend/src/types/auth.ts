export interface LoginFormData {
  email: string;
  password: string;
  role: 'user' | 'admin';
}

export interface RegisterFormData extends LoginFormData {
  name: string;
}