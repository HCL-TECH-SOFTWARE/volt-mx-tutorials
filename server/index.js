const path = require('path');
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const next = require('next');
const helmet = require('helmet');
const favicon = require('serve-favicon');
const routes = require('../routes');
const settings = require('../src/config/settings.json');

// Dynamic Sitemap XML script
const generateDynamicSitemap = require('./sitemap-script');

const dev = process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'testing';
const port = settings.PORT || 3200;
const app = next({ dev });

const handler = routes.getRequestHandler(app);

app.prepare().then(() => {
  const server = express();
  server.use(cors());
  server.use(helmet({
    frameguard: false,
  }));
  server.use(compression());
  server.use(cookieParser());
  server.use(favicon(path.join(__dirname, '../static', 'dist', 'images', 'basecampFavIcon.png')));

  const staticPath = path.join(__dirname, '../static');
  server.use(
    '/static',
    express.static(staticPath, {
      immutable: true,
    }),
  );
  server.use(
    '/_next',
    express.static(staticPath, {
      immutable: true,
    }),
  );
  server.use(
    '/.next',
    express.static(staticPath, {
      immutable: true,
    }),
  );

  server.get('/sitemap.xml', (req, res) => {
    res.contentType('application/xml');
    res.sendFile(path.join(__dirname, 'sitemap.xml'));
  });

  server.get('/robots.txt', (req, res) => {
    res.contentType('text/plain');
    res.sendFile(path.join(__dirname, 'robots.txt'));
  });

  server.get('/generate-sitemap', async (req, res) => {
    const result = await generateDynamicSitemap();
    res.json(result);
  });

  server.get('*', (req, res) => handler(req, res));

  function startServer() {
    server.listen(port, () => {
      console.log(`> Ready on http://localhost:${port}`);
    });
  }

  startServer();
});
