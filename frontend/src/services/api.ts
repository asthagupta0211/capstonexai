import { StudentProfile, ProjectIdea, ProjectPlan, MentorReview, AuthUser } from '../types/index.js';

// Base URL configuration: Supports Vercel frontend talking to Render backend via VITE_API_URL
const RAW_API_URL = ((import.meta as any).env?.VITE_API_URL as string | undefined)?.trim() || '';
const API_BASE = RAW_API_URL ? `${RAW_API_URL.replace(/\/+$/, '')}/api/v1` : '/api/v1';



class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('capstonex_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('capstonex_token', token);
    } else {
      localStorage.removeItem('capstonex_token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok || data.success === false) {
      throw new Error(data.error || `Request failed with status ${response.status}`);
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
