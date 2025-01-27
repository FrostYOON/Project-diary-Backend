export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface AuthResponse {
  accessToken?: string;
  user: {
    email: string;
    password?: string;
    name: string;
    phone?: string;
    birth?: Date;
    registerType?: string;
    socialId?: string;
    role: string;
    department: string;
  };
}

export interface LoginResponse {
  accessToken?: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
} 