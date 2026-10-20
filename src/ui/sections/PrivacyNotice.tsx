import type { Block, Inline, PrivacyNoticeView } from "@/application/privacy/view";

function Text({ content }: { content: readonly Inline[] }) {
  return content.map((part, index) => (typeof part === "string" ? part : <a key={index} href={part.href}>{part.label}</a>));
}

function NoticeBlock({ block }: { block: Block }) {
  if (block.kind === "paragraph") return <p><Text content={block.content} /></p>;
  // Termed items (rights, processors, retention) read as a definition list; plain items as bullets.
  if (block.items.every((item) => item.term)) {
    return (
      <dl className="doc-terms">
        {block.items.map((item) => (
          <div key={item.term}>
            <dt>{item.term}</dt>
            <dd><Text content={item.content} /></dd>
          </div>
        ))}
      </dl>
    );
  }
  return (
    <ul className="doc-list" role="list">
      {block.items.map((item, index) => <li key={index}><Text content={item.content} /></li>)}
    </ul>
  );
}

export function PrivacyNotice({ view }: { view: PrivacyNoticeView }) {
  return (
    <article className="doc" aria-labelledby="doc-title">
      <header className="doc-head" data-theme="dark">
        <div className="doc-head-card">
          <div className="doc-head-in">
            <h1 className="display" id="doc-title">{view.head.title}</h1>
            <p className="doc-updated">
              {view.head.updatedLabel} <time dateTime={view.head.updatedIso}>{view.head.updated}</time>
            </p>
            <p className="sub">{view.head.intro}</p>
          </div>
        </div>
      </header>

      <div className="wrap doc-body">
        <nav className="doc-toc" aria-labelledby="doc-toc-title">
          <p className="doc-toc-title" id="doc-toc-title">{view.contentsLabel}</p>
          <ol role="list">
            {view.sections.map((section) => (
              <li key={section.id}><a href={`#${section.id}`}>{section.heading}</a></li>
            ))}
          </ol>
        </nav>

        <div className="doc-prose">
          {view.sections.map((section) => (
            <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`}>
              <h2 id={`${section.id}-title`}>{section.heading}</h2>
              {section.blocks.map((block, index) => <NoticeBlock key={index} block={block} />)}
            </section>
          ))}

          <aside className="doc-contact" aria-labelledby="doc-contact-title">
            <h2 id="doc-contact-title">{view.contact.heading}</h2>
            <p>{view.contact.body}</p>
            <a className="pill-link" href={view.contact.email.href}>
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <rect x="1.5" y="3.5" width="13" height="9" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <path d="m2.5 5 5.5 4 5.5-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>{view.contact.email.address}</span>
            </a>
          </aside>
        </div>
      </div>
    </article>
  );
}
