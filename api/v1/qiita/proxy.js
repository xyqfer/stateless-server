const { crawler } = require(`${process.cwd()}/app-libs`);

module.exports = async (req, res) => {
  const { url } = req.query;
  const $ = await crawler(url);
  $('script').remove();

  res.send($.html());
};