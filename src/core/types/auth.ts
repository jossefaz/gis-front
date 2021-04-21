export interface TokenData {
  token: string | null;
  token_type: string;
  notValid?: boolean;
}

export interface UserCredentials {
  username: string;
  password: string;
}
