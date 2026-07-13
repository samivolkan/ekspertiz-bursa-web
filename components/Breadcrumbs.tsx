import Link from "next/link";

export function Breadcrumbs({ items }: { items: Array<{ label: string; href?: string }> }) {
  return (
    <nav className="page-breadcrumbs" aria-label="Sayfa yolu">
      {items.map((item, index) => (
        <span className="page-breadcrumb-item" key={`${item.label}-${index}`}>
          {index ? <span aria-hidden="true">/</span> : null}
          {item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}
