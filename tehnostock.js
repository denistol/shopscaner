const puppeteer = require('puppeteer');
const url = 'https://technostock.com.ua/catalog/noutbuki-kompjutery-planshety/igrovye-konsoli?p='
const cheerio = require('cheerio');
const pagesCount = 2
const main = async () => {
		console.log('start tehnostock...')
		let results = []
		const browser = await puppeteer.launch({headless: true, args:['--no-sandbox']});
		const page = await browser.newPage();
		let urls = []
		for(let p = 1; p <= pagesCount; p++) {
			await page.goto(`${url}${p}`);
			let content = await page.content().then(c => c);
			let $ = cheerio.load(content, { decodeEntities: false });
			$('a.product-image').each((i,el)=>{
				let u = $(el).attr('href')
				urls.push(u)
			})
		}
		for(let u of urls) {
			await page.goto('https://technostock.com.ua/microsoft-xbox-360-slim-250gb')
			let content = await page.content().then(c => c);
			let $ = cheerio.load(content, { decodeEntities: false });
			let items = $('.availability-only').attr('title').toString()
			results.push({
				url:u,
				count: items.match(/\d+/g)[0]
			})
		}
		await browser.close()
		return results
}
module.exports = main