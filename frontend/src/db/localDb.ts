import Dexie, { Table } from 'dexie';

export interface LocalRecord {
  id: string;
  entity: string;
  data: Record<string, unknown>;
  version: number;
  updatedAt: string;
}

export interface SyncQueueItem {
  id: string;
  entity: string;
  entityId: string;
  operation: 'upsert' | 'delete';
  payload: Record<string, unknown>;
  clientVersion: number;
  updatedBy: string;
  status: 'pending' | 'conflict' | 'applied';
}

class RuralDb extends Dexie {
  records!: Table<LocalRecord, string>;
  syncQueue!: Table<SyncQueueItem, string>;

  constructor() {
    super('erp_rural_offline_db');
    this.version(1).stores({
      records: 'id, entity, updatedAt',
      syncQueue: 'id, entity, status'
    });
  }
}

export const db = new RuralDb();
