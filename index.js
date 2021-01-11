const path = require('path');
const request = require('request');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const express = require('express');

const { params, readability } = require(`${process.cwd()}/app-libs`);

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('x-powered-by', false);

app.locals({
  cdnHost: process.env.CDN_HOST,
});

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
  const { url, m } = req.query;
  const headers = {};

  if (req.headers.range) {
      headers.Range = req.headers.range;
  }

  if (m) {
    headers['user-agent'] = params.ua.mobile;
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
  res.render('test', {
    token: process.env.IPAD_PUSH_TOKEN,
  });
});

app.use('/api/v1', require('./api/v1/index'));

app.get('/youtube/video/:id', (req, res) => {
  const { id } = req.params;
  const trackUrl1 = encodeURIComponent(`https://invidious.xyz/api/v1/captions/${id}?label=English&hl=en-US`);
  const trackUrl2 = encodeURIComponent(`https://invidious.xyz/api/v1/captions/${id}?label=English%20(auto-generated)&hl=en-US`);

  res.render('video', {
    src: `https://v3zvmw0fii.avosapps.us/youtube/proxy/${id}`,
    track1: `/proxyimage?url=${trackUrl1}`,
    track2: `/proxyimage?url=${trackUrl2}`,
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on ${port}, http://localhost:${port}`));