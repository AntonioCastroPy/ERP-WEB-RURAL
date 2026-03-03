import { ColumnConfig } from '../../types/entity';

interface EntityTableProps<T extends { id: string; updatedAt?: string; updatedBy?: string }> {
  data: T[];
  columns: ColumnConfig<T>[];
  loading: boolean;
  page: number;
  pageSize: number;
  totalCount: number;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  onSort: (field: string) => void;
  onPageChange: (page: number) => void;
  canEdit: boolean;
  canDelete: boolean;
  onEdit: (row: T) => void;
  onDelete: (row: T) => void;
}

export function EntityTable<T extends { id: string; updatedAt?: string; updatedBy?: string }>({
  data,
  columns,
  loading,
  page,
  pageSize,
  totalCount,
  sortField,
  sortDirection,
  onSort,
  onPageChange,
  canEdit,
  canDelete,
  onEdit,
  onDelete
}: EntityTableProps<T>) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  if (loading) {
    return (
      <div className="table-skeleton">
        {Array.from({ length: 6 }).map((_, index) => <div key={index} className="skeleton-line" />)}
      </div>
    );
  }

  if (!data.length) {
    return <div className="empty-state">Nenhum registro encontrado para os filtros atuais.</div>;
  }

  return (
    <>
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>
                {column.sortable ? (
                  <button type="button" className="sort-button" onClick={() => onSort(column.key)}>
                    {column.label} {sortField === column.key ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
                  </button>
                ) : (
                  column.label
                )}
              </th>
            ))}
            <th>Atualizado em</th>
            <th>Atualizado por</th>
            {(canEdit || canDelete) && <th>Ações</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              {columns.map((column) => (
                <td key={`${row.id}-${column.key}`}>
                  {column.render ? column.render(row) : String((row as Record<string, unknown>)[column.key] ?? '')}
                </td>
              ))}
              <td>{row.updatedAt ? new Date(row.updatedAt).toLocaleString('pt-BR') : '-'}</td>
              <td>{row.updatedBy ?? '-'}</td>
              {(canEdit || canDelete) && (
                <td className="row-actions">
                  {canEdit && <button type="button" className="button-secondary" onClick={() => onEdit(row)}>Editar</button>}
                  {canDelete && <button type="button" className="button-danger" onClick={() => onDelete(row)}>Excluir</button>}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button type="button" className="button-secondary" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          Anterior
        </button>
        <span>Página {page} de {totalPages}</span>
        <button type="button" className="button-secondary" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
          Próxima
        </button>
      </div>
    </>
  );
}
