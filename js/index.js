// fetch list of available photos

let obs_photos = []

$(document).ready(function () {
  fetch('https://backbone-ridge.github.io/photos/list.html')
    .then((response) => {
      if (response.ok) response.text().then((text) => {
        console.log(text)
        let matches = [...text.matchAll(/<p>\/\w+\/(.*.jpg)<\/p>/ig)]
        matches.forEach((m) => {
          obs_photos.push(m[1])
        })
      })
    })
})


let kibbee = {
  colors: {
    obs_fill: '#0088ff',
    obs_outline: '#000000',
    lots_fill: '#ff440011',
    lots_outline: '#ff4400',
    // lot_label defined in style.css
    highlight: 'rgba(255, 242, 0, 0.4)',
  }
}

var southWest = new L.LatLng(42.45, -76.9),
  northEast = new L.LatLng(42.65, -76.4),
  bounds = new L.LatLngBounds(southWest, northEast);

var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  }),
  Esri_WorldTopoMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
  });

let map

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
  map = L.map('map', {
    zoomControl: true,
    scrollWheelZoom: false,
    dragging: false,
    tap: false,
  }).fitBounds(bounds)
} else {
  map = L.map('map', {
    dragging: true,
    tap: true,
  }).fitBounds(bounds)
}




// var overlay_GoogleMaps_1 = L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
//   opacity: 1.0
// });
// overlay_GoogleMaps_1.addTo(map);
// map.addLayer(overlay_GoogleMaps_1);

var Esri_WorldTopoMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
});
Esri_WorldTopoMap.addTo(map);
map.addLayer(Esri_WorldTopoMap);



var title = '<div class="info-head"><h1>Backbone Ridge History Group</h1><h2>Interactive Map of Military Lots</h2>'
var default_text = '<div id = "info">' + title + '<div id = "info-body"><p>The New Military Tract is a group of 28 towns in central New York State that were laid out and then surveyed into one-hundred 600-acre lots from 1789-91. The military lots were used to compensate New York soldiers for their service during the Revolutionary War. The lots were awarded by random ballots, one lot for each private and multiple lots for officers. There were various set-asides and reservations.</p><p>This interactive map will allow you to follow the original survey lot lines of Ovid and Hector, the towns encompassing the Backbone Ridge, located between Seneca and Cayuga Lakes. Eventually you will have access to views of the original manuscript, the transcription of each page and other information. The current edition of the map shows the original ballotee—the soldier who was awarded the lot – and identifies the person who actually settled the lot. It also provides the surveyors’ descriptions of the forest landscape along the survey lines.</p><p>The transcription of the surveyors’ notebooks and the map planning were done by a group of volunteers as part of the Backbone Ridge History Group (BRHG), with the generous support of the Nelson B. Delavan Foundation. The BRHG is committed to preserving the history of the Backbone Ridge.</p><hr class="info-body-break"><p>We dedicate this project to the man who envisioned this interactive map, Allan Buddle. Allan passed away before we were able to share this project with the public but he was with us as we began the adventure of transcribing the field books.</p><p>We hope you enjoy using the map and might even take it along as you walk the trails that follow some of the original lot lines. Imagine, as Allan did, the old homesteads, the lowing of cattle and the serene beauty of the Backbone Ridge.</p></div></div></div>'
var default_layer_info = '<div id = "info-body"><p>Make a selection to see info.</p></div>'

$('#home').html(default_text);
$('#layer_info').html(title + default_layer_info);



/* function createTable(myArray) {
    var result = "<table border=1>";
    for(var i=0; i<myArray.length; i++) {
        result += "<tr>";
        for(var j=0; j<myArray[i].length; j++){
            result += "<td scope='row'>"+myArray[i][j]+"</td>";
        }
        result += "</tr>";
    }
    result += "</table>";

    return result;
} */

