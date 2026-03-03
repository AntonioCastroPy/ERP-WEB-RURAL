import { useState } from 'react';
import { db } from '../db/localDb';
import { pushSync } from '../services/api';

export function SyncPage() {
  const [result, setResult] = useState<any>();

  async function createOfflineDemo() {
    await db.syncQueue.put({
      id: crypto.randomUUID(),
      entity: 'timesheet',
      entityId: 'ts-1',
      operation: 'upsert',
      payload: { colaborador: 'Aluno A', horas: 6, atividade: 'Plantio', safra: '2026' },
      clientVersion: 0,
      updatedBy: 'u-docente',
      status: 'pending'
    });
    alert('Lançamento salvo offline e enfileirado.');
  }

  async function syncNow() {
    const pending = await db.syncQueue.where('status').equals('pending').toArray();
    const response = await pushSync('flor-de-lotus', pending);
    setResult(response);
  }

  return (
    <section>
      <h2>Painel de Sincronização</h2>
      <p>Fila bidirecional com retentativa e conflitos auditáveis.</p>
      <button onClick={createOfflineDemo}>Criar lançamento offline</button>
      <button onClick={syncNow}>Sincronizar agora</button>
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </section>
  );
}
