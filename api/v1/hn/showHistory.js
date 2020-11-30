const width = 375;
const height = 2000;

function encodeUrl(fullUrl) {
  const url = new URL(fullUrl);
  return url.origin + url.pathname + encodeURIComponent(url.search) + encodeURIComponent(url.hash);
}

function formatUrl(url) {
  return process.env.IMAGE_PROXY + encodeURIComponent('https://render-tron.appspot.com/screenshot/' + encodeUrl(url) + `?width=${width}&height=${height}`);
}

function getFallbackUrl(url) {
  return process.env.LINK_PREVIEW2 + encodeUrl(url) + `?width=${width}&height=${height}`;
}

module.exports = (req, res) => {
  const page = parseInt(req.query.page);
  const count = 10;
  const data = require(`${process.cwd()}/hn_show.json`);
  let content = ''; 

  for (let i = (page - 1) * count; i < page * count; i++) {
    const item = data[i];
    if (item) {
      const host = (new URL(item.link)).host;
      const preview = formatUrl(item.link);
      const fallbackUrl = getFallbackUrl(item.link);
      const readerViewUrl = process.env.READER_VIEW_URL + encodeURIComponent(item.link);

      content += `
        <div style="margin-bottom: 30px">
            <a href="${item.link}" target="_blank">
                <h4>${item.title}</h4>
            </a>
            <div>
                <style>pre {width: initial !important;}</style>
                <img src="${preview}" alt="${host}" onerror="this.onerror=null;this.src='${fallbackUrl}'" referrerpolicy="no-referrer"><br>
                <a href="${readerViewUrl}" target="_blank">Reader View</a>
            </div>
        </div>
      `;
    }
  }

  content += `
    <br>
    <a href="./showHistory?page=${page + 1}">Next</a>
    <br>
  `;

  res.render('archive', {
      title: `Hn history - P${page}`,
      content,
  });
};