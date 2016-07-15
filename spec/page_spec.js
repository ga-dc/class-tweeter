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

  xit("has listings", function(done){
    p = page("https://generalassemb.ly/education?where=washington-dc");
    p.listings(function(listings){
      expect(listings.constructor.name).toBe("Array");
      done();
    });
  });

  xit("writes listings to a file", function(done){
    p = page("https://generalassemb.ly/education?where=washington-dc");
    p.listings(function(listings){
      expect(fs.readFileSync(__dirname + "/../new.json", "utf8")).toBe(JSON.stringify(listings));
      done();
    })
  })

  it("has a complement", function(done){
    p = page("https://generalassemb.ly/education?where=washington-dc");
    p.complement(function(complement){
      expect(complement.length).toBe(1)
      done();
    })
  })
})
