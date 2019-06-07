const request = require('sync-request');
const rp = require('request-promise');
const cheerio = require('cheerio');
//const test = require('./test')
var fs = require('fs');

// const XlsxPopulate = require('xlsx-populate');
var baseLink = "https://www.builtinnyc.com";
var options = {
    uri: "",
    transform: function (body) {
        return cheerio.load(body);
    }
};

let initCompanies = () => {
    let raw = fs.readFileSync('./tickers', 'utf8');
    tickers = raw.split('\n');

    return tickers
};

let writeCompanies = async (companies, links) => {
    let results = [];
    for (let i = 0; i < arr.length; i++) {
        let result = await (searchHelper(arr[i]));
        await fs.appendFileSync('companies.txt', result +'\n');
        console.log(result);
    }
}

let search = async (pageNumber) => {
    var res = await request('GET', 'https://www.builtinnyc.com/companies?f[0]=total_employees%3A%5B501%20TO%20%2A%5D&f[1]=total_employees%3A%5B201%20TO%20500%5D&page=' + pageNumber, options);
    html = res.getBody().toString('utf8');
    var $ = cheerio.load(html);
    var companies = $(".main-content-first > .title").map(function(){return ($(this).text());}).get();
    var links = $(".wrap-view-page > a").map(function(){return $(this).attr('href')}).get();
    // var re = /https?(.*?):\/\/(.+?)(?=https?)/;
    // info = info.split(re).filter(x => !!x);
    let profile = companies.map((e, i) => [e, baseLink + links[i]]);
    console.log(profile)
};



async function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}
	//let companiesArr = initCompanies();
	for(let i = 0; i < 1; i++){
		search(i);
	}


