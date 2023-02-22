//ipl stats link of 2022
// const url = "https://www.espncricinfo.com/series/indian-premier-league-2022-1298423"
const url = "https://www.espncricinfo.com/series/indian-premier-league-2009-374163"

const request = require("request");
const cheerio = require("cheerio");
const resultpage = require("./resultpage.js")

//request for home page.
request(url,cb);

//callback fn for homepage
function cb(err,response,html){
    if(err){
        console.log(err);
        console.log(response && response.statusCode);
    }
    else{
        handleHtml(html)
    }
}

//parsing the home page
function handleHtml(html){
    let $ = cheerio.load(html);
    let link = $(".ds-border-t.ds-border-line.ds-text-center.ds-py-2")
    link = $(link[0]).find("a").attr("href");
    link = "https://www.espncricinfo.com" + link;
    resultpage.req(link);
}
