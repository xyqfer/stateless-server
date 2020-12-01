const { http } = require(`${process.cwd()}/app-libs`);

module.exports = async (req, res) => {
  const { url } = req.query;

  const response = await http.get({
      uri: url,
      headers: {
          'user-agent': 'Mozilla / 5.0(Linux; Android 6.0.1; Nexus 5X Build / MMB29P) AppleWebKit / 537.36(KHTML, like Gecko) Chrome / 80.0.3987.92 Mobile Safari / 537.36(compatible; Googlebot / 2.1; +http://www.google.com/bot.html)',
      },
  });

  res.send(response);
};