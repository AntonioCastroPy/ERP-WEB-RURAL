import { ReactNode } from 'react';

interface EntityPageLayoutProps {
  title: string;
  description: string;
  actionBar: ReactNode;
  children: ReactNode;
}

export function EntityPageLayout({ title, description, actionBar, children }: EntityPageLayoutProps) {
  return (
    <section>
      <header className="entity-header">
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </header>
      <div className="action-bar">{actionBar}</div>
      <article className="panel">{children}</article>
    </section>
  );
}
