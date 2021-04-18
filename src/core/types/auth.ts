export interface TokenData {
  access_token: string | null;
  token_type: string;
  notValid?: boolean;
}

export interface UserCredentials {
  username: string;
  password: string;
}
