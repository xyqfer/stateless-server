const request = require('request');
const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Home Page Route'));
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

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on ${port}, http://localhost:${port}`));