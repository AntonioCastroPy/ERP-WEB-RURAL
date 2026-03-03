export function HomePage() {
  return (
    <section>
      <h2>Dashboard Executivo</h2>
      <div className="kpi-grid">
        <article><h3>Custo por hectare</h3><p>R$ 2.145,90</p></article>
        <article><h3>Custo por animal</h3><p>R$ 542,10</p></article>
        <article><h3>Pendências de aprovação</h3><p>12</p></article>
        <article><h3>Sync pendente</h3><p>8 itens</p></article>
      </div>
      <p>Ambiente multiunidade, multi-safra e offline-first para operação em campo.</p>
    </section>
  );
}