// Switch to layer info pane in sidebar if a layer is selected and the home pane is active
function toggleInfoTab() {
  var homeTab = document.getElementById('home-tab');
  var infoTab = document.getElementById('info-tab');
  var homePane = document.getElementById('home_pane');
  var infoPane = document.getElementById('layer_info_pane');
  if (homeTab.classList.contains('active')) {
    homeTab.classList.remove('active');
    infoTab.classList.add('active');
    homePane.classList.remove('active');
    infoPane.classList.add('active');
  }
}

// Open sidebar if it is collapsed when a layer is selected
function openSidebar() {
  var sidebar = document.getElementById('sidebar');
  var infoTab = document.getElementById('info-tab');
  var infoPane = document.getElementById('layer_info_pane');
  var homeTab = document.getElementById('home-tab');
  var homePane = document.getElementById('home_pane');

  if (sidebar.classList.contains('collapsed') && window.matchMedia("(min-width: 756px)").matches) {
    sidebar.classList.remove('collapsed');
    infoTab.classList.add('active');
    infoPane.classList.add('active');
    homeTab.classList.remove('active');
    homePane.classList.remove('active');
    map.panBy([250, 0]);
  } else if (sidebar.classList.contains('collapsed') && window.matchMedia("(max-width: 756px)").matches) {
    sidebar.classList.remove('collapsed');
    infoTab.classList.add('active');
    infoPane.classList.add('active');
    homeTab.classList.remove('active');
    homePane.classList.remove('active');
    map.panBy([0, 0]);
  }
}



/*function createTable(myArray) {
  console.log (myArray.length)

  var result = "<table id = 'vertices'>";

  if (myArray.length == 1){
  } else {

  for (var i = 0; i < myArray.length; i++) {

    for (var j = 0; j < myArray[i].length; j++) {
      result += "<tr>";
      //result += "<td scope='row'>" + [j] + "</td>";
      result += "<th scope='row' id='military_corner_text'>" + myArray[i][j] + "</th>";
      result += "</tr>";
    }
  }
  }
  result += "</table>";

  return result;
}*/



function createTable(myArray) {

  //var result = "<table id = 'vertices'>";
  var result = "<tr>"

  var addRow = function(result, rowText) {
    //result += "<tr>";
    //result += "<td scope='row'>" + [j] + "</td>";
    result += "<th scope='row' id='military_corner_text'>" +
      rowText.replace(/(^.*?:)/, "<h4>$1</h4>") +
      "</th>";
    result += "</tr>";
    return result;
  }

  for (var i = 0; i < myArray.length; i++) {

    console.log (myArray[i].length)

    if (!Array.isArray(myArray[i])) {
      result += addRow(result, myArray[i])

    } else {

      var curr = ''

      for (var j = 0; j < myArray[i].length; j++) {

        curr += addRow(result, myArray[i][j])

      }

      result = curr
    }
  }
  var finresult = "<table id = 'vertices'>" + result + "</table>";

  return finresult;
}






var sidebar = L.control.sidebar('sidebar', {
  position: 'right',
  autopan: 'false'
}).addTo(map);

function update_obs(feature, layer) {
  layer.on({
    mouseout: resetHighlight,
    mouseover: highlightFeature,
    click: html_obs
  });
}

function update_lots(feature, layer) {
  layer.on({
    mouseout: resetHighlight,
    mouseover: highlightFeature,
    click: html_lots
  });

  layer.bindTooltip(
    feature.properties.lot_number, {
      permanent: true,
      direction: 'center',
      className: 'lot_label'
    }
  );
}


function renderData(v, msg='<i>No data</i>') {
  // if v is null, empty, or 'NA'
  // returns 'No data' (or an optional msg)
  // otherwise returns v unchanged
  if (v === null || v === '' || v === 'NA') {
    return msg
  }
  else {
    return v
  }
}

function renderImage(v) {
  let town = v.split('-')[0].toLowerCase()
  let img = `<img class='photo' onclick='zoomImage(event)' src='https://raw.githubusercontent.com/backbone-ridge/photos/main/${town}/${v}'>`
  return img
}

function zoomImage(e) {
  let img = e.target
  let zoomed = document.createElement('img')
  zoomed.setAttribute('src', img.getAttribute('src'))
  zoomed.setAttribute('class', 'zoomed')
  zoomed.setAttribute('onclick', 'this.remove()')
  document.querySelector('body').append(zoomed)
}


