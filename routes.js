var jsdom = require('jsdom');

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.api = function(req, res) {
  var parts = req.params.date.split('-');
  if(parts.length != 3) { res.send(404); return; }
  if(parts[0].length != 4) { res.send(404); return; }

  var url = 'http://www.usccb.org/bible/readings/' +
    parts[0].substr(2) + parts[2] + parts[1] + '.cfm';
  jsdom.env(url, ["http://code.jquery.com/jquery.js"],
      function(errors, window) {
    var $ = window.$;
    var result = {};
    result.readings = [];

    try {
      result.day = $(".cs_control h3")[0].childNodes[0].textContent;
    } catch(e) { console.error(e); }

    try {
      var lectionary = $(".cs_control h3")[0].childNodes[2].textContent;
      if(lectionary.indexOf("Lectionary: ") == 0) {
        result.lectionary = +lectionary.substr("Lectionary: ".length);
      }
    } catch(e) { console.error(e); }

    try {
      $('.bibleReadingsWrapper > h4').each(function() {
        result.readings.push({
          name: this.firstChild.textContent.trim(),
          passage: $(this).find('a.book').text().trim()
        });
      });
    } catch(e) { console.error(e); }

    res.json(result);
  });
};
