import cors from 'cors';
import express from 'express';
import { z } from 'zod';
import { calculateAbc } from './abc.js';
import { activityAllocations, auditLog, moduleCatalog, rbacMatrix, resourceCosts, tenants, users } from './data.js';
import { SyncOperation } from './types.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const syncQueue: SyncOperation[] = [];

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'erp-web-rural-backend' }));

app.get('/api/bootstrap', (_req, res) => {
  res.json({
    tenant: tenants[1],
    users,
    modules: moduleCatalog,
    rbacMatrix,
    seed: {
      safra: 'Safra 2026',
      talhoes: ['T-01', 'T-02'],
      lotes: ['L-NELORE', 'L-CORTE'],
      projetos: ['Projeto Semeia', 'Pesquisa Bem-Estar Bovina']
    }
  });
});

app.get('/api/abc/:period', (req, res) => {
  res.json(calculateAbc(req.params.period, resourceCosts, activityAllocations));
});

app.post('/api/sync/push', (req, res) => {
  const schema = z.object({
    tenantId: z.string(),
    operations: z.array(
      z.object({
        id: z.string(),
        entity: z.string(),
        entityId: z.string(),
        operation: z.enum(['upsert', 'delete']),
        payload: z.any(),
        clientVersion: z.number(),
        updatedBy: z.string()
      })
    )
  });

  const payload = schema.parse(req.body);

  const result = payload.operations.map((op) => {
    const serverVersion = 1;
    const hasConflict = op.clientVersion < serverVersion;
    const item: SyncOperation = {
      id: op.id,
      tenantId: payload.tenantId,
      entity: op.entity,
      entityId: op.entityId,
      operation: op.operation,
      payload: op.payload,
      clientVersion: op.clientVersion,
      serverVersion,
      status: hasConflict ? 'conflict' : 'applied',
      conflict: hasConflict
        ? {
            value: {
              client: op.payload,
              server: { message: 'Versão do servidor mais nova' }
            }
          }
        : undefined,
      createdAt: new Date().toISOString()
    };
    syncQueue.push(item);
    auditLog.push({
      id: `audit-${Date.now()}-${Math.random()}`,
      tenantId: payload.tenantId,
      entity: op.entity,
      entityId: op.entityId,
      action: `sync_${item.status}`,
      by: op.updatedBy,
      after: op.payload,
      timestamp: new Date().toISOString(),
      reason: hasConflict ? 'Conflito detectado por versionamento' : 'Sync aplicado'
    });
    return item;
  });

  res.json({ applied: result.filter((r) => r.status === 'applied').length, conflicts: result.filter((r) => r.status === 'conflict').length, result });
});

app.get('/api/sync/queue', (_req, res) => {
  res.json(syncQueue);
});

app.get('/api/audit', (_req, res) => {
  res.json(auditLog.slice(-100));
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Backend ERP Web Rural ativo na porta ${port}`);
});
