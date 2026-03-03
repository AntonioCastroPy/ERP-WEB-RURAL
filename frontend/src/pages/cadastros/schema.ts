import { EntitySchema, LoteEntity, SafraEntity, TalhaoEntity } from '../../types/entity';

export const safraSchema: EntitySchema<SafraEntity> = {
  key: 'safras',
  title: 'Safras',
  description: 'Gestão de anos-safra e status operacional.',
  endpoint: '/api/cadastros/safras',
  searchPlaceholder: 'Buscar por nome ou status...',
  sortFieldDefault: 'name',
  fields: [
    { key: 'name', label: 'Nome', type: 'text', required: true, placeholder: 'Safra Verão' },
    { key: 'year', label: 'Ano', type: 'number', required: true },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      options: [
        { value: 'planejada', label: 'Planejada' },
        { value: 'ativa', label: 'Ativa' },
        { value: 'encerrada', label: 'Encerrada' }
      ]
    }
  ],
  columns: [
    { key: 'name', label: 'Nome', sortable: true },
    { key: 'year', label: 'Ano', sortable: true },
    { key: 'status', label: 'Status', sortable: true }
  ]
};

export const talhaoSchema: EntitySchema<TalhaoEntity> = {
  key: 'talhoes',
  title: 'Talhões',
  description: 'Cadastro de áreas e contexto produtivo.',
  endpoint: '/api/cadastros/talhoes',
  searchPlaceholder: 'Buscar por código, solo ou safra...',
  sortFieldDefault: 'code',
  fields: [
    { key: 'code', label: 'Código', type: 'text', required: true },
    { key: 'areaHectares', label: 'Área (ha)', type: 'number', required: true },
    { key: 'soilType', label: 'Tipo de solo', type: 'text', required: true },
    { key: 'currentSeasonId', label: 'Safra vigente', type: 'text', required: true }
  ],
  columns: [
    { key: 'code', label: 'Código', sortable: true },
    { key: 'areaHectares', label: 'Área (ha)', sortable: true },
    { key: 'soilType', label: 'Tipo de solo', sortable: true },
    { key: 'currentSeasonId', label: 'Safra vigente', sortable: true }
  ]
};

export const loteSchema: EntitySchema<LoteEntity> = {
  key: 'lotes',
  title: 'Lotes',
  description: 'Cadastro de lotes e composição do rebanho.',
  endpoint: '/api/cadastros/lotes',
  searchPlaceholder: 'Buscar por código, espécie ou raça...',
  sortFieldDefault: 'code',
  fields: [
    { key: 'code', label: 'Código', type: 'text', required: true },
    { key: 'species', label: 'Espécie', type: 'text', required: true },
    { key: 'breed', label: 'Raça', type: 'text', required: true },
    { key: 'headCount', label: 'Quantidade', type: 'number', required: true }
  ],
  columns: [
    { key: 'code', label: 'Código', sortable: true },
    { key: 'species', label: 'Espécie', sortable: true },
    { key: 'breed', label: 'Raça', sortable: true },
    { key: 'headCount', label: 'Qtd. animais', sortable: true }
  ]
};

export const entitySchemas = {
  safras: safraSchema,
  talhoes: talhaoSchema,
  lotes: loteSchema
};
