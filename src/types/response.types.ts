export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface AuthResponse {
  token?: string;
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