import { Navigate } from 'react-router-dom';

// Compatibilidade: rota legada /cadastros redireciona para nova arquitetura por entidade.
export function CadastrosPage() {
  return <Navigate to="/cadastros/safras" replace />;
}
