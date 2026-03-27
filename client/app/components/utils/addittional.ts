export function toSlug(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, '-');
}

export function fromSlug(slug: string): string {
  return slug.replace(/-/g, ' ').toUpperCase();
}