function html_obs(e) {
  var layer = e.target;

  // console.log(layer)

  // check for photo
  let id = layer.feature.properties['id']
  let town = layer.feature.properties['Township']
  obs_photos.forEach((p) => {
    if (p.toLowerCase().startsWith(id.toLowerCase())) {
      layer.feature.properties.photo = p
    }
  })

  var page2digit = ('' + layer.feature.properties['Page']).padStart(2,'0')

  var popupContent = `<div id = "info-body"><div id = "info-cnty-name">
    <h3>Surveyor&apos;s observation point</h3></div>
    <table id = "main">
    <tr>
      <td scope="row">id</td>
      <th>${renderData(layer.feature.properties['id'])}</th>
    </tr>
    <tr>
      <td scope="row">Township</td>
      <th>${renderData(layer.feature.properties['Township'])}</th>
    </tr>
    <tr>
      <td scope="row">Lot No</td>
      <th>${renderData(layer.feature.properties['Lot'])}</th>
    </tr>
    <tr>
      <td scope="row">Starting Corner</td>
      <th>${renderData(layer.feature.properties['Starting Corner'])}</th>
    </tr>
    <tr>
      <td scope="row">Direction</td>
      <th>${renderData(layer.feature.properties['Direction'])}</th>
    </tr>
    <tr>
      <td scope="row">Chains</td>
      <th>${renderData(layer.feature.properties['Chains'])}</th>
    </tr>
    <tr>
      <td scope="row">Links</td>
      <th>${renderData(layer.feature.properties['Links'], 0)}</th>
    </tr>
    <tr>
      <td scope="row">Text</td>
      <th>${renderData(layer.feature.properties['Observation'])}</th>
    </tr>`
    +
    (layer.feature.properties.photo ? `<tr>
      <td scope="row">Photo</td>
      <th>${renderImage(layer.feature.properties.photo)}</th>
    </tr>` : '')
    +
    `</table>
    <div class='journalLink'>
      <a target='_blank' href="https://backbone-ridge.github.io/military-lots/town/ovid/transcription/page-${page2digit}">Ovid Journal page ${renderData(layer.feature.properties['Page'])}
      <img class='thumb' src='https://backbone-ridge.github.io/military-lots/town/ovid/image/fieldbook/ovid-page-${page2digit}.jpg'</a>
    </div>
    </tr>
    </div>`

  $('#layer_info').html(title + popupContent);

  toggleInfoTab();
  openSidebar();

}

function html_lots(e) {
  var layer = e.target;

  //console.log(layer)

  var popupContent = '<div id = "info-body"><div id = "info-cnty-name">' +
    '<h3>Military Lot</h3></div>' +
    '<table id = "main">\
    <tr>\
            <td scope="row">Lot ID</td>\
            <th>' + renderData(layer.feature.properties['lot_id']) + '</th>\
        </tr>\
    <tr>\
            <td scope="row">Township Name</td>\
            <th>' + renderData(layer.feature.properties['township_name']) + '</th>\
        </tr>\
    <tr>\
            <td scope="row">Township No</td>\
            <th>' + renderData(layer.feature.properties['township_number']) + '</th>\
        </tr>\
    <tr>\
            <td scope="row">Lot No</td>\
            <th>' + renderData(layer.feature.properties['lot_number']) + '</th>\
        </tr>\
    <tr>\
            <td scope="row">Soldier Granted Patent</td>\
            <th>' + renderData(layer.feature.properties['soldier_granted']) + '</th>\
        </tr>\
    <tr>\
            <td scope="row">Patent Delivered To</td>\
            <th>' + renderData(layer.feature.properties['patent_to']) + '</th>\
        </tr>\
    </table></div>'

  $('#layer_info').html(title + popupContent);

  toggleInfoTab();
  openSidebar();
}




