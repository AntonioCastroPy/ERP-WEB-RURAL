import { EntityKey, PaginatedResult } from '../types/entity';

const BASE_URL = import.meta.env.VITE_API_URL ?? '';

async function request(path: string, init?: RequestInit) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {})
    },
    ...init
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Erro HTTP ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export async function getBootstrap() {
  return request('/api/bootstrap');
}

interface EntityListQuery {
  page: number;
  pageSize: number;
  q?: string;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

function toQuery(query: EntityListQuery) {
  const params = new URLSearchParams();
  params.set('page', String(query.page));
  params.set('pageSize', String(query.pageSize));
  if (query.q) params.set('q', query.q);
  if (query.sortField) params.set('sortField', query.sortField);
  if (query.sortDirection) params.set('sortDirection', query.sortDirection);
  return params.toString();
}

export async function listEntity<T>(entity: EntityKey, query: EntityListQuery): Promise<PaginatedResult<T>> {
  return request(`/api/cadastros/${entity}?${toQuery(query)}`);
}

export async function getEntityById<T>(entity: EntityKey, id: string): Promise<T> {
  return request(`/api/cadastros/${entity}/${id}`);
}

export async function createEntity<T>(entity: EntityKey, payload: Record<string, unknown>): Promise<T> {
  return request(`/api/cadastros/${entity}`, { method: 'POST', body: JSON.stringify(payload) });
}

export async function updateEntity<T>(entity: EntityKey, id: string, payload: Record<string, unknown>): Promise<T> {
  return request(`/api/cadastros/${entity}/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
}

export async function deleteEntity(entity: EntityKey, id: string) {
  return request(`/api/cadastros/${entity}/${id}`, { method: 'DELETE' });
}

export async function getAbc(period: string) {
  return request(`/api/abc/${period}`);
}

export async function pushSync(tenantId: string, operations: unknown[]) {
  return request('/api/sync/push', {
    method: 'POST',
    body: JSON.stringify({ tenantId, operations })
  });
}

export async function getSyncQueue() {
  return request('/api/sync/queue');
}
