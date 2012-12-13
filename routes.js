var jsdom = require('jsdom');
var Cache = require('./cache');

var cache = new Cache(128);
exports.api = function(req, res) {
  var hit;
  if(hit = cache.get(req.params.date)) {
    res.json(hit[0]);
  } else {
    var parts = req.params.date.split('-');
    if(parts.length != 3) { res.send(404); return; }
    if(parts[0].length != 4) { res.send(404); return; }

    var url = 'http://www.usccb.org/bible/readings/' +
      parts[0].substr(2) + parts[2] + parts[1] + '.cfm';
    jsdom.env(url, ["http://code.jquery.com/jquery.js"],
        function(errors, window) {
      var $ = window.$;
      var result = {};
      result.href = url;
      result.readings = [];

      try {
        result.day = $(".cs_control h3")[0].childNodes[0].textContent;
        var lectionary = $(".cs_control h3")[0].childNodes[2].textContent;
        if(lectionary.indexOf("Lectionary: ") == 0) {
          result.lectionary = +lectionary.substr("Lectionary: ".length);
        }
        $('.bibleReadingsWrapper > h4').each(function() {
          result.readings.push({
            name: this.firstChild.textContent.trim(),
            passage: $(this).find('a.book').text().trim()
          });
        });
        res.json(result);

        var cacheEntry = cache.add(req.params.date);
        cacheEntry.push(result);
      } catch(e) {
        console.error(e);
        res.send(500);
      }
    });
  }
};
