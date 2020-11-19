const path = require('path');
const request = require('request');
const { Readability } = require('@mozilla/readability');
const JSDOM = require('jsdom').JSDOM;
const cheerio = require('cheerio');
const { http } = require('./app-libs');
const express = require('express');
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('x-powered-by', false);

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
  const { url } = req.query;
  const response = await http.get({
      uri: url,
  });

  const doc = new JSDOM(response, {
    url
  });
  const reader = new Readability(doc.window.document);
  const article = reader.parse();

  const $ = cheerio.load(article.content);
  $('img').each(function() {
      const $elem = $(this);
      const src = $elem.attr('src');

      if (src && !src.startsWith('data:')) {
          $elem.attr('src', process.env.IMAGE_PROXY + encodeURIComponent(src));
      }

      $elem.removeAttr('srcset');
      $elem.removeAttr('width');
      $elem.removeAttr('height');
      $elem.removeAttr('sizes');
  });

  res.render('archive', {
      title: article.title,
      content: $('body').html(),
  });
});

app.get('/test', async (req, res) => {
  res.render('test');
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on ${port}, http://localhost:${port}`));