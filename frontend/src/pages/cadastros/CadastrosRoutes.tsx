import { Navigate, Route, Routes } from 'react-router-dom';
import { LoteEntity, SafraEntity, TalhaoEntity } from '../../types/entity';
import { CadastrosEntityPage } from './CadastrosEntityPage';
import { entitySchemas } from './schema';

export function CadastrosRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/cadastros/safras" replace />} />
      <Route path="/safras" element={<CadastrosEntityPage<SafraEntity> schema={entitySchemas.safras} />} />
      <Route path="/talhoes" element={<CadastrosEntityPage<TalhaoEntity> schema={entitySchemas.talhoes} />} />
      <Route path="/lotes" element={<CadastrosEntityPage<LoteEntity> schema={entitySchemas.lotes} />} />
    </Routes>
  );
}
