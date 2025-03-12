export interface LoginFormData {
  email: string;
  password: string;
  role: 'INSTRUCTOR' | 'STUDENT';
}

export interface RegisterFormData extends LoginFormData {
  name: string;
}

export interface ProfileFormData {
  name?: string;
  oldPassword?: string;
  newPassword?: string;
  profileImage?: File;
}