var page = require('./page');
var fs = require("fs");
var env = require("./env.js");
var Twitter = require("twitter")
var p = page("https://generalassemb.ly/education?where=washington-dc");
var base64 = require('node-base64-image');
var client = new Twitter(env);

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
    complement.forEach(tweet);
  })
})

function tweet (c) {
  if(c.title && c.date_description && c.time_description && c.url && c.image_url) {
    var newStatus = c.title +  " " + c.date_description + " " + c.time_description + " " + c.url
    var image = base64.encode(c.image_url, {}, function (err, response) {
      if(err) console.log(err);
      var data = response.toString('base64')
      client.post('/media/upload.json', {media_data: data}, function (err, response) {
        if(!err && response.media_id_string) {
          client.post('/statuses/update.json', {media_ids: response.media_id_string, status: newStatus}, function(err, tweet, response) {
            if(err) {
              console.log(err)
            } else {
              console.log(tweet);
            }
          })
        }
      })
    })
  }
}
