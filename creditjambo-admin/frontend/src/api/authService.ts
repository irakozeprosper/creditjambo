import api from "./axiosInstance";

export interface LoginDTO {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
  };
}

export const authService = {
  async login(credentials: LoginDTO): Promise<LoginResponse> {
    const { data } = await api.post(`/auth/login`, credentials);
    localStorage.setItem("token", data.token);
    return data;
  },

  async getProfile(): Promise<LoginResponse> {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const { data } = await api.get(`/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Profile data:", data);
    return data;
  },

  logout() {
    localStorage.removeItem("token");
  },
};
