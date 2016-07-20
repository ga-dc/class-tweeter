var page = require('./page');
var env = require("./env.js");
var Twitter = require("twitter");
var p = page("https://generalassemb.ly/education?where=washington-dc");
var base64 = require('node-base64-image');
var moment = require('moment')
var client = new Twitter(env);

p.listings(function (listings) {
  var today = moment().format('YYYY-DD-MM')
  listings.forEach(function(listing) {
    var listingMo = moment(listing.date_description, "ddd-D-MMMM")
    var oneDayFromMo = listingMo.clone().subtract(1, 'days').format('YYYY-DD-MM')
    var oneWeekFromMo = listingMo.clone().subtract(7, 'days').format('YYYY-DD-MM')
    var twoWeeksFromMo = listingMo.clone().subtract(14, 'days').format('YYYY-DD-MM')
    var whenToTweet = [ oneDayFromMo, oneWeekFromMo, twoWeeksFromMo]
    if (whenToTweet.indexOf(today) !== -1) {
      tweet(listing);
    }
  });
});

function tweet (listing) {
  if(listing.title && listing.date_description && listing.time_description && listing.url && listing.image_url) {
    if (!listing.url.match("http")) listing.url = "http://generalassemb.ly" + listing.url
    var newStatus = listing.title +  " " + listing.date_description + " " + listing.time_description + " " + listing.url
    base64.encode(listing.image_url, {}, function (err, response) {
      if(err) console.log(err);
      var data = response.toString('base64')
      client.post('/media/upload.json', {media_data: data}, function (err, response) {
        if(!err && response.media_id_string) {
          client.post('/statuses/update.json', {media_ids: response.media_id_string, status: newStatus}, function(err, tweet, response) {
            if(err) console.log(err);
          });
        }
      });
    });
  }
}
