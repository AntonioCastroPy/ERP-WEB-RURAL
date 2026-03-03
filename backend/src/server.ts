import cors from 'cors';
import express from 'express';
import { z } from 'zod';
import { calculateAbc } from './abc.js';
import {
  activityAllocations,
  auditLog,
  cropSeasons,
  fieldPlots,
  herdLots,
  moduleCatalog,
  rbacMatrix,
  resourceCosts,
  tenants,
  users
} from './data.js';
import { CropSeason, FieldPlot, HerdLot, SyncOperation } from './types.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const syncQueue: SyncOperation[] = [];

function registerAudit(tenantId: string, entity: string, entityId: string, action: string, by: string, before?: unknown, after?: unknown, reason?: string) {
  auditLog.push({
    id: `audit-${Date.now()}-${Math.random()}`,
    tenantId,
    entity,
    entityId,
    action,
    by,
    before,
    after,
    reason,
    timestamp: new Date().toISOString()
  });
}

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

app.get('/api/cadastros/overview', (_req, res) => {
  res.json({ cropSeasons, fieldPlots, herdLots });
});

const seasonSchema = z.object({ name: z.string().min(2), year: z.number().int(), status: z.enum(['planejada', 'ativa', 'encerrada']) });
app.post('/api/cadastros/safras', (req, res) => {
  const payload = seasonSchema.parse(req.body);
  const item: CropSeason = { id: `safra-${crypto.randomUUID()}`, tenantId: 'flor-de-lotus', ...payload, version: 1 };
  cropSeasons.unshift(item);
  registerAudit(item.tenantId, 'cropSeason', item.id, 'create', 'u-admin', undefined, item);
  res.status(201).json(item);
});

app.put('/api/cadastros/safras/:id', (req, res) => {
  const payload = seasonSchema.parse(req.body);
  const idx = cropSeasons.findIndex((i) => i.id === req.params.id);
  if (idx < 0) return res.status(404).json({ message: 'Safra não encontrada' });
  const before = cropSeasons[idx];
  const updated: CropSeason = { ...before, ...payload, version: before.version + 1 };
  cropSeasons[idx] = updated;
  registerAudit(updated.tenantId, 'cropSeason', updated.id, 'update', 'u-admin', before, updated);
  res.json(updated);
});

app.delete('/api/cadastros/safras/:id', (req, res) => {
  const idx = cropSeasons.findIndex((i) => i.id === req.params.id);
  if (idx < 0) return res.status(404).json({ message: 'Safra não encontrada' });
  const [removed] = cropSeasons.splice(idx, 1);
  registerAudit(removed.tenantId, 'cropSeason', removed.id, 'delete', 'u-admin', removed, undefined);
  res.status(204).send();
});

const plotSchema = z.object({ code: z.string().min(2), areaHectares: z.number().positive(), soilType: z.string().min(2), currentSeasonId: z.string().min(2) });
app.post('/api/cadastros/talhoes', (req, res) => {
  const payload = plotSchema.parse(req.body);
  const item: FieldPlot = { id: `plot-${crypto.randomUUID()}`, tenantId: 'flor-de-lotus', ...payload, version: 1 };
  fieldPlots.unshift(item);
  registerAudit(item.tenantId, 'fieldPlot', item.id, 'create', 'u-admin', undefined, item);
  res.status(201).json(item);
});

app.put('/api/cadastros/talhoes/:id', (req, res) => {
  const payload = plotSchema.parse(req.body);
  const idx = fieldPlots.findIndex((i) => i.id === req.params.id);
  if (idx < 0) return res.status(404).json({ message: 'Talhão não encontrado' });
  const before = fieldPlots[idx];
  const updated: FieldPlot = { ...before, ...payload, version: before.version + 1 };
  fieldPlots[idx] = updated;
  registerAudit(updated.tenantId, 'fieldPlot', updated.id, 'update', 'u-admin', before, updated);
  res.json(updated);
});

app.delete('/api/cadastros/talhoes/:id', (req, res) => {
  const idx = fieldPlots.findIndex((i) => i.id === req.params.id);
  if (idx < 0) return res.status(404).json({ message: 'Talhão não encontrado' });
  const [removed] = fieldPlots.splice(idx, 1);
  registerAudit(removed.tenantId, 'fieldPlot', removed.id, 'delete', 'u-admin', removed, undefined);
  res.status(204).send();
});

const lotSchema = z.object({ code: z.string().min(2), species: z.string().min(2), breed: z.string().min(2), headCount: z.number().int().positive() });
app.post('/api/cadastros/lotes', (req, res) => {
  const payload = lotSchema.parse(req.body);
  const item: HerdLot = { id: `lot-${crypto.randomUUID()}`, tenantId: 'flor-de-lotus', ...payload, version: 1 };
  herdLots.unshift(item);
  registerAudit(item.tenantId, 'herdLot', item.id, 'create', 'u-admin', undefined, item);
  res.status(201).json(item);
});

app.put('/api/cadastros/lotes/:id', (req, res) => {
  const payload = lotSchema.parse(req.body);
  const idx = herdLots.findIndex((i) => i.id === req.params.id);
  if (idx < 0) return res.status(404).json({ message: 'Lote não encontrado' });
  const before = herdLots[idx];
  const updated: HerdLot = { ...before, ...payload, version: before.version + 1 };
  herdLots[idx] = updated;
  registerAudit(updated.tenantId, 'herdLot', updated.id, 'update', 'u-admin', before, updated);
  res.json(updated);
});

app.delete('/api/cadastros/lotes/:id', (req, res) => {
  const idx = herdLots.findIndex((i) => i.id === req.params.id);
  if (idx < 0) return res.status(404).json({ message: 'Lote não encontrado' });
  const [removed] = herdLots.splice(idx, 1);
  registerAudit(removed.tenantId, 'herdLot', removed.id, 'delete', 'u-admin', removed, undefined);
  res.status(204).send();
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
        payload: z.unknown(),
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
    registerAudit(payload.tenantId, op.entity, op.entityId, `sync_${item.status}`, op.updatedBy, undefined, op.payload, hasConflict ? 'Conflito detectado por versionamento' : 'Sync aplicado');
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
