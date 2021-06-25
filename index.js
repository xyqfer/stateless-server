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

app.locals.cdnHost = process.env.CDN_HOST;
app.locals.usServerHost = process.env.US_SERVER_HOST;

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
  
  });
});

app.use('/api/v1', require('./api/v1/index'));

app.get('/youtube/video/:id', (req, res) => {
  const { id } = req.params;

  res.render('video', {
    src: `https://invidious.kavin.rocks/latest_version?id=${id}&itag=22&local=true`,
    track: `https://invidious.kavin.rocks/api/v1/captions/${id}?lang=en&tlang=zh-Hans&label=Chinese`,
  });
});

app.get('/archive', (req, res) => {
  const AV = require('leancloud-storage');
  const { id } = req.query;

  AV.init({
    appId: process.env.DB_APP_ID,
    appKey: process.env.DB_APP_KEY,
  });

  const query = new AV.Query('Archive');
  query.equalTo('uuid', id);
  query.find().then((items) => {
    const { title = '', content = '' } = items[0].toJSON();
    res.render('archive2', {
      title,
      content,
    });
  });
});

app.get('/archive2', async (req, res) => {
  const { http } = require(`${process.cwd()}/app-libs`);
  const { id } = req.query;

  const data = await http.get({
    json: true,
    uri: `${process.env.CACHE_URL}${id}`,
  });
  const { title = '', content = '' } = data;
  res.render('archive2', {
    title,
    content,
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on ${port}, http://localhost:${port}`));