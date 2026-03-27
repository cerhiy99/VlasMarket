const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Налаштування для Sass (вирішує проблему з @import)
  sassOptions: {
    // Це дозволяє Sass шукати файли від кореня.
    // Навіть якщо шлях починається з @/app/..., Sass загляне в корінь проекту.
    includePaths: [path.join(__dirname, './')],
  },

  // 2. Налаштування для Turbopack (Next.js 16 за замовчуванням)
  turbopack: {
    resolveAlias: {
      // Жорстко прописуємо аліас для нового збирача
      '@': './',
    },
    rules: {
      // Підтримка SVG через Turbopack
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  // 3. Налаштування зображень (перейшли з domains на remotePatterns)
  images: {
    //loader: 'custom',
    //loaderFile: './utils/imageLoader.ts', // шлях до файлу, який ми створили вище
    remotePatterns: [{ protocol: 'https', hostname: 'baylap.com' }],
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      //{ protocol: 'http', hostname: 'localhost:4444' },
      //{ protocol: 'http', hostname: '127.0.0.1' },
      //{ protocol: 'http', hostname: '127.0.0.1:4444' },
      { protocol: 'https', hostname: 'baylap.com' },
      //{ protocol: 'http', hostname: '192.168.0.177' },
    ],
    unoptimized: true,

    //formats: ['image/avif', 'image/webp'],
    //deviceSizes: [400, 650], // Розміри для іконок чи дрібних елементів (можна залишити порожнім, якщо не треба)
    //imageSizes: [],
  },

  // 4. Сумісність зі старим Webpack (якщо запускати з --webpack)
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    config.resolve.alias['@'] = path.resolve(__dirname);
    return config;
  },

  typescript: {
    ignoreBuildErrors: true,
  },
  //trailingSlash: false,
  //skipTrailingSlashRedirect: true,
};

module.exports = nextConfig;
