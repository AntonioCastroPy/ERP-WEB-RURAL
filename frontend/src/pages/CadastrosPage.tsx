import { FormEvent, useEffect, useState } from 'react';
import { createLote, createSafra, createTalhao, deleteCadastro, getCadastrosOverview } from '../services/api';

type Safra = { id: string; name: string; year: number; status: string };
type Talhao = { id: string; code: string; areaHectares: number; soilType: string; currentSeasonId: string };
type Lote = { id: string; code: string; species: string; breed: string; headCount: number };

export function CadastrosPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [safras, setSafras] = useState<Safra[]>([]);
  const [talhoes, setTalhoes] = useState<Talhao[]>([]);
  const [lotes, setLotes] = useState<Lote[]>([]);

  const [safraForm, setSafraForm] = useState({ name: '', year: new Date().getFullYear(), status: 'planejada' as const });
  const [talhaoForm, setTalhaoForm] = useState({ code: '', areaHectares: 0, soilType: '', currentSeasonId: '' });
  const [loteForm, setLoteForm] = useState({ code: '', species: 'Bovino', breed: '', headCount: 0 });

  async function loadAll() {
    setLoading(true);
    setError('');
    try {
      const data = await getCadastrosOverview();
      setSafras(data.cropSeasons);
      setTalhoes(data.fieldPlots);
      setLotes(data.herdLots);
      setTalhaoForm((prev) => ({ ...prev, currentSeasonId: data.cropSeasons[0]?.id ?? '' }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar cadastros');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function onCreateSafra(event: FormEvent) {
    event.preventDefault();
    await createSafra(safraForm);
    setSafraForm({ name: '', year: new Date().getFullYear(), status: 'planejada' });
    await loadAll();
  }

  async function onCreateTalhao(event: FormEvent) {
    event.preventDefault();
    await createTalhao(talhaoForm);
    setTalhaoForm({ code: '', areaHectares: 0, soilType: '', currentSeasonId: safras[0]?.id ?? '' });
    await loadAll();
  }

  async function onCreateLote(event: FormEvent) {
    event.preventDefault();
    await createLote(loteForm);
    setLoteForm({ code: '', species: 'Bovino', breed: '', headCount: 0 });
    await loadAll();
  }

  return (
    <section>
      <h2>Cadastros Mestres (funcional)</h2>
      <p>CRUD inicial para Safras, Talhões e Lotes, com persistência backend e trilha de auditoria.</p>
      {error && <p className="error">{error}</p>}
      {loading && <p>Carregando...</p>}

      <div className="erp-grid">
        <article className="panel">
          <h3>Nova Safra</h3>
          <form onSubmit={onCreateSafra} className="form-grid">
            <input placeholder="Nome" value={safraForm.name} onChange={(e) => setSafraForm((p) => ({ ...p, name: e.target.value }))} required />
            <input type="number" placeholder="Ano" value={safraForm.year} onChange={(e) => setSafraForm((p) => ({ ...p, year: Number(e.target.value) }))} required />
            <select value={safraForm.status} onChange={(e) => setSafraForm((p) => ({ ...p, status: e.target.value as 'planejada' | 'ativa' | 'encerrada' }))}>
              <option value="planejada">Planejada</option>
              <option value="ativa">Ativa</option>
              <option value="encerrada">Encerrada</option>
            </select>
            <button type="submit">Adicionar Safra</button>
          </form>
          <table>
            <thead><tr><th>Nome</th><th>Ano</th><th>Status</th><th /></tr></thead>
            <tbody>
              {safras.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.year}</td>
                  <td>{item.status}</td>
                  <td><button onClick={() => deleteCadastro('safras', item.id).then(loadAll)}>Excluir</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>

        <article className="panel">
          <h3>Novo Talhão</h3>
          <form onSubmit={onCreateTalhao} className="form-grid">
            <input placeholder="Código" value={talhaoForm.code} onChange={(e) => setTalhaoForm((p) => ({ ...p, code: e.target.value }))} required />
            <input type="number" step="0.1" placeholder="Área (ha)" value={talhaoForm.areaHectares} onChange={(e) => setTalhaoForm((p) => ({ ...p, areaHectares: Number(e.target.value) }))} required />
            <input placeholder="Tipo de solo" value={talhaoForm.soilType} onChange={(e) => setTalhaoForm((p) => ({ ...p, soilType: e.target.value }))} required />
            <select value={talhaoForm.currentSeasonId} onChange={(e) => setTalhaoForm((p) => ({ ...p, currentSeasonId: e.target.value }))}>
              {safras.map((s) => <option key={s.id} value={s.id}>{s.name}/{s.year}</option>)}
            </select>
            <button type="submit">Adicionar Talhão</button>
          </form>
          <table>
            <thead><tr><th>Código</th><th>Área</th><th>Solo</th><th /></tr></thead>
            <tbody>
              {talhoes.map((item) => (
                <tr key={item.id}>
                  <td>{item.code}</td>
                  <td>{item.areaHectares} ha</td>
                  <td>{item.soilType}</td>
                  <td><button onClick={() => deleteCadastro('talhoes', item.id).then(loadAll)}>Excluir</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>

        <article className="panel">
          <h3>Novo Lote</h3>
          <form onSubmit={onCreateLote} className="form-grid">
            <input placeholder="Código" value={loteForm.code} onChange={(e) => setLoteForm((p) => ({ ...p, code: e.target.value }))} required />
            <input placeholder="Espécie" value={loteForm.species} onChange={(e) => setLoteForm((p) => ({ ...p, species: e.target.value }))} required />
            <input placeholder="Raça" value={loteForm.breed} onChange={(e) => setLoteForm((p) => ({ ...p, breed: e.target.value }))} required />
            <input type="number" placeholder="Qtd. animais" value={loteForm.headCount} onChange={(e) => setLoteForm((p) => ({ ...p, headCount: Number(e.target.value) }))} required />
            <button type="submit">Adicionar Lote</button>
          </form>
          <table>
            <thead><tr><th>Código</th><th>Espécie</th><th>Qtd</th><th /></tr></thead>
            <tbody>
              {lotes.map((item) => (
                <tr key={item.id}>
                  <td>{item.code}</td>
                  <td>{item.species}/{item.breed}</td>
                  <td>{item.headCount}</td>
                  <td><button onClick={() => deleteCadastro('lotes', item.id).then(loadAll)}>Excluir</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
      </div>
    </section>
  );
}
