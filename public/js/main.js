
var container = document.getElementById("container");

function addReadings(now) {
  var date = now.getFullYear() + "-" +
             ("0"+(now.getMonth()+1)).slice(-2) + "-" +
             ("0"+now.getDate()).slice(-2);
  var dateString = now.toLocaleDateString();

  var item = document.createElement("article");
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "/api/" + date, true);
  xhr.onload = function() {
    var data = JSON.parse(xhr.responseText);

    var h2 = document.createElement("h2");
    h2.textContent = dateString;
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

    container.appendChild(item);
  };
  xhr.send();
}

var date = new Date();
date.setDate(date.getDate() - 5);
addReadings(date);
for(var i=0; i<11; i++) {
  date.setDate(date.getDate() + 1);
  addReadings(date);
}

