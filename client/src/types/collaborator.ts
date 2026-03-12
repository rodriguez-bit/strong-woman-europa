export interface Collaborator {
  id: number;
  name: string;
  country: string;
  city: string | null;
  profession: string;
  bio: string | null;
  what_makes_special: string | null;
  notable_achievements: string | null;
  profile_image_url: string | null;
  instagram_handle: string | null;
  instagram_followers: number;
  tiktok_handle: string | null;
  tiktok_followers: number;
  youtube_handle: string | null;
  youtube_followers: number;
  twitter_handle: string | null;
  twitter_followers: number;
  email: string | null;
  phone: string | null;
  manager_name: string | null;
  manager_email: string | null;
  manager_phone: string | null;
  contact_status: string;
  contact_method: string | null;
  project_phase: string;
  priority: string;
  assigned_to: string | null;
  relevance_score: number;
  total_followers: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  contacts?: ContactLog[];
}

export interface ContactLog {
  id: number;
  collaborator_id: number;
  date: string;
  method: string;
  direction: string;
  note: string;
  created_by: string | null;
  follow_up_date: string | null;
  follow_up_done: number;
  collaborator_name?: string;
  country?: string;
  profession?: string;
}

export interface CollaboratorFilters {
  country?: string;
  profession?: string;
  contact_status?: string;
  project_phase?: string;
  priority?: string;
  follower_min?: number;
  follower_max?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AISuggestion {
  name: string;
  country: string;
  city?: string;
  profession: string;
  instagram_handle?: string;
  instagram_followers_estimate?: number;
  tiktok_handle?: string;
  tiktok_followers_estimate?: number;
  why_good_fit: string;
  relevance_score_estimate: number;
  known_contact_approach?: string;
  notable_achievements?: string;
}

export interface DashboardStats {
  total: number;
  byPhase: { project_phase: string; count: number }[];
  byCountry: { country: string; count: number }[];
  byProfession: { profession: string; count: number }[];
  byStatus: { contact_status: string; count: number }[];
  byPriority: { priority: string; count: number }[];
  responseRate: number;
  avgRelevance: number;
}
