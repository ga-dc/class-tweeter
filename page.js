var fs = require("fs");
var request = require("request");

var page = function(url){
  return {
    url: url,
    html: function(callback){
      request(this.url, function(err, res, body){
        callback(body);
      })
    },
    listings: function(callback){
      this.html(function(html){
        var matches = html.match(/window.EDUCATIONAL_OFFERINGS_JSON\s=\s(.*);/);
        var data = JSON.parse(matches[1])
        callback(data);
      })
    },
    complement: function(old, neww, callback){
      var com = complement(old, neww, sorter)
      callback(com);
    }
  }
}

function complement(a1, a2, sorter){
  a1.sort(sorter)
  a2.sort(sorter)
  // TODO: filter by event start
  return a2.filter(function(e,i){
    return JSON.stringify(a1[i]) != JSON.stringify(a2[i])
  })
}

function sorter(a,b){
  return a - b
}


module.exports = page;
