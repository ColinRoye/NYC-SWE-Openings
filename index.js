const request = require('sync-request');
const rp = require('request-promise');
const cheerio = require('cheerio');
//const test = require('./test')
var fs = require('fs');

// const XlsxPopulate = require('xlsx-populate');

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

let search = async (arr) => {
    let results = [];
    for (let i = 0; i < arr.length; i++) {
        let result = await (searchHelper(arr[i]));
        await fs.appendFileSync('marketCap.txt', result +'\n');
        console.log(result);
    }
}

let searchHelper = async (pageNumber) => {
    var res = await request('GET', 'https://www.builtinnyc.com/companies?f[0]=total_employees%3A%5B501%20TO%20%2A%5D&f[1]=total_employees%3A%5B201%20TO%20500%5D&page=' + pageNumber, options);
    html = res.getBody().toString('utf8');
    var $ = cheerio.load(html);
    var info = $(".main-content-first > .title")
    			.map(function(){
               		return ($(this).text());
	   		}).get();
    // var re = /https?(.*?):\/\/(.+?)(?=https?)/;
    // info = info.split(re).filter(x => !!x);

    return info;

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
	for(let i = 0; i < 10; i++){
		let companies = searchHelper(i);
		companies.then((val)=>{
			console.log(val)
		})
	}


