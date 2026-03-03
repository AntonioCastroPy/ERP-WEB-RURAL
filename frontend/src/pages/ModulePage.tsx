interface ModulePageProps {
  title: string;
  bullets: string[];
}

export function ModulePage({ title, bullets }: ModulePageProps) {
  return (
    <section>
      <h2>{title}</h2>
      <ul>
        {bullets.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </section>
  );
}
