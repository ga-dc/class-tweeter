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
        fs.writeFileSync(__dirname + "/data.json", JSON.stringify(data));
        callback(data);
      })
    },
    complement: function(callback){
      var old = JSON.parse(fs.readFileSync(__dirname + "/old.json"),"utf8").reverse();
      var neww = JSON.parse(fs.readFileSync(__dirname + "/new.json"), "utf8").reverse();
      var complement = neww.filter(function(e, i){
        return JSON.stringify(old[i]) != JSON.stringify(neww[i])
      })
      callback(complement);
    }
  }
}

module.exports = page;
