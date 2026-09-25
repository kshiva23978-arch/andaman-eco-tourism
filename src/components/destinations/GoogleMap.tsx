export function GoogleMap({
  query,
  title,
  className = "",
}: {
  query: string;
  title: string;
  className?: string;
}) {
  const src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;

  return (
    <iframe
      src={src}
      title={`Map showing ${title}`}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className={`h-full w-full border-0 ${className}`}
    />
  );
}
