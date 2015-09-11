// main.js

var fs = require('fs');
var moment = require('moment');
var request = require('request');
var settings = require('./settings.js');
var regexBotName = /MSG\s+([^\s]+)/i // bot name match
var regexPack = /^#(\d+).*?(\d+).*?(\d+\.?\d*\w).\s(.*$)/i // pack match
var botName = '';
var totalPacks = 0;
var packs = [];

// settings.apiEndPoint;

function log(text){
  var date = moment().utc().format('YYYYMMDDTHH:mm:ss');
  var message = date + ' : ' + text + '\n';
  fs.appendFile(settings.logFile, message, function(err){
    if (err) return console.log(err);
  });
}

function error(reason){
  var date = moment().utc().format('YYYYMMDDTHH:mm:ss');
  var message = date + ' ERROR: ' + reason + '\n';
  fs.appendFile(settings.logFile, message, function(err){
    if (err) return console.log(err);
    process.exit();
  });
}

function getBotName(line){
  if (line.match(regexBotName)){
    var nameResult = line.match(regexBotName);
    botName = nameResult[1];
    console.log(botName);
  }
  else {
    error('wrong packlist format');
  }
}

function parsePacklist(packList){
  fs.readFile(packList, 'utf8', function(err, data){
    if (err) error(err);
    data = data.split('\n');
    // parse each line looking for packs
    for (var i = 0; i < data.length; i++){
      var line = data[i].match(regexPack);
      if (line){
        totalPacks++;
        packs.push({id: line[1], gets: line[2], size: line[3], name: line[4]});
      }
    }
    return JSON.stringify(packs);
  });
}

function savePacklistJson(data, packListJson){
  fs.writeFile(packListJson, data, function(err){
    if (err) return error(err);
  });
}

function sendPacklist(data){
  request({
      url: settings.apiEndPoint,
      headers: { 'api': settings.apiKey },
      method: 'POST',
      json: data
  }, function(err, res, body){
    if (err) error(err);
    console.log(body);
  });
}

function packListChecker(packList, packListJson){
  // compare last pack ID and NAME
  // WHAT IF ORDER CHANGES BUT NOT LAST FILE
  // compare last 2-5 pack ids, size, and names?

  fs.readFile(packListJson, 'utf8', function(err, data){
    // skip reading from json packlist since it doesn't exist
    if (err) error(err);

    // json packlist exists, get last 3 packs
    var jsonPacklist = JSON.parse(data);
    var jsonPacklistLength = jsonPacklist.length;

    // get last 3 packs from packlist file
    fs.readFile(packList, 'utf8', function(err, data){
      var counter = 3;
      var lastPacks = [];
      data = data.split('\n');
      for (var i = data.length - 1; i >= 0; i--){
        if (counter <= 0) {
          break;
        }
        var line = data[i].match(regexPack);
        if (line){
          counter--;
          lastPacks.push({id: line[1], size: line[3], name: line[4]});
        }
      }
      // reverse lastPacks array
      lastPacks.reverse();
      // compare last 3 packs to what json has
      for (var i = lastPacks.length - 1; i >= 0; i--){
        counter++;
        if (lastPacks[i].id != jsonPacklist[jsonPacklistLength - counter].id || lastPacks[i].size != jsonPacklist[jsonPacklistLength - counter].size || lastPacks[i].name != jsonPacklist[jsonPacklistLength - counter].name){
          // pack difference, update packlist
          var json = parsePacklist(packList);
          // savePacklistJson(json, packListJson);
          /* TODO SEND PACKLIST */
          sendPacklist(json);
          console.log(lastPacks[i].name);
          break;
        }
      }
    });
  });
}

packListChecker(settings.packList, settings.packListJson);
//parsePacklist(packList);
