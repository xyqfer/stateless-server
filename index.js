const path = require('path');
const request = require('request');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const express = require('express');

const { http, params, readability } = require(`${process.cwd()}/app-libs`);

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('x-powered-by', false);

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(cookieParser());

app.use(
  cors({
      origin: '*',
  })
);

app.use(express.static('public'));

app.get('/', (req, res) => res.send('Home Page'));
app.get('/proxyimage', (req, res) => {
  const { url } = req.query;
  const headers = {};

  if (req.headers.range) {
      headers.Range = req.headers.range;
  }

  request
    .get({
        url,
        headers,
    })
    .pipe(res);
});

app.get('/readability', async (req, res) => {
  const { url, imgProxy = '1' } = req.query;
  const { title, content } = await readability(url, imgProxy);

  res.render('archive', {
      title,
      content,
  });
});

app.get('/test', (req, res) => {
  res.render('test');
});

app.use('/api/v1', require('./api/v1/index'));

app.get('/youtube/video/:id', (req, res) => {
  const { id } = req.params;
  const trackUrl = encodeURIComponent(`https://invidious.xyz/api/v1/captions/${id}?label=English&hl=en-US`);

  res.render('video', {
    src: `https://v3zvmw0fii.avosapps.us/youtube/proxy/${id}`,
    track: `/proxyimage?url=${trackUrl}`,
  });
});

app.get('/theinitium', async (req, res) => {
  const { slug } = req.query;
  const render = 'archive';

  try {
      const response = await http.get({
          uri: `https://api.theinitium.com/api/v1/article/detail/?language=zh-hans&slug=${slug}`,
          json: true,
          headers: {
              'User-Agent': params.ua.pc,
              Authorization: `Basic ${process.env.THEINITIUM_TOKEN}`,
          },
      });

      const $ = cheerio.load(response.content);
      $('img').each(function() {
          const $elem = $(this);
          const src = $elem.attr('src');

          if (!src.startsWith('data:')) {
              $elem.attr('src', '/proxyimage?url=' + encodeURIComponent(src));
          }
      });

      res.render(render, {
          title: response.headline,
          content: $.html(),
      });
  } catch (err) {
      console.error(err);
      res.render(render, {
          title: '',
          content: '',
      });
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on ${port}, http://localhost:${port}`));