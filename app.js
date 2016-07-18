var page = require('./page');
var fs = require("fs");

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
    console.log(complement);  // TODO: make twitter post with complement data
  })
})
