//this should be on a npm package to be type-safe cross app
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

export interface ApiClientStats {
  averageAge: number;
  standardDeviation: number;
}

export interface ApiClientWithDeathDate extends ApiClient {
  expectedDeathDate: Date;
}
