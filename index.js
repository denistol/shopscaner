if (!process.env.TELEGRAM_TOKEN) {
    console.log('Telegram token not found');
    process.exit(1);
};
const telegram = require('telegram-bot-api');
const fs = require('fs');
const path = require('path');
const api = new telegram({ token: process.env.TELEGRAM_TOKEN });
const chatIds = ['371041145','266476630'];
const sendMessage = (text) => {
    chatIds.forEach(chat_id => {
        api.sendMessage({ chat_id, text })
    });
};
const tehnoskarb = require('./tehnoskarb')
const tehnostock = require('./tehnostock')

const compareWrite = (fname ,newItems) => {
	const fpath = path.join(__dirname,fname)
	const prevItems = fs.existsSync(fpath) ? JSON.parse(fs.readFileSync(fpath)) : null
	
	if(prevItems && prevItems.length && newItems && newItems.length){
		// CMP
		const newItemsUrls = newItems.map(e=>e.url)
		const prevItemsUrls = prevItems.map(e=>e.url)
		newItemsUrls.forEach( nUrl=> {
			if( !prevItemsUrls.includes(nUrl) ){
				sendMessage(`[*] Добавлен товар [*] ${nUrl}`)
			}
		})

		newItems.forEach( n => {
			let found = prevItems.find( el => n.url === el.url )
			if( found && Number(found.count) < Number(n.count) ){
				sendMessage(`[*] Добавлено предложение [*] ${n.url}`)
			}
		} )
	}

	fs.writeFileSync(fpath,JSON.stringify(newItems,null,4))
}

const main = async () => {
	const tehnoskarbArray = await tehnoskarb().then(data=>data)
	const tehnostockArray = await tehnostock().then(data=>data)
	compareWrite('tehnoskarb.json',tehnoskarbArray)
	compareWrite('tehnostock.json',tehnostockArray)
	console.log('[+] done loop')
}
main()