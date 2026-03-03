import { useEffect, useState } from 'react';
import { getAbc } from '../services/api';

export function AbcPage() {
  const [data, setData] = useState<any>();

  useEffect(() => {
    getAbc('2026-01').then(setData);
  }, []);

  return (
    <section>
      <h2>Motor ABC (Resource → Activity → Cost Object)</h2>
      {!data && <p>Carregando cálculo...</p>}
      {data && (
        <>
          <p>Total de recursos no período: <strong>R$ {data.totalResources.toLocaleString('pt-BR')}</strong></p>
          {data.activities.map((activity: any) => (
            <article key={activity.activity} className="panel">
              <h3>{activity.activity}</h3>
              <p>Custo alocado: R$ {activity.allocatedCost.toFixed(2)}</p>
              <table>
                <thead><tr><th>Objeto</th><th>Custo</th></tr></thead>
                <tbody>
                  {activity.objects.map((obj: any) => (
                    <tr key={obj.objectId}><td>{obj.objectType} - {obj.objectId}</td><td>R$ {obj.cost.toFixed(2)}</td></tr>
                  ))}
                </tbody>
              </table>
            </article>
          ))}
        </>
      )}
    </section>
  );
}
