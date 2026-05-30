import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
export default defineConfig({
  plugins: [
    tailwindcss(),
    {
      name: 'clean-urls',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const pathname = req.url.split('?')[0];
          if (pathname === '/menu') {
            req.url = '/menu.html';
          } else if (pathname === '/account') {
            req.url = '/account.html';
          } else if (pathname === '/products') {
            req.url = '/products.html';
          } else if (pathname === '/order') {
            req.url = '/order.html';
          } else if (pathname === '/product-detail') {
            req.url = '/product-detail.html';
          }
          next();
        });
      }
    }
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        services: resolve(__dirname, 'services.html'),
        menu: resolve(__dirname, 'menu.html'),
        products: resolve(__dirname, 'products.html'),
        contact: resolve(__dirname, 'contact.html'),
        order: resolve(__dirname, 'order.html'),
        account: resolve(__dirname, 'account.html'),
        'product-detail': resolve(__dirname, 'product-detail.html'),
      },
    },
  },
})
