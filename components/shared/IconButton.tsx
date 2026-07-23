export function IconButton({
  children,
  href,
  onClick,
  active,
  label,
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  active?: boolean;
  label: string;
}) {
  const Tag = href ? "a" : "button";
  return (
    <Tag
      href={href}
      onClick={onClick}
      type={href ? undefined : "button"}
      aria-label={label}
      title={label}
      data-active={active ? "true" : undefined}
      className="pm-icon-btn"
    >
      {children}
    </Tag>
  );
}
