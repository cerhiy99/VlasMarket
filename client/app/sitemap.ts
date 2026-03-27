import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://baylap.com';
const IMG_URL = process.env.NEXT_PUBLIC_SERVER;
const LANGUAGES = ['', 'ru/']; // Підтримувані мови
const revalidateTime = 3600; // Час оновлення

// Статичні сторінки
const STATIC_PAGES = [
  'about-us',
  'brands',
  'cooperation',
  'delivery',
  'how-place-order',
  'offer-agreement',
  'pay',
  'return-goods',
  'contact',
];
const dynamicPages = ['blog', 'brands/[brend]', 'discount', 'goods'];

// Генерація URL з альтернативними мовами
function generateLocalizedUrls(path: string) {
  const alternates = LANGUAGES.reduce(
    (acc, lang) => {
      acc[lang] = `${BASE_URL}/${lang}${path}`;
      return acc;
    },
    {} as Record<string, string>
  );

  return alternates;
}

// Генерація статичних сторінок
function generateStaticPages() {
  return [
    ...STATIC_PAGES.flatMap((page) =>
      LANGUAGES.map((lang) => ({
        url: `${BASE_URL}/${lang}${page}`,
        lastModified: new Date(),
        alternates: generateLocalizedUrls(`${page}`),
      }))
    ),
    ...LANGUAGES.map((lang) => ({
      url: `${BASE_URL}/${lang}`,
      lastModified: new Date(),
      alternates: generateLocalizedUrls(''),
    })),
  ];
}

async function generateDynamicGoodsPages() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER}goods/getForSiteMapCatalog`, {
    next: { revalidate: revalidateTime },
  });
  if (!response.ok) throw new Error('Failed to fetch goods pages');
  const data = await response.json();

  // Припустимо, що data.countPages повертає число, наприклад, 3
  const numberOfPages = data.countPages;

  // Створюємо масив з чисел від 1 до numberOfPages
  const pagesArray = Array.from({ length: numberOfPages }, (_, i) => i + 1);

  return LANGUAGES.map((lang) => ({
    url: `${BASE_URL}/${lang}goods/1`,
    lastModified: new Date(),
    alternates: generateLocalizedUrls(`/goods/1`),
  }));
}

// Функція для генерації динамічних URL для сторінок категорій
async function generateDynamicGoodsPagesCategory() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER}goods/getForSiteMapCategory`, {
    next: { revalidate: revalidateTime },
  });
  if (!response.ok) throw new Error('Failed to fetch goods pages');
  const data = await response.json();

  // 'data' — це масив об'єктів, тому ми ітеруємо безпосередньо по ньому
  const categoriesWithPages = data as { url: string; countPages: number }[];

  // Використовуємо flatMap, щоб згладити масиви URL в один загальний масив
  return categoriesWithPages.flatMap(({ url, countPages }) => {
    // Створюємо масив номерів сторінок для поточної категорії
    const pageNumbers = [1];

    // Ітеруємо по кожному номеру сторінки та мові
    return pageNumbers.flatMap((pageNumber) =>
      LANGUAGES.map((lang) => ({
        url: `${BASE_URL}/${lang}goods/${url}/${pageNumber}`,
        lastModified: new Date(),
        alternates: generateLocalizedUrls(`/goods/${url}/${pageNumber}`),
      }))
    );
  });
}

// Функція для генерації динамічних URL для сторінок категорій
async function generateDynamicGoodsPagesSubcategory() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER}goods/getSubcategoryForSiteMap`,
    { next: { revalidate: revalidateTime } }
  );
  if (!response.ok) throw new Error('Failed to fetch goods pages');
  const data = await response.json();

  // 'data' — це масив об'єктів, тому ми ітеруємо безпосередньо по ньому
  const categoriesWithPages = data as { url: string; countPages: number }[];

  // Використовуємо flatMap, щоб згладити масиви URL в один загальний масив
  return categoriesWithPages.flatMap(({ url, countPages }) => {
    // Створюємо масив номерів сторінок для поточної категорії
    const pageNumbers = Array.from({ length: countPages }, (_, i) => i + 1);

    // Ітеруємо по кожному номеру сторінки та мові
    return LANGUAGES.map((lang) => ({
      url: `${BASE_URL}/${lang}goods/${url}/1`,
      lastModified: new Date(),
      alternates: generateLocalizedUrls(`/goods/${url}/1`),
    }));
  });
}

async function generateDynamicBrend() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER}goods/getBrendsForSitemap`, {
    next: { revalidate: revalidateTime },
  });
  if (!response.ok) throw new Error('Failed to fetch goods pages');
  const data = await response.json();

  // 'data' — це масив об'єктів, тому ми ітеруємо безпосередньо по ньому
  const categoriesWithPages = data as { url: string; countPages: number }[];

  // Використовуємо flatMap, щоб згладити масиви URL в один загальний масив
  return categoriesWithPages.flatMap(({ url, countPages }) => {
    // Створюємо масив номерів сторінок для поточної категорії
    const pageNumbers = [1];

    // Ітеруємо по кожному номеру сторінки та мові
    return pageNumbers.flatMap((pageNumber) =>
      LANGUAGES.map((lang) => ({
        url: `${BASE_URL}/${lang}brands/${url}/${pageNumber}`,
        lastModified: new Date(),
        alternates: generateLocalizedUrls(`/brands/${url}/${pageNumber}`),
      }))
    );
  });
}

