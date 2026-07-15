export type CustomerStatus = "pending" | "permitted" | "blocked";

export interface Customer {
  id: string;
  referenceCode: string;
  title: string;
  fullName: string;
  country: string;
  phone: string;
  email: string;
  status: CustomerStatus;
}

export interface AuthResponse {
  accessToken: string;
  user: Customer;
}

export interface RegisterPayload {
  title: string;
  name: string;
  country: string;
  telephone: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UpdateProfilePayload {
  title?: string;
  name?: string;
  country?: string;
  telephone?: string;
}
