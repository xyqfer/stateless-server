const { http } = require(`${process.cwd()}/app-libs`);
const utils = require('./utils');

const parseContentFromRaw = (raw) =>
    raw.map((i) => {
        if (i.type === 'text') {
            return `<p>${i.message.split('\n').join('<br>')}</p>`;
        } else if (i.type === 'image') {
            return `<div class="img-container" style="text-align: center;">
                <img referrerpolicy="no-referrer" src="${i.url.replace('http:', 'https:')}">
                <p class="image-caption" style="text-align: center;">${i.description}</p></div>`;
        } else {
            return '';
        }
    }).join('');

const parseMsg = (msg, pics = []) => {
    let content = msg.split('\n').join('<br>');

    content += pics.reduce((acc, pic) => {
        const url = pic.replace('http:', 'https:');
        acc += `
            <div class="img-container" style="text-align: center;">
                <img referrerpolicy="no-referrer" src="${url}">
            </div>`;
        return acc
    }, '')

    return content;
}

module.exports = async (req, res) => {
    const { id } = req.params;
    const config = {
        json: true,
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-Sdk-Int': '28',
            'X-Sdk-Locale': 'zh-CN',
            'X-App-Id': 'com.coolapk.market',
            'X-App-Version': '9.2.2',
            'X-App-Code': '1905301',
            'X-Api-Version': '9',
            'X-App-Device': utils.getCoolapkDeviceToken(),
            'X-App-Token': utils.getCoolapkAppToken(),
        },
    };
    let content = ''
    let title = ''
    

    try {
        const { data } = await http.get(`https://www.coolapk.com/feed/${id}`, config);
        title = data.title;
        content = parseContentFromRaw(JSON.parse(data.message_raw_output));
    } catch(err) {
        const res = await http.get(`https://api.coolapk.com/v6/feed/detail?id=${id}`, config);
        title = res.data.title;
        content = parseMsg(res.data.message, res.data.picArr);
    }

    res.render('archive', {
        title,
        content,
    });
};
