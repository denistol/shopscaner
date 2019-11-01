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
const filePath2 = path.join(__dirname, 'data2.json');
const chatIds = ['371041145','266476630'];
const url = `https://tehnoskarb.ua/igrovye-pristavki/c72?page=1?s=novelties`;
const url2 = (page) => `https://technostock.com.ua/catalog/noutbuki-kompjutery-planshety/igrovye-konsoli?p=${page}`
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
	// check tehnostock
	const page = await browser.newPage();
	await page.goto(url2(1));
	let content = await page.content().then(c => c);
	let $ = cheerio.load(content, { decodeEntities: false });
	let newResults2 = {}
	$('.item-inner').each( (i,el) => {
		const item = $(el)
		const url = item.find('a').attr('href')	
		newResults2[i] = url
	})
	let oldResults2 = fs.existsSync(filePath2) ? JSON.parse(fs.readFileSync(filePath2)) : null
	fs.writeFileSync(filePath2, JSON.stringify(newResults2, null, 2));

	// diff
	if(oldResults2){
		const oldItems = Object.keys( oldResults2 ).map(el => oldResults2[el])
		const newItems = Object.keys( newResults2 ).map(el => newResults2[el])
		oldItems.forEach( el => {
			if( !newItems.includes(el) ){
				sendMessage(`Новое предложение ${el}`);
			}
		} )
		console.log('done2')
		
	}
    await browser.close();
};

main();