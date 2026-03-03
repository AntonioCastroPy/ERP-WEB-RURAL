export type EntityKey = 'safras' | 'talhoes' | 'lotes';

export type FieldType = 'text' | 'number' | 'select';

export interface FieldConfig {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export interface ColumnConfig<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => string;
}

export interface EntitySchema<T> {
  key: EntityKey;
  title: string;
  description: string;
  endpoint: string;
  searchPlaceholder: string;
  fields: FieldConfig[];
  columns: ColumnConfig<T>[];
  sortFieldDefault: string;
}

export interface PaginatedResult<T> {
  data: T[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export interface MasterEntityBase {
  id: string;
  updatedAt: string;
  updatedBy: string;
}

export interface SafraEntity extends MasterEntityBase {
  name: string;
  year: number;
  status: 'planejada' | 'ativa' | 'encerrada';
}

export interface TalhaoEntity extends MasterEntityBase {
  code: string;
  areaHectares: number;
  soilType: string;
  currentSeasonId: string;
}

export interface LoteEntity extends MasterEntityBase {
  code: string;
  species: string;
  breed: string;
  headCount: number;
}

export interface EntityPermissions {
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}
