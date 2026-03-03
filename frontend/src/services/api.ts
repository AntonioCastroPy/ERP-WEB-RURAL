const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

export async function getBootstrap() {
  const res = await fetch(`${BASE_URL}/api/bootstrap`);
  return res.json();
}

export async function getAbc(period: string) {
  const res = await fetch(`${BASE_URL}/api/abc/${period}`);
  return res.json();
}

export async function pushSync(tenantId: string, operations: unknown[]) {
  const res = await fetch(`${BASE_URL}/api/sync/push`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tenantId, operations })
  });
  return res.json();
}

export async function getSyncQueue() {
  const res = await fetch(`${BASE_URL}/api/sync/queue`);
  return res.json();
}
