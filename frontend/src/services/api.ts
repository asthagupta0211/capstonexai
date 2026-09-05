import { StudentProfile, ProjectIdea, ProjectPlan, MentorReview, AuthUser } from '../types/index.js';

// Base URL configuration: Auto-routes to Render in production or uses VITE_API_URL
const getApiBase = (): string => {
  const envUrl = ((import.meta as any).env?.VITE_API_URL as string | undefined)?.trim();
  if (envUrl) {
    return `${envUrl.replace(/\/+$/, '')}/api/v1`;
  }
  // If hosted on Vercel or any non-localhost domain, automatically connect to the live Render backend
  if (typeof window !== 'undefined' && (window.location.hostname.includes('vercel.app') || (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'))) {
    return 'https://capstonexai.onrender.com/api/v1';
  }
  return '/api/v1';
};

const API_BASE = getApiBase();

class ApiService {
  private token: string | null = null;

  constructor() {
    try {
      if (typeof localStorage !== 'undefined') {
        this.token = localStorage.getItem('capstonex_token');
      }
    } catch {
      this.token = null;
    }
  }

  setToken(token: string | null) {
    this.token = token;
    try {
      if (typeof localStorage !== 'undefined') {
        if (token) {
          localStorage.setItem('capstonex_token', token);
        } else {
          localStorage.removeItem('capstonex_token');
        }
      }
    } catch {
      // Non-blocking fallback if storage is restricted
    }
  }

  getToken(): string | null {
    return this.token;
  }

  getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      ...this.getHeaders(),
      ...(options.headers as Record<string, string>),
    };

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const text = await response.text();
    let data: any = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = null;
      }
    }

    if (!response.ok || !data || data.success === false) {
      if (response.status === 405 || response.status === 404) {
        throw new Error(`API endpoint unavailable (${response.status}). Connected to: ${API_BASE}`);
      }
      throw new Error(data?.error || `Request failed with status ${response.status}`);
    }

    return data.data;
  }


  // --- Health & Status ---
  async getHealth(): Promise<{ status: string; database: string; aiProvider: string }> {
    return this.request('/health');
  }

  // --- Authentication ---
  async login(email: string, password: string): Promise<{ token: string; user: AuthUser }> {
    const data = await this.request<{ token: string; user: AuthUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.token);
    return data;
  }

  async register(email: string, password: string, name: string): Promise<{ token: string; user: AuthUser }> {
    const data = await this.request<{ token: string; user: AuthUser }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
    this.setToken(data.token);
    return data;
  }

  async getMe(): Promise<{ user: AuthUser }> {
    return this.request('/auth/me');
  }

  logout() {
    this.setToken(null);
  }

  // --- Profile ---
  async getProfile(): Promise<{ profile: StudentProfile | null }> {
    return this.request('/profile');
  }

  async saveProfile(profile: StudentProfile): Promise<{ profile: StudentProfile }> {
    return this.request('/profile', {
      method: 'POST',
      body: JSON.stringify(profile),
    });
  }

  // --- Ideas ---
  async generateIdeas(profile?: StudentProfile): Promise<{
    ideas: ProjectIdea[];
    isFallback: boolean;
    modelUsed: string;
  }> {
    return this.request('/ideas/generate', {
      method: 'POST',
      body: JSON.stringify({ profile }),
    });
  }

  async listIdeas(savedOnly: boolean = false): Promise<{ ideas: ProjectIdea[] }> {
    return this.request(`/ideas${savedOnly ? '?saved=true' : ''}`);
  }

  async getIdeaById(id: string): Promise<{ idea: ProjectIdea }> {
    return this.request(`/ideas/${id}`);
  }

  async toggleSaveIdea(id: string): Promise<{ idea: ProjectIdea }> {
    return this.request(`/ideas/${id}/save`, {
      method: 'PATCH',
    });
  }

  async deleteIdea(id: string): Promise<void> {
    await this.request(`/ideas/${id}`, {
      method: 'DELETE',
    });
  }

  // --- Plan & Blueprint ---
  async getPlan(ideaId: string): Promise<{
    plan: ProjectPlan;
    isFallback: boolean;
    modelUsed: string;
  }> {
    return this.request(`/ideas/${ideaId}/plan`, {
      method: 'POST',
    });
  }

  async downloadPlanMarkdown(ideaId: string): Promise<string> {
    const headers: Record<string, string> = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    const res = await fetch(`${API_BASE}/plans/export/${ideaId}`, { headers });
    if (!res.ok) throw new Error('Failed to download markdown');
    return await res.text();
  }

  // --- AI Mentor ---
  async analyzeIdea(idea: {
    title: string;
    pitch: string;
    intendedTech?: string;
    targetAudience?: string;
  }): Promise<{
    review: MentorReview;
    isFallback: boolean;
    modelUsed: string;
  }> {
    return this.request('/mentor/analyze', {
      method: 'POST',
      body: JSON.stringify(idea),
    });
  }

  async listMentorReviews(): Promise<{ reviews: MentorReview[] }> {
    return this.request('/mentor/reviews');
  }
}

export const api = new ApiService();
