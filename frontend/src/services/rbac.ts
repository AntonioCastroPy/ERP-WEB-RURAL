import { EntityKey, EntityPermissions } from '../types/entity';

type Role =
  | 'admin_sistema'
  | 'controladoria'
  | 'coordenador_fazenda'
  | 'docente'
  | 'pesquisador'
  | 'supervisor_estagio'
  | 'aluno_estagiario'
  | 'veterinario'
  | 'zootecnista'
  | 'agronomo'
  | 'operador_campo'
  | 'auditor';

const roleByEntity: Record<Role, Partial<Record<EntityKey, EntityPermissions>>> = {
  admin_sistema: {
    safras: { canView: true, canCreate: true, canEdit: true, canDelete: true },
    talhoes: { canView: true, canCreate: true, canEdit: true, canDelete: true },
    lotes: { canView: true, canCreate: true, canEdit: true, canDelete: true }
  },
  controladoria: {
    safras: { canView: true, canCreate: true, canEdit: true, canDelete: false },
    talhoes: { canView: true, canCreate: false, canEdit: false, canDelete: false },
    lotes: { canView: true, canCreate: false, canEdit: false, canDelete: false }
  },
  coordenador_fazenda: {
    safras: { canView: true, canCreate: true, canEdit: true, canDelete: false },
    talhoes: { canView: true, canCreate: true, canEdit: true, canDelete: false },
    lotes: { canView: true, canCreate: true, canEdit: true, canDelete: false }
  },
  docente: { safras: { canView: true, canCreate: false, canEdit: false, canDelete: false }, talhoes: { canView: true, canCreate: false, canEdit: false, canDelete: false }, lotes: { canView: true, canCreate: false, canEdit: false, canDelete: false } },
  pesquisador: { safras: { canView: true, canCreate: false, canEdit: false, canDelete: false }, talhoes: { canView: true, canCreate: false, canEdit: false, canDelete: false }, lotes: { canView: true, canCreate: false, canEdit: false, canDelete: false } },
  supervisor_estagio: { safras: { canView: true, canCreate: false, canEdit: false, canDelete: false }, talhoes: { canView: true, canCreate: false, canEdit: false, canDelete: false }, lotes: { canView: true, canCreate: false, canEdit: false, canDelete: false } },
  aluno_estagiario: { safras: { canView: true, canCreate: false, canEdit: false, canDelete: false }, talhoes: { canView: true, canCreate: false, canEdit: false, canDelete: false }, lotes: { canView: true, canCreate: false, canEdit: false, canDelete: false } },
  veterinario: { safras: { canView: true, canCreate: false, canEdit: false, canDelete: false }, talhoes: { canView: true, canCreate: false, canEdit: false, canDelete: false }, lotes: { canView: true, canCreate: true, canEdit: true, canDelete: false } },
  zootecnista: { safras: { canView: true, canCreate: false, canEdit: false, canDelete: false }, talhoes: { canView: true, canCreate: false, canEdit: false, canDelete: false }, lotes: { canView: true, canCreate: true, canEdit: true, canDelete: false } },
  agronomo: { safras: { canView: true, canCreate: true, canEdit: false, canDelete: false }, talhoes: { canView: true, canCreate: true, canEdit: true, canDelete: false }, lotes: { canView: true, canCreate: false, canEdit: false, canDelete: false } },
  operador_campo: { safras: { canView: true, canCreate: false, canEdit: false, canDelete: false }, talhoes: { canView: true, canCreate: false, canEdit: false, canDelete: false }, lotes: { canView: true, canCreate: false, canEdit: false, canDelete: false } },
  auditor: { safras: { canView: true, canCreate: false, canEdit: false, canDelete: false }, talhoes: { canView: true, canCreate: false, canEdit: false, canDelete: false }, lotes: { canView: true, canCreate: false, canEdit: false, canDelete: false } }
};

const defaultPermissions: EntityPermissions = { canView: false, canCreate: false, canEdit: false, canDelete: false };

export function getCurrentRole(): Role {
  const role = localStorage.getItem('erp_role') as Role | null;
  return role ?? 'admin_sistema';
}

export function getEntityPermissions(entity: EntityKey): EntityPermissions {
  const role = getCurrentRole();
  return roleByEntity[role][entity] ?? defaultPermissions;
}
