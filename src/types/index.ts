export interface UserSignupData {
  email: string;
  password?: string;
  name: string;
  phone?: string;
  birth?: string;
  department: "ceo" | "hr" | "sales" | "marketing" | "design" | "development" | "other";
  register_type?: 'normal' | 'google';
  social_id?: string;
  role?: 'user' | 'manager' | 'admin' | 'superadmin';
}
