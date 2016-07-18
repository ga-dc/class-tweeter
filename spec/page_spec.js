var fs = require("fs");
var page = require("../page");

describe("page", function(){
  it("has a URL", function(){
    p = page("https://generalassemb.ly/education?where=washington-dc");
    expect(p.url).toBe("https://generalassemb.ly/education?where=washington-dc");
  });

  it("has HTML", function(done){
    p = page("https://generalassemb.ly/education?where=washington-dc");
    p.html(function(html){
      expect(typeof html).toBe("string");
      done();
    });
  });

  it("has listings", function(done){
    p = page("https://generalassemb.ly/education?where=washington-dc");
    p.listings(function(listings){
      expect(listings.constructor.name).toBe("Array");
      done();
    });
  });

  it("writes listings to a file", function(done){
    p = page("https://generalassemb.ly/education?where=washington-dc");
    p.listings(function(listings){
      expect(fs.readFileSync(__dirname + "/../new.json", "utf8")).toBe(JSON.stringify(listings));
      done();
    })
  })

  it("has a complement", function(done){
    p = page("https://generalassemb.ly/education?where=washington-dc");
    var old = JSON.parse(fs.readFileSync(__dirname + "/old.json"),"utf8").reverse();
    var neww = JSON.parse(fs.readFileSync(__dirname + "/new.json"), "utf8").reverse();
    p.complement(old, neww,function(complement){
      expect(complement.length).toBe(1)
      done();
    })
  })
})
