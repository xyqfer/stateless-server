const { crawler } = require(`${process.cwd()}/app-libs`);

module.exports = async (req, res) => {
  const { url } = req.query;
  const $ = await crawler(url);
  // $('html').attr('lang', 'ja-jp');
  $('script').remove();
  $('img').each(function() {
    const $img = $(this);
    const src = $img.attr('src');

    if (src.includes('s3-ap-northeast-1.amazonaws.com')) {
      $img.attr('src', '/proxyimage?url=' + encodeURIComponent(src));
    }
  });

  res.send($.html());
};