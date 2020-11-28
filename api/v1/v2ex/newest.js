const rp = require('request-promise');
const { params } = require('app-libs');
const parsePage = require('./utils/parseHomePage');

module.exports = (req, res) => {
    rp.get({
        uri: 'https://www.v2ex.com/changes',
        headers: {
            'User-Agent': params.ua.pc,
        },
    })
        .then((htmlString) => {
            res.json({
                success: true,
                data: parsePage(htmlString),
            });
        })
        .catch((err) => {
            console.log(err);
            res.json({
                success: false,
                msg: 'v2ex newest 获取失败',
            });
        });
};