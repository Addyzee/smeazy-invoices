export interface RegistrationFormType {
  full_name: string;
  phone_number: string;
  password: string;
}

export interface LoginFormType {
  phone_number: string;
  password: string;
}

export interface UserType {
  phone_number: string;
  full_name: string;
  username: string;
  created_at: string;
}

export interface TokenType {
  access_token: string;
  token_type: string;
  username: string
}