```sudo apt-get -y install curl;
sudo apt-get -y install git;
sudo apt install -y gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget;
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -;
cd ~ ;
git clone https://github.com/denistol/shopscaner.git;
npm install --prefix shopscaner;
while true;
do TELEGRAM_TOKEN=<TOKEN> npm run --prefix ~/shopscaner start;
sleep 30;
done;```
