sudo apt-get -y install curl;
sudo apt-get -y install git;
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -;
cd ~ ;
git clone https://github.com/denistol/shopscaner.git;
npm install --prefix shopscaner;
while true;
do TELEGRAM_TOKEN=<TOKEN> npm run --prefix ~/shopscaner start;
sleep 10;
done;