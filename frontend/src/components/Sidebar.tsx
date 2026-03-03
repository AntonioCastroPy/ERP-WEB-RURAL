import { NavLink, useLocation } from 'react-router-dom';

const rootModules = [
  ['/', 'Home'],
  ['/producao', 'Produção Agrícola'],
  ['/pecuaria', 'Pecuária & Bem-Estar'],
  ['/estoques', 'Estoques'],
  ['/timesheets', 'Timesheets'],
  ['/abc', 'Motor ABC'],
  ['/sync', 'Painel de Sync'],
  ['/docs', 'Documentação']
] as const;

const cadastrosChildren = [
  ['/cadastros/safras', 'Safras'],
  ['/cadastros/talhoes', 'Talhões'],
  ['/cadastros/lotes', 'Lotes']
] as const;

export function Sidebar() {
  const location = useLocation();
  const cadastrosExpanded = location.pathname.startsWith('/cadastros');

  return (
    <aside className="sidebar">
      <h1>ERP Rural ABC</h1>
      <p>Fazenda Escola Flor de Lótus</p>
      <nav>
        {rootModules.map(([url, label]) => (
          <NavLink key={url} to={url} className={({ isActive }) => (isActive ? 'active' : '')} end={url === '/'}>
            {label}
          </NavLink>
        ))}

        <div className="sidebar-group">
          <NavLink to="/cadastros/safras" className={cadastrosExpanded ? 'active' : ''}>Cadastros Mestres</NavLink>
          {cadastrosExpanded && (
            <div className="sidebar-submenu">
              {cadastrosChildren.map(([url, label]) => (
                <NavLink key={url} to={url} className={({ isActive }) => (isActive ? 'active' : '')}>
                  {label}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}
