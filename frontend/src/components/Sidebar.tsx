import { Link } from 'react-router-dom';

const modules = [
  ['/', 'Home'],
  ['/cadastros', 'Cadastros Mestres'],
  ['/producao', 'Produção Agrícola'],
  ['/pecuaria', 'Pecuária & Bem-Estar'],
  ['/estoques', 'Estoques'],
  ['/timesheets', 'Timesheets'],
  ['/abc', 'Motor ABC'],
  ['/sync', 'Painel de Sync'],
  ['/docs', 'Documentação']
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <h1>ERP Rural ABC</h1>
      <p>Fazenda Escola Flor de Lótus</p>
      <nav>
        {modules.map(([url, label]) => (
          <Link key={url} to={url}>{label}</Link>
        ))}
      </nav>
    </aside>
  );
}
