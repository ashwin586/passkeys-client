import { SubmitHandler } from "react-hook-form";

export interface authInterface {
  email: string;
  password: string;
}

export interface addPassword {
  id: string;
  name: string;
  url: string;
  userName: string;
  password: string;
}

export interface inputProps {
  label: string;
  id: string;
  defaultValue: string;
}

export interface AuthComponentProps {
  mode: string;
  submitHandler: SubmitHandler<authInterface>;
}

export interface AddPasswordProps {
  open: boolean;
  handleClose: () => void;
  submitHandler: SubmitHandler<addPassword>;
  selectedCredential?: addPassword | null
}

export interface ProfileComponentProps {
  heading: string;
  description: string;
  onClick?: () => void;
}

export interface TokenProps {
  email: string;
  exp: number;
  iat: number;
  role: string;
}

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastInterface {
  showToast: (message: string, severity?: ToastType) => void;
}

export interface User {
  name: string;
  email: string;
  createdAt: string;
}

export interface ProfileInfo {
  name: string;
  email: string;
  currentPassword: string;
  newPassword: string;
}

export interface ApiError {
  message: string;
}

export interface UserPasswords {
  id: string;
  name: string;
  url: string;
  userName: string;
  password: string;
  handleEditButton?: () => void;
  handleDeleteButton?: () => void;
}

export interface CSVData {
  name: string;
  url: string;
  username: string;
  password: string;
}

export interface PasswordCardProps {
  id: string;
  name: string;
  url: string;
  userName: string;
  password: string;
  handleEditButton: () => void;
  handleDeleteButton: () => void;
}