const loader = ({ src, width, quality }: { src: string; width: number; quality?: number }) => {
  // Якщо шлях вже повний (починається з http), повертаємо як є
  if (src.startsWith('http')) return src;

  // Якщо шлях відносний, додаємо домен бекенду
  // Використовуй свій NEXT_PUBLIC_API_SERVER (https://baylap.com)
  const baseUrl = 'https://baylap.com' + src;

  return baseUrl; //`${baseUrl}/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`;
};

export default loader;
