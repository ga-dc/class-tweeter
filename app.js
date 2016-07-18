var page = require('./page');
var fs = require("fs");
var env = require("./env.js");
var Twitter = require("twitter")
var p = page("https://generalassemb.ly/education?where=washington-dc");

if(fs.existsSync(__dirname + "/new.json")) {
  var old = JSON.parse(fs.readFileSync(__dirname + "/new.json", "utf8"));
  if(process.env.environment === "test") {
    old.shift()
  }
  fs.writeFileSync(__dirname + "/old.json", JSON.stringify(old), "utf8");
} else {
  p.listings(function (data) {
    fs.writeFileSync(__dirname + "/new.json", JSON.stringify(data), "utf8");
    process.exit();
  })
}

p.listings(function (newListings) {
  p.complement(old.reverse(), newListings.reverse(), function (complement) {
    complement.forEach(function (c) {
      if(c.title && c.date_description && c.time_description && c.url) {
        var newStatus = c.title +  " " + c.date_description + " " + c.time_description + " " + c.url
        var client = new Twitter(env)
        client.post("statuses/update.json", {status: newStatus}, function (err, tweet, response) {
          if (err) throw err;
        })
      }
    })
  })
})
