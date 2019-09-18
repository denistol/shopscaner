if (!process.env.TELEGRAM_TOKEN) {
    console.log('Telegram token not found');
    process.exit(1);
};

const telegram = require('telegram-bot-api');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const api = new telegram({ token: process.env.TELEGRAM_TOKEN });
const filePath = path.join(__dirname, 'data.json');
const chatIds = ['266476630'];
const url = `https://tehnoskarb.ua/igrovye-pristavki/c72?page=1?s=novelties`;

const sendMessage = (text) => {
    chatIds.forEach(chat_id => {
        api.sendMessage({ chat_id, text })
    });
};

const main = async () => {
    const browser = await puppeteer.launch({headless: true, args:['--no-sandbox']});
    try {
        const page = await browser.newPage();
        await page.goto(url);
        let content = await page.content().then(c => c);
        let $ = cheerio.load(content, { decodeEntities: false });
        let newResults = [];

        // grab products
        $('.c-item').each((index, el) => {
            let item = $(el);
            let url = item.find('a').attr('href');
            if (!url) return;
            let title = item.find('a').attr('title');
            let count = /\d+/.exec(item.find('div.item-count').text());
            let price = item.find('div.item-price').text();
            newResults.push({ title, url, count: count ? count[0] : false, price });
        });

        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify(newResults, null, 2));
            return;
        };
        let oldResults = JSON.parse(fs.readFileSync(filePath));

        newResults.forEach((val, index) => {
            if (!oldResults.map(el => el['url']).includes(val['url'])) {
                sendMessage(`Новый продукт https://tehnoskarb.ua/${val['url']}`);
            };

            oldResults.forEach((e, i) => {
                if (e['url'] === val['url'] && Number(e['count']) < Number(val['count'])) {
                    sendMessage(`Новое предложение https://tehnoskarb.ua/${val['url']}`);
                }
            })
        });

        fs.writeFileSync(filePath, JSON.stringify(newResults, null, 2));
        console.log('done');
    }
    catch {
        console.log("[!] Bot error");
        await browser.close();
    };
    await browser.close();
    process.exit(0);
};

main();