function html_bounds(e) {
  var layer = e.target;

  //console.log(layer)

  var popupContent = '<div id = "info-body"><div id = "info-cnty-name">' +
    '<h3>Military Lot Bounds</h3></div>' +
    '<table id = "main">\
    <tr>\
            <td scope="row">Bounds</td>\
            <th>' + renderData(layer.feature.properties['boundary']) + '</th>\
        </tr>\
    <tr>\
            <td scope="row">Journal Text</td>\
            <th>' + renderData(layer.feature.properties['info_text']) + '</th>\
        </tr>\
    <tr>\
            <td scope="row">Journal Page</td>\
            <th>' + renderData(layer.feature.properties['journal_page']) + '</th>\
        </tr>\
    </table></div>'

  $('#layer_info').html(title + popupContent);

  toggleInfoTab();
  openSidebar();
}




// get color depending on polling place category
/* function getColor(d) {
  return d == "50+% decrease" ? pollmap.colors.cnty_fill_4 :
    d == "25-50% decrease" ? pollmap.colors.cnty_fill_3 :
    d == "10-25% decrease" ? pollmap.colors.cnty_fill_2 :
    d == "0-10% decrease" ? pollmap.colors.cnty_fill_1 :
    d == "No change or increase" ? pollmap.colors.cnty_fill_0 :
    d == "-99999" ? pollmap.colors.cnty_fill_na :
    pollmap.colors.cnty_fill_default;
} */




// legend stuff

var legend = L.control({
  position: 'bottomleft'
});


legend.onAdd = function(map) {

  var div = L.DomUtil.create('div', 'legend'),
    grades = ["50+% decrease", "25-50% decrease", "10-25% decrease", "0-10% decrease", "No change or increase"],
    labelnm = ["50+% decrease", "25 to <50% decrease", "10 to <25% decrease", "1 to <10% decrease", "No change or increase"],
    labels = []

  for (var i = 0; i < grades.length; i++) {

    labels.push(
      '<i style="background:' + getColor(grades[i]) + '"></i> ' +
      labelnm[i]);
  }

  // div.innerHTML = '<h4>Change in open polling places<button type="button" id="legend-button" onclick="toggleLegend();"><i class="plus-icon" id="legend-icon"></i></button></h4><div id="legend-pane">' + labels.join('<br>') + '</div>';

  div.innerHTML = '<div id="legend-pane"><h3>Decrease in number of<br>open polling places</h3>' + labels.join('<br>') + '</div>';
  return div;
};



function toggleLegend() {
  var legendPane = document.getElementById("legend-pane");
  var legendButton = document.getElementById("legend-button");

  if (legendPane.style.display === "none") {
    legendPane.style.display = "block";
    legendButton.classList.add("active");
  } else {
    legendPane.style.display = "none";
    legendButton.classList.remove("active");
  }
}

//legend.addTo(map);




// Highlight, info-related
function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
    weight: 2,
    fillColor: kibbee.colors.highlight,
    dashArray: '',
    fillOpacity: 0.9,
    color: kibbee.colors.highlight
  });

  if (!L.Browser.ie && !L.Browser.opera) {
    layer.bringToFront();
  }
}


function highlightFeature_click(e) {
  var layer = e.target;

  layer.setStyle({
    weight: 10,
    fillColor: kibbee.colors.highlight,
    dashArray: '',
    opacity: 0.9,
    color: kibbee.colors.highlight
  });

  if (!L.Browser.ie && !L.Browser.opera) {
    layer.bringToFront();
  }
}




function resetHighlight(e) {
  for (i in e.target._eventParents) {
    e.target._eventParents[i].resetStyle(e.target);
  }
}

function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    //click: getInfo
  });
}




// style layers
function style_obs() {
  return {
    pane: 'pane_obs',
    radius: 4,
    opacity: 1,
    color: kibbee.colors.obs_outline,
    dashArray: '',
    lineCap: 'butt',
    lineJoin: 'miter',
    weight: 1,
    fill: true,
    fillOpacity: 1,
    fillColor: kibbee.colors.obs_fill
  }
}

