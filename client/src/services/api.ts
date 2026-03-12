const BASE = '/api/v1';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(BASE + url, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// Collaborators
export const collaboratorsApi = {
  list: (params?: Record<string, any>) => {
    const qs = params ? '?' + new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== '').map(([k, v]) => [k, String(v)])
    ).toString() : '';
    return request<any>(`/collaborators${qs}`);
  },
  get: (id: number) => request<any>(`/collaborators/${id}`),
  create: (data: any) => request<any>('/collaborators', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => request<any>(`/collaborators/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request<any>(`/collaborators/${id}`, { method: 'DELETE' }),
  updateStatus: (id: number, data: any) => request<any>(`/collaborators/${id}/status`, { method: 'PATCH', body: JSON.stringify(data) }),
};

// Outreach
export const outreachApi = {
  listContacts: (collaboratorId: number) => request<any>(`/collaborators/${collaboratorId}/contacts`),
  addContact: (collaboratorId: number, data: any) => request<any>(`/collaborators/${collaboratorId}/contacts`, { method: 'POST', body: JSON.stringify(data) }),
  updateContact: (id: number, data: any) => request<any>(`/contacts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteContact: (id: number) => request<any>(`/contacts/${id}`, { method: 'DELETE' }),
  markDone: (id: number) => request<any>(`/contacts/${id}/done`, { method: 'PATCH' }),
  getFollowUps: (dueBefore?: string) => {
    const qs = dueBefore ? `?due_before=${dueBefore}` : '';
    return request<any>(`/follow-ups${qs}`);
  },
};

// Dashboard
export const dashboardApi = {
  getStats: () => request<any>('/dashboard/stats'),
  getTopProspects: (limit?: number) => request<any>(`/dashboard/top-prospects${limit ? `?limit=${limit}` : ''}`),
  getTimeline: (limit?: number) => request<any>(`/dashboard/timeline${limit ? `?limit=${limit}` : ''}`),
};

// AI
export const aiApi = {
  suggest: (query: string) => request<any>('/ai/suggest', { method: 'POST', body: JSON.stringify({ query }) }),
  analyze: (id: number) => request<any>(`/ai/analyze/${id}`, { method: 'POST' }),
  bulkRecommend: (criteria: any) => request<any>('/ai/bulk-recommend', { method: 'POST', body: JSON.stringify({ criteria }) }),
};

// Import
export const importApi = {
  uploadCSV: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(BASE + '/import/csv', { method: 'POST', body: formData });
    if (!res.ok) throw new Error('Upload failed');
    return res.json();
  },
};
