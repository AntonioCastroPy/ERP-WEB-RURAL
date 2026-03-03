export function DocsPage() {
  return (
    <section>
      <h2>Documentação do Sistema</h2>
      <h3>Visão Geral</h3>
      <p>ERP web modular para Gestão de Custos Rurais da Fazenda Escola Flor de Lótus (FAEF/Eduvale), com arquitetura multi-tenant, multi-safra e governança completa.</p>
      <h3>Módulos</h3>
      <ul>
        <li>Cadastros Mestres, Produção Agrícola, Pecuária & Bem-Estar, Estoques, Manutenção, Projetos, Timesheets, Finanças MVP, Motor ABC e Relatórios.</li>
      </ul>
      <h3>Modelo ABC</h3>
      <p>Recursos (mão de obra, combustível, ração etc.) são distribuídos para atividades por drivers de recurso (horas, litros, kg). Em seguida, atividades são alocadas em objetos de custo (talhão, lote, turma, projeto) por activity drivers.</p>
      <h3>Drivers padrão</h3>
      <ul>
        <li>Resource Drivers: horas, horas-máquina, kWh, litros, kg, doses, km.</li>
        <li>Activity Drivers: hectares, nº animais, nº procedimentos, horas-aula, nº participantes.</li>
      </ul>
      <h3>Operação Offline e Sync</h3>
      <p>O aplicativo PWA executa CRUD local em IndexedDB, mantém fila de sincronização e permite resolução de conflito campo a campo com histórico auditável.</p>
    </section>
  );
}
