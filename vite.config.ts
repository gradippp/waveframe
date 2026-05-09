import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import tailwindcss from '@tailwindcss/vite';
import { resolve, join } from 'path';
import fs from 'fs';

const isAppBuild = process.env.BUILD_MODE === 'app';
const isDevBranch = process.env.IS_DEV === 'true';

export default defineConfig({
  base: isAppBuild ? (isDevBranch ? '/waveframe/dev/' : '/waveframe/') : '/',
  plugins: [
    react(),
    tailwindcss(),
    !isAppBuild &&
      dts({
        insertTypesEntry: true,
      }),
    {
      name: 'serve-audio-test',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (!req.url) return next();
          const url = new URL(req.url, 'http://localhost');
          const pathname = url.pathname;

          // 1. Handle /audio_test listing or file serving
          if (pathname === '/audio_test' || pathname === '/audio_test/') {
            const dirPath = join(process.cwd(), 'audio_test');
            if (fs.existsSync(dirPath)) {
              const files = fs.readdirSync(dirPath);
              res.setHeader('Content-Type', 'text/html');
              const list = files
                .map((f) => `<li><a href="/audio_test/${f}">${f}</a></li>`)
                .join('');
              return res.end(`<h1>Audio Test Files</h1><ul>${list}</ul>`);
            }
          }

          if (pathname.startsWith('/audio_test/')) {
            const filePath = join(process.cwd(), pathname);
            if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
              res.setHeader('Access-Control-Allow-Headers', 'Range');
              res.setHeader('Accept-Ranges', 'bytes');

              const ext = pathname.split('.').pop()?.toLowerCase();
              const mimeTypes: Record<string, string> = {
                mp3: 'audio/mpeg',
                wav: 'audio/wav',
                ogg: 'audio/ogg',
                aac: 'audio/aac',
                flac: 'audio/flac',
                m4a: 'audio/mp4',
              };

              if (ext && mimeTypes[ext]) {
                res.setHeader('Content-Type', mimeTypes[ext]);
              }
              return fs.createReadStream(filePath).pipe(res);
            }
          }

          // 2. Routing Guards (Only for dev server to prevent playground showing on all paths)
          const isViteInternal = pathname.startsWith('/@') || pathname.includes('?v=');
          const hasExtension = /\.[a-zA-Z0-9]+$/.test(pathname);
          const isRoot = pathname === '/' || pathname === '/index.html';

          if (!isRoot && !isViteInternal && !hasExtension && !pathname.startsWith('/audio_test')) {
            res.statusCode = 404;
            return res.end(`404 Not Found: ${pathname}`);
          }

          next();
        });
      },
    },
  ],
  build: isAppBuild
    ? {
        outDir: 'dist-app',
      }
    : {
        lib: {
          entry: resolve(__dirname, 'src/index.ts'),
          name: 'Waveframe',
          formats: ['es', 'umd'],
          fileName: (format) => `waveframe.${format}.js`,
        },
        rollupOptions: {
          external: ['react', 'react-dom', 'tailwindcss'],
          output: {
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM',
              tailwindcss: 'tailwindcss',
            },
          },
        },
      },
});
