const request = require('sync-request');
const rp = require('request-promise');
const cheerio = require('cheerio');
var fs = require('fs');

var baseLink = "https://www.builtinnyc.com";
var options = {
    uri: "",
    transform: function (body) {
        return cheerio.load(body);
    }
};

// let initCompanies = () => {
//     let raw = fs.readFileSync('./', 'utf8');
//     tickers = raw.split('\n');
//
//     return tickers
// };

let writeCompanies = async (profiles) => {
    for (let i = 0; i < profiles.length; i++) {
        await fs.appendFileSync('companies.txt', profiles[i][0] + "," + profiles[i][1] + "\n");
    }
}

let search = async (pageNumber) => {
    var res = await request('GET', 'https://www.builtinnyc.com/companies?f[0]=total_employees%3A%5B501%20TO%20%2A%5D&f[1]=total_employees%3A%5B201%20TO%20500%5D&f[2]=total_employees%3A%5B51%20TO%20200%5D&f[3]=total_employees%3A%5B11%20TO%2050%5D&page=' + pageNumber, options);
    html = res.getBody().toString('utf8');
    var $ = cheerio.load(html);
    var companies = $(".main-content-first > .title").map(function(){return ($(this).text());}).get();
    var links = $(".wrap-view-page > a").map(function(){return $(this).attr('href')}).get();

    let profiles = companies.map((e, i) => [e, baseLink + links[i]]);
    writeCompanies(profiles);
    console.log(profiles);
};



async function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}
async function main(){
	for(let i = 0; i < 19; i++){
		await search(i);
		console.log("sent")
		sleep(100);
	}

}
main();


