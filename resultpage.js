
const request = require("request");
const cheerio = require("cheerio");
const rqst = require("./dataFetch.js")

//request function
function req(url){
    request(url,function (err,response,html){
        if(err){
            console.log(err);
            console.log(response && response.statusCode);
        }
        else{
            extractLinks(html);
        }
    });
}

//parsing the result page
function extractLinks(html){
    let $ = cheerio.load(html);
    let allLinks = $(".ds-border-line")
    for(let i =  0; i < allLinks.length;i++){
        let link = $(allLinks[i]).find(".ds-no-tap-higlight").attr("href")
        if(link){
            link = "https://www.espncricinfo.com" + link;
            rqst.requ(link)
        }
    }
}

module.exports = {
    req : req
}