function style_lots() {
  return {
    opacity: 1,
    color: kibbee.colors.lots_outline,
    dashArray: '',
    lineCap: 'butt',
    lineJoin: 'miter',
    weight: 2.0,
    fill: true,
    fillOpacity: 1,
    fillColor: kibbee.colors.lots_fill
  }
}

// change min and max zoom levels and disable scrollwheel when map and sidebar are stacked
function zoomControls(x) {
  if (x.matches) {
    //map.setView([42.6007, -76.7335], 11);
    map.options.minZoom = 11;
    map.options.maxZoom = 16;
    map.scrollWheelZoom.disable();
  } else {
    //map.setView([42.6107, -76.6735], 12);
    map.options.minZoom = 12;
    map.options.maxZoom = 18;
    map.scrollWheelZoom.enable();
  }
}

var x = window.matchMedia("(max-width: 756px)")
zoomControls(x)
x.addListener(zoomControls)



// Create map panes
map.createPane('pane_lots');
map.getPane('pane_lots').style.zIndex = 400;
map.getPane('pane_lots').style['mix-blend-mode'] = 'normal';

map.createPane('pane_obs');
map.getPane('pane_obs').style.zIndex = 403;
map.getPane('pane_obs').style['mix-blend-mode'] = 'normal';



var obs_lyr = new L.GeoJSON.AJAX('data/observations.geojson', {
  pane: 'pane_obs',
  onEachFeature: update_obs,
  pointToLayer: function(feature, latlng) {
    var context = {
      feature: feature,
      variables: {}
    };
    return L.circleMarker(latlng, style_obs(feature));
  }
});

var lots_lyr = new L.GeoJSON.AJAX('data/lots.geojson', {
  pane: 'pane_lots',
  onEachFeature: update_lots,
  style: style_lots
});





// Add layers
map.addLayer(obs_lyr);
map.addLayer(lots_lyr);


var baseMaps = {
  "Esri World Imagery": Esri_WorldImagery,
  "Esri World TopoMap": Esri_WorldTopoMap
};
L.control.layers(baseMaps, {
  'Observations': obs_lyr,
  'Lots': lots_lyr
}, {
  collapsed: false
}).addTo(map);



// Resize map
map.on('resize', function(e) {
  setTimeout(function() {
    map.invalidateSize(true)
  }, 400);
  map.fitBounds(bounds);
})




/* map.on('zoomend', function () {
    currentZoom = map.getZoom();
    if (currentZoom < 8) {
        lots_lyr.setStyle({fillOpacity: 0.2});
    }
    else {
        lots_lyr.setStyle({fillOpacity: 1});
    }
}); */



// function toggleSideNav() {
//   var infobox = document.getElementById("infobox");
//   var infoboxClasses = infobox.classList;
//   var infoboxResult = infoboxClasses.contains("col-xl-4");
//   var mapDiv = document.getElementById("map");
//   var mapClasses = mapDiv.classList;
//   var toggleButton = document.getElementById("toggle-button");
//
//   if (infoboxResult) {
//     infoboxClasses.remove("col-xl-4", "col-lg-4", "col-md-4");
//     infoboxClasses.add("d-xl-none", "d-lg-none", "d-md-none", "col-sm-12");
//     mapClasses.remove("col-xl-8", "col-lg-8", "col-md-8");
//     mapClasses.add("col-xl-12", "col-lg-12", "col-md-12", "col-sm-12");
//     toggleButton.innerHTML = "Show sidebar";
//     setTimeout(function() {
//       map.invalidateSize(true)
//     }, 400);
//     map.fitBounds(bounds);
//   } else {
//     infoboxClasses.remove("d-xl-none", "d-lg-none", "d-md-none", "col-sm-12");
//     infoboxClasses.add("col-xl-4", "col-lg-4", "col-md-4");
//     mapClasses.remove("col-xl-12", "col-lg-12", "col-md-12", "col-sm-12");
//     mapClasses.add("col-xl-8", "col-lg-8", "col-md-8");
//     toggleButton.innerHTML = "Hide sidebar";
//     setTimeout(function() {
//       map.invalidateSize(true)
//     }, 400);
//     map.fitBounds(bounds);
//   }
// }
