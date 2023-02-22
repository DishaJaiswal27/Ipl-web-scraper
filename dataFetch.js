
const request = require("request");
let cheerio = require("cheerio");
const path = require("path")
const fs = require("fs")
const xlsx = require("xlsx")

let iplPath = path.join(__dirname ,"ipl");
createFolder(iplPath);

//request for score page.
function req(url){
    request(url,function(err,response,html){
        if(err){
            console.log(err);
            console.log(response && response.statusCode);
        }
        else{
            handleHtml(html)
        }
    });

}

//parsing the score page
function handleHtml(html){
    let $ = cheerio.load(html);


    //result of the match
    let result = $(".ds-text-compact-xxs.ds-p-2.ds-px-4.lg\\:ds-py-3").find(".ds-text-tight-m.ds-font-regular.ds-truncate.ds-text-typo-title");
    result = $(result[0]).text().trim();
    // console.log(result);

    //inning of both teams
    let innings = $(".ds-rounded-lg.ds-mt-2  .ds-w-full.ds-bg-fill-content-prime.ds-overflow-hidden.ds-border.ds-border-line.ds-mb-4")
    for(let i = 0;i < innings.length;i++){
        //team and opponent team name
        let teamName = $(innings[i]).find(".ds-text-title-xs.ds-font-bold.ds-capitalize").text().trim();
        let opponentIndex = (i==0)?1:0;
        let opponentName = $(innings[opponentIndex]).find(".ds-text-title-xs.ds-font-bold.ds-capitalize").text().trim();
        // console.log("Team Name : " + teamName +" | Opponent Name : " + opponentName + "| Result : " + result);
        
        //  batting table of team
        let battingTable = $(innings[i]).find(".ds-w-full.ds-table.ds-table-md.ds-table-auto.ci-scorecard-table>tbody>tr")
        for(let j = 0;j < battingTable.length;j++){
            let playerData = $(battingTable[j]).find("td");
            if(playerData.length == 8){
                let playerName = $(playerData[0]).text().trim();
                let run = $(playerData[2]).text().trim();
                let balls = $(playerData[3]).text().trim();
                let fours =$(playerData[5]).text().trim();
                let sixes =$(playerData[6]).text().trim();
                let srate =$(playerData[7]).text().trim();
               dataStore(teamName,playerName,run,balls,fours,sixes,srate,opponentName,result);
                
            }
        }


    }
    
}

//create folder function
function createFolder(folderpath){
    if(!fs.existsSync(folderpath)){
        fs.mkdirSync(folderpath);
    }
}

//function to store data 
function dataStore(teamName,playerName,run,balls,fours,sixes,srate,opponentName,result){
    let teamPath = path.join(iplPath,teamName);
    createFolder(teamPath);
    let playerfilePath = path.join(teamPath,playerName+".xlsx");
    let content = excelReadData(playerfilePath,playerName);
    content.push({
        teamName,
        opponentName,
        result,
        playerName,
        run,
        balls,
        fours,
        sixes,
        srate
    })
    excelWrite(playerfilePath,content,playerName)


}

//function to read data from xlsx sheet
function excelReadData(filepath,sheetname){
    if(!fs.existsSync(filepath)){
        return [];
    }
    let wdata = xlsx.readFile(filepath);
    let excelData = wdata.Sheets[sheetname];
    let ans = xlsx.utils.sheet_to_json(excelData);
    return ans
}

//function to write data on xlsx sheet
function excelWrite(filepath,json,sheetname){
    let wbook = xlsx.utils.book_new();
    let wsheet = xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(wbook,wsheet,sheetname);
    xlsx.writeFile(wbook,filepath);
}


module.exports={
    requ : req
}

//steps-
//venue date result common in both team - fetch
//innings of both match
// team name and opponent name
//batting table > batman row > player name run balls 4s 6s sr
