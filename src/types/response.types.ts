export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface AuthResponse {
  token: string;
  user: {
    email: string;
    name: string;
    role: string;
  };
} 