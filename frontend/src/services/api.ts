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

export async function getCadastrosOverview() {
  return request('/api/cadastros/overview');
}

export async function createSafra(payload: { name: string; year: number; status: 'planejada' | 'ativa' | 'encerrada' }) {
  return request('/api/cadastros/safras', { method: 'POST', body: JSON.stringify(payload) });
}

export async function createTalhao(payload: { code: string; areaHectares: number; soilType: string; currentSeasonId: string }) {
  return request('/api/cadastros/talhoes', { method: 'POST', body: JSON.stringify(payload) });
}

export async function createLote(payload: { code: string; species: string; breed: string; headCount: number }) {
  return request('/api/cadastros/lotes', { method: 'POST', body: JSON.stringify(payload) });
}

export async function deleteCadastro(type: 'safras' | 'talhoes' | 'lotes', id: string) {
  return request(`/api/cadastros/${type}/${id}`, { method: 'DELETE' });
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
