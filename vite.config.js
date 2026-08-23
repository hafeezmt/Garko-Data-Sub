import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      {
        name: 'api-routes-dev-server',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url.startsWith('/api/')) {
              const urlPath = req.url.split('?')[0];
              try {
                let handlerModule;
                if (urlPath === '/api/vtpass/variations') {
                  handlerModule = await import('./api/vtpass/variations.js');
                } else if (urlPath === '/api/vtpass/pay') {
                  handlerModule = await import('./api/vtpass/pay.js');
                } else if (urlPath === '/api/vtpass/balance') {
                  handlerModule = await import('./api/vtpass/balance.js');
                } else if (urlPath === '/api/paystack/verify') {
                  handlerModule = await import('./api/paystack/verify.js');
                }

                if (handlerModule && handlerModule.default) {
                  // Helper to parse query and body in dev middleware
                  const urlObj = new URL(req.url, `http://${req.headers.host}`);
                  req.query = Object.fromEntries(urlObj.searchParams);

                  if (req.method === 'POST') {
                    const buffers = [];
                    for await (const chunk of req) {
                      buffers.push(chunk);
                    }
                    const data = Buffer.concat(buffers).toString();
                    req.body = data ? JSON.parse(data) : {};
                  }

                  // Mock Vercel res helper methods if needed
                  res.status = (code) => {
                    res.statusCode = code;
                    return res;
                  };
                  res.json = (data) => {
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(data));
                    return res;
                  };

                  // Assign environment variables for dev execution
                  process.env = { ...process.env, ...env };

                  return await handlerModule.default(req, res);
                }
              } catch (err) {
                console.error('Dev API Route Error:', err);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ error: err.message || 'Server error' }));
              }
            }
            next();
          });
        }
      }
    ]
  };
});
