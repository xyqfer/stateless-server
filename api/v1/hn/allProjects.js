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
  const data = require(`${process.cwd()}/allProjects.json`);
  let content = ''; 

  for (let i = (page - 1) * count * 2; i < (page * count * 2); i += 2) {
    const title = data[i];
    const link = data[i + 1];

    if (title && link) {
      const host = (new URL(link)).host;
      const preview = formatUrl(link);
      const fallbackUrl = getFallbackUrl(link);
      const readerViewUrl = process.env.READER_VIEW_URL + encodeURIComponent(link);

      content += `
        <div style="margin-bottom: 30px">
            <a href="${link}" target="_blank">
                <h4>${title}</h4>
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
    <a href="./allProjects?page=${page + 1}">Next</a>
    <br>
  `;

  res.render('archive', {
      title: `Hn allProjects - P${page}`,
      content,
  });
};