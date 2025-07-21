// src/types/auth.ts

export interface RegisterForm {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  contactNumber: string;
  password: string;
  confirmPassword: string;
  agree: boolean;
}
export interface LoginForm {
  email: string;
  password: string;
}
