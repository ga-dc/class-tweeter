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
      var complement = neww.filter(function(e, i){
        return JSON.stringify(old[i]) != JSON.stringify(neww[i])
      })
      callback(complement);
    }
  }
}

module.exports = page;
