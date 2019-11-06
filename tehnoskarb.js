const puppeteer = require('puppeteer');
const url = 'https://tehnoskarb.ua/igrovye-pristavki/c72?page=1?s=novelties'
const cheerio = require('cheerio');

const main = async () => {
		console.log('start tehnoskarb...')
		const browser = await puppeteer.launch({headless: true, args:['--no-sandbox']});
        const page = await browser.newPage();
        await page.goto(url);
        let content = await page.content().then(c => c);
        let $ = cheerio.load(content, { decodeEntities: false });
        const items = $('.c-model').map((index, el) => {
            let item = $(el);
            let url = item.find('a').attr('href');
			let count = item.find('.c-model-count').text().match(/\d+/g)[0]
			return {url:`https://tehnoskarb.ua/${url}`, count}
        }).get();
		await browser.close()
		return items
}
module.exports = main