async function generateDynamicDiscountPages() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER}goods/GetDiscountFromSitemap`,
    { next: { revalidate: revalidateTime } }
  );
  if (!response.ok) throw new Error('Failed to fetch goods pages');
  const data = await response.json();

  // Припустимо, що data.countPages повертає число, наприклад, 3
  const numberOfPages = data;

  // Створюємо масив з чисел від 1 до numberOfPages
  const pagesArray = Array.from({ length: numberOfPages }, (_, i) => i + 1);

  return pagesArray.flatMap((pageNumber: number) =>
    LANGUAGES.map((lang) => ({
      url: `${BASE_URL}/${lang}discount/${pageNumber}`,
      lastModified: new Date(),
      alternates: generateLocalizedUrls(`/discount/${pageNumber}`),
    }))
  );
}

async function generateDynamicBlogPages() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER}blog/getForSiteMap`, {
    next: { revalidate: revalidateTime },
  });
  if (!response.ok) throw new Error('Failed to fetch goods pages');
  const data = await response.json();

  // Припустимо, що data.countPages повертає число, наприклад, 3
  const numberOfPages = data;

  // Створюємо масив з чисел від 1 до numberOfPages
  const pagesArray = Array.from({ length: numberOfPages }, (_, i) => i + 1);

  return pagesArray.flatMap((pageNumber: number) =>
    LANGUAGES.map((lang) => ({
      url: `${BASE_URL}/${lang}blog/${pageNumber}`,
      lastModified: new Date(),
      alternates: generateLocalizedUrls(`/bog/${pageNumber}`),
    }))
  );
}

async function generateDynamicSelectGoods() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER}goods/getSelectGoodsForSitemapWithImg`,
    { next: { revalidate: revalidateTime } }
  );
  if (!response.ok) throw new Error('Failed to fetch goods pages');
  const data = await response.json();

  // Припустимо, що data.countPages повертає число, наприклад, 3
  const urls = data;

  // Створюємо масив з чисел від 1 до numberOfPages
  /*return urls.flatMap((x: any) =>
    LANGUAGES.map((lang) => {
      // Безпечно отримуємо масив картинок
      const imagesArray = x.imgs || x.img || [];

      return {
        url: `${BASE_URL}/${lang}goods/${x.url}`,
        lastModified: new Date(),
        alternates: generateLocalizedUrls(`/goods/${x.url}`),
        // Передаємо просто масив рядків з повними URL
        images: imagesArray.map((img: any) => `${IMG_URL}${img.img}`),
      };
    })
  );*/
  return urls.flatMap((x: any) =>
    LANGUAGES.map((lang) => ({
      url: `${BASE_URL}/${lang}goods/${x.url}`,
      lastModified: new Date(),
      alternates: generateLocalizedUrls(`/goods/${x.url}`),
      images: x.img.map((img: any) => `${BASE_URL}${IMG_URL}${img.img}`),
    }))
  );
}

async function generateDynamicSelectBlogs() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER}blog/getBlogForSiteMap`, {
    next: { revalidate: revalidateTime },
  });
  if (!response.ok) throw new Error('Failed to fetch goods pages');
  const data = await response.json();

  // Припустимо, що data.countPages повертає число, наприклад, 3
  const urls = data;
  console.log(4234324, urls);

  // Створюємо масив з чисел від 1 до numberOfPages

  return urls.flatMap((url: number) =>
    LANGUAGES.map((lang) => ({
      url: `${BASE_URL}/${lang}blog/${url}`,
      lastModified: new Date(),
      alternates: generateLocalizedUrls(`/blog/${url}`),
    }))
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    ...generateStaticPages(),
    ...(await generateDynamicGoodsPages()),
    ...(await generateDynamicGoodsPagesCategory()),
    ...(await generateDynamicGoodsPagesSubcategory()),
    ...(await generateDynamicBrend()),
    ...(await generateDynamicDiscountPages()),
    ...(await generateDynamicSelectGoods()),
    ...(await generateDynamicBlogPages()),
    ...(await generateDynamicSelectBlogs()),
  ];
}
