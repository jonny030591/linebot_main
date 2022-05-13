var linebot = require('linebot');
var fs = require('fs');
var readline = require('readline'); 
var rl = readline.createInterface(process.stdin, process.stdout);

const request = require("request");

function pttCrawler(){
    var code = 'CWB-ACEA05DF-2026-460E-BA1E-DB7DF01AA723';
    request({
        url: 'https://opendata.cwb.gov.tw/api/v1/rest/datastore/E-A0016-001?Authorization='+code,
        method: "GET"
    }, (error, res, body) => {
        // 如果有錯誤訊息，或沒有 body(內容)，就 return
        if (error || !body) {
            return;
        }
        var e_data_json=JSON.parse(body);
        let eq = e_data_json['records']['earthquake'];
        var msg='';
        for(var i in eq){
            let loc = eq[i]['earthquakeInfo']['epiCenter']['location']       
            let val = eq[i]['earthquakeInfo']['magnitude']['magnitudeValue']
            let dep = eq[i]['earthquakeInfo']['depth']['value']            
            let eq_time = eq[i]['earthquakeInfo']['originTime']             
            let img = eq[i]['reportImageURI']                               
            msg=`${loc}，芮氏規模 ${val} 級，深度 ${dep} 公里，發生時間 ${eq_time}。`;
            break;
        }
        return msg;
    });
};

const config = require('./config.json');
const { join } = require('path');

var bot = linebot({
    channelId: config.channelId,
    channelSecret: config.channelSecret,
    channelAccessToken: config.channelAccessToken
});

bot.on('postback',function (event) {
    event.reply({
        "type": "sticker",
        "packageId": "8525",
        "stickerId": "16581292"
      });
});
bot.on('message', function (event) {
    if(event.message.text == '地震'){
        const pttCrawler = () => {
            var code = 'CWB-ACEA05DF-2026-460E-BA1E-DB7DF01AA723';
            request({
                url: 'https://opendata.cwb.gov.tw/api/v1/rest/datastore/E-A0016-001?Authorization='+code,
                method: "GET"
            }, (error, res, body) => {
                // 如果有錯誤訊息，或沒有 body(內容)，就 return
                if (error || !body) {
                    return;
                }
                var e_data_json=JSON.parse(body);
                let eq = e_data_json['records']['earthquake'];
                for(var i in eq){
                    let loc = eq[i]['earthquakeInfo']['epiCenter']['location']       
                    let val = eq[i]['earthquakeInfo']['magnitude']['magnitudeValue']
                    let dep = eq[i]['earthquakeInfo']['depth']['value']            
                    let eq_time = eq[i]['earthquakeInfo']['originTime']             
                    let img = eq[i]['reportImageURI']                               
                    event.reply([`${loc}，芮氏規模 ${val} 級，深度 ${dep} 公里，發生時間 ${eq_time}。`,{
                        "type": "image",
                        "originalContentUrl": img,
                        "previewImageUrl": img
                    }]);
                    break;
                }
                
            });
        }
        pttCrawler();
    }
});

bot.listen('/webhook', 3000, function () {
    console.log('[BOT已準備就緒]');
    
    rl.setPrompt('Test> '); 
    rl.prompt();
    rl.on('line', function(line) {
        let cmd=line.trim().split(' ');
        switch(cmd[0]) {
            case 'say':
                bot.push('U326f05ea5465e8e1a44c8eaeae434a51',cmd[1]);
                break;
            case '圖':
                bot.push('U326f05ea5465e8e1a44c8eaeae434a51',{
                    type: 'image',
                    originalContentUrl: 'https://i.imgur.com/lFXgB9E.jpg',
                    previewImageUrl: 'https://i.imgur.com/lFXgB9E.jpg'});
                break;
            case '音':
                bot.push('U326f05ea5465e8e1a44c8eaeae434a51',{
                    type: 'image',
                    originalContentUrl: 'https://i.imgur.com/lFXgB9E.jpg',
                    previewImageUrl: 'https://i.imgur.com/lFXgB9E.jpg'});
                break;
            default:
                console.log('沒有找到命令！');
            break;
        }
        rl.prompt();
    });
    rl.on('close', function() { 
        console.log('bye bye!');
        process.exit(0);
    });
});
//U326f05ea5465e8e1a44c8eaeae434a51
//Uc542285461323edd9e71a1c13ed90f5c