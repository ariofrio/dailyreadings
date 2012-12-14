
var container = document.getElementById("container");

function addReadings(date, referenceElement, callback) {
  var isoDate = date.getFullYear() + "-" +
             ("0"+(date.getMonth()+1)).slice(-2) + "-" +
             ("0"+date.getDate()).slice(-2);
  var humanDate = date.toLocaleDateString();

  var item = document.createElement("article");
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "/api/" + isoDate, true);
  xhr.onload = function() {
    var data = JSON.parse(xhr.responseText);

    var h2 = document.createElement("h2");
    h2.textContent = humanDate;
    item.appendChild(h2);

    var h1 = document.createElement("h1");
    h1.textContent = data.day;
    item.appendChild(h1);

    var dl = document.createElement("dl");
    for(var i=0; i<data.readings.length; i++) {
      var dt = document.createElement("dt");
      var dd = document.createElement("dd");
      dt.textContent = data.readings[i].name;
      dd.textContent = data.readings[i].passage;
      dl.appendChild(dt);
      dl.appendChild(dd);
    }
    item.appendChild(dl);

    container.insertBefore(item, referenceElement);
    if(callback) callback(item);
  };
  xhr.send();
}

function addReadingsBefore(date, dateElement, count, cb) {
  date.setDate(date.getDate() - 1);
  addReadings(date, dateElement, function(dateElement) {
    window.scrollTo(window.scrollX + dateElement.offsetWidth, window.scrollY);
    if(cb) cb(dateElement, count);
    if(count > 1)
      addReadingsBefore(date, dateElement, count - 1, cb);
  });
}
function addReadingsAfter(date, dateElement, count, cb) {
  date.setDate(date.getDate() + 1);
  addReadings(date, dateElement.nextSibling,
      function(dateElement) {
    if(cb) cb(dateElement, count);
    if(count > 1)
      addReadingsAfter(date, dateElement, count - 1, cb);
  });
}

function scrollIntoView(element) {
  window.scrollTo(element.offsetLeft, window.scrollY);
}

addReadings(new Date(), null, function(todayElement) {
  addReadingsBefore(new Date(), todayElement, 5);
  addReadingsAfter(new Date(), todayElement, 5);
});

var debounce = function(func, wait, immediate) {
  var timeout, result;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) result = func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) result = func.apply(context, args);
    return result;
  };
};

(function() {
  var adjust = 1;
  if(parseInt(navigator.userAgent.match(/Chrom(e|ium|eframe)\/([0-9]+)\./i)[2]) <= 18) { // http://crbug.com/141840
    adjust = window.devicePixelRatio;
  }

  var snapOnScroll = debounce(function() {
    console.log("snapping");
    var element = document.elementFromPoint(
      adjust * document.body.clientWidth/2, 0);

    container.style.transform = "translateX(" +
      (window.scrollX - element.offsetLeft) + "px)";
    container.style.webkitTransform = 
      container.style.mozTransform = 
      container.style.msTransform = 
      container.style.oTransform = container.style.transform;
  }, 50);

  window.addEventListener("scroll", snapOnScroll);
})();

