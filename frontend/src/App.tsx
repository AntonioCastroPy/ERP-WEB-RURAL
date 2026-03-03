import { Route, Routes } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { HomePage } from './pages/HomePage';
import { ModulePage } from './pages/ModulePage';
import { AbcPage } from './pages/AbcPage';
import { SyncPage } from './pages/SyncPage';
import { DocsPage } from './pages/DocsPage';
import { CadastrosPage } from './pages/CadastrosPage';

export function App() {
  return (
    <div className="layout">
      <Sidebar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cadastros" element={<CadastrosPage />} />
          <Route path="/producao" element={<ModulePage title="Produção Agrícola" bullets={[
            'Planejamento por safra',
            'Ordens de Serviço de campo',
            'Diário de operações',
            'Medições e produtividade'
          ]} />} />
          <Route path="/pecuaria" element={<ModulePage title="Pecuária & Bem-Estar Animal" bullets={[
            'Manejo, tratamentos, vacinação e reprodução',
            'Eventos por animal e lote',
            'Checklists de bem-estar com evidências offline'
          ]} />} />
          <Route path="/estoques" element={<ModulePage title="Almoxarifado & Estoques" bullets={[
            'Entrada, saída e inventário por lote',
            'Requisições por OS/atividade',
            'Integração com custos via consumo'
          ]} />} />
          <Route path="/timesheets" element={<ModulePage title="Gestão de Pessoas & Timesheets" bullets={[
            'Apontamento de horas por atividade',
            'Turnos, equipes e rateios ABC',
            'Fluxo de aprovação docente/supervisor'
          ]} />} />
          <Route path="/abc" element={<AbcPage />} />
          <Route path="/sync" element={<SyncPage />} />
          <Route path="/docs" element={<DocsPage />} />
        </Routes>
      </main>
    </div>
  );
}
