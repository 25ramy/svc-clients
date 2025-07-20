export interface ApiCreateClient {
  name: string;
  lastName: string;
  age: number;
  birthDate: string;
}

export interface ApiClient {
  id: number;
  name: string;
  lastName: string;
  age: number;
  birthDate: Date;
}
