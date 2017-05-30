import { krakenController } from '../controllers/kraken'
import { bittrexController } from '../controllers/bittrex';
import { yunbiController } from '../controllers/yunbi';


export function homeController() {


    let p1 = krakenController(),
        p2 = yunbiController();
    Promise.all([p1, p2])
        .then((data, data2) => {
            let krakenData = data[0].tickers,
                yunbiData = data[1],
                krakenTickers = [],
                yunbiTickers = [],
                commonTickers;

            for (let ticker in krakenData) {
                krakenTickers.push(krakenData[ticker].name);
            }
            for (let ticker in yunbiData) {
                if (yunbiData[ticker].name === 'BTCCNY') {
                    yunbiData[ticker].name = 'XBTCNY';
                }
                yunbiTickers.push(yunbiData[ticker].name.slice(0, 3));
            }
            krakenTickers.forEach((ticker) => {

            })
            console.log(yunbiTickers);
            console.log(krakenTickers);
            console.log(commonTickers);


        })






}