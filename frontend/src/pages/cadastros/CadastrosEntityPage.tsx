import { useCallback, useEffect, useMemo, useState } from 'react';
import { ConfirmDialog } from '../../components/entity/ConfirmDialog';
import { EntityModalForm } from '../../components/entity/EntityModalForm';
import { EntityPageLayout } from '../../components/entity/EntityPageLayout';
import { EntityTable } from '../../components/entity/EntityTable';
import { createEntity, deleteEntity, listEntity, updateEntity } from '../../services/api';
import { getEntityPermissions } from '../../services/rbac';
import { EntitySchema, MasterEntityBase } from '../../types/entity';

interface CadastrosEntityPageProps<T extends MasterEntityBase> {
  schema: EntitySchema<T>;
}

export function CadastrosEntityPage<T extends MasterEntityBase>({ schema }: CadastrosEntityPageProps<T>) {
  const permissions = useMemo(() => getEntityPermissions(schema.key), [schema.key]);

  const [query, setQuery] = useState({ page: 1, pageSize: 10, q: '', sortField: schema.sortFieldDefault, sortDirection: 'asc' as const });
  const [result, setResult] = useState<{ data: T[]; totalCount: number }>({ data: [], totalCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [deleting, setDeleting] = useState<T | null>(null);

  const emptyRecord = useMemo(
    () => schema.fields.reduce<Record<string, unknown>>((acc, field) => ({ ...acc, [field.key]: '' }), {}),
    [schema.fields]
  );

  const loadData = useCallback(async () => {
    if (!permissions.canView) return;
    setLoading(true);
    setError('');
    try {
      const response = await listEntity<T>(schema.key, query);
      setResult({ data: response.data, totalCount: response.totalCount });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  }, [schema.key, query, permissions.canView]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  async function handleSave(values: Record<string, unknown>) {
    if (editing) {
      await updateEntity(schema.key, editing.id, values);
    } else {
      await createEntity(schema.key, values);
    }
    await loadData();
  }

  async function handleDelete() {
    if (!deleting) return;
    await deleteEntity(schema.key, deleting.id);
    setDeleting(null);
    await loadData();
  }

  function handleSort(field: string) {
    setQuery((prev) => ({
      ...prev,
      sortField: field,
      sortDirection: prev.sortField === field && prev.sortDirection === 'asc' ? 'desc' : 'asc'
    }));
  }

  if (!permissions.canView) {
    return (
      <section>
        <h2>{schema.title}</h2>
        <p className="error">Você não possui permissão para visualizar esta entidade.</p>
      </section>
    );
  }

  return (
    <>
      <EntityPageLayout
        title={schema.title}
        description={schema.description}
        actionBar={
          <>
            <input
              className="search-input"
              value={query.q}
              placeholder={schema.searchPlaceholder}
              onChange={(e) => setQuery((prev) => ({ ...prev, page: 1, q: e.target.value }))}
            />
            {permissions.canCreate && (
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setIsModalOpen(true);
                }}
              >
                Novo
              </button>
            )}
          </>
        }
      >
        {error ? (
          <div className="error-state">
            <p className="error">Falha ao carregar dados: {error}</p>
            <button type="button" onClick={() => void loadData()}>Tentar novamente</button>
          </div>
        ) : (
          <EntityTable<T>
            data={result.data}
            columns={schema.columns}
            loading={loading}
            page={query.page}
            pageSize={query.pageSize}
            totalCount={result.totalCount}
            sortField={query.sortField}
            sortDirection={query.sortDirection}
            onSort={handleSort}
            onPageChange={(page) => setQuery((prev) => ({ ...prev, page }))}
            canEdit={permissions.canEdit}
            canDelete={permissions.canDelete}
            onEdit={(row) => {
              setEditing(row);
              setIsModalOpen(true);
            }}
            onDelete={(row) => setDeleting(row)}
          />
        )}
      </EntityPageLayout>

      <EntityModalForm
        open={isModalOpen}
        title={editing ? `Editar ${schema.title}` : `Novo ${schema.title}`}
        fields={schema.fields}
        initialValues={editing ?? emptyRecord}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSave}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        title={`Excluir ${schema.title}`}
        message="Esta operação é irreversível. Deseja continuar?"
        onCancel={() => setDeleting(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}
