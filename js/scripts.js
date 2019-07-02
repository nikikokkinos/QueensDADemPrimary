var map = L.map('map').setView([40.674649,-73.844261], 11);

L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// establishing external geoJSON file & giving it two arguments for style and onEachFeature
var CabanPrcntLayer = L.geoJSON(CabanPrcnt,
	{
		style: style,
		onEachFeature: onEachFeature,
	}).addTo(map)

  function fillColor(Refactored_Caban_VotePrcnt) {
      return Refactored_Caban_VotePrcnt >= 90 	? '#54278f' :
  					 Refactored_Caban_VotePrcnt >= 70 	? '#756bb1' :
             Refactored_Caban_VotePrcnt >= 50 	? '#9e9ac8' :
  					 Refactored_Caban_VotePrcnt >= 30 	? '#bcbddc' :
             Refactored_Caban_VotePrcnt >= 10		? '#dadaeb' :
  					 Refactored_Caban_VotePrcnt >= 0		? '#f2f0f7' :
  					 																				'black' ;
  }

  function style(feature) {
      return {
          fillColor: fillColor(feature.properties.Refactored_Caban_VotePrcnt),
          weight: 0,
          opacity: 1,
          color: 'black',
          dashArray: '2',
          fillOpacity: 1,
      };
  }

  function onEachFeature(feature, layer) {

  	function highlight() {
  	    // var layer = e.target;
  	    layer.setStyle({
  	        weight: 3,
  	        color: 'BLACK',
  	        dashArray: '',
  	        fillOpacity: 0.7
  	    });
  	    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
  	        layer.bringToFront();
  	    }
  			cabanPrcntInfo.update(layer.feature.properties);
  	}

  	function resetHighlight(e) {
  	    CabanPrcntLayer.resetStyle(e.target);
  			cabanPrcntInfo.update();
  	}

    function zoomToFeature(m) {
      map.fitBounds(m.target.getBounds());
    }

    layer.on({
        mouseover: highlight,
        mouseout: resetHighlight,
        click: zoomToFeature,
    });
  }

  var cabanPrcntInfo = L.control();

  cabanPrcntInfo.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'cabanPrcntInfo'); // create a div with a class "info"
    this.update();
    return this._div;
};

  // method that we will use to update the control based on feature properties passed
  cabanPrcntInfo.update = function (props) {
    this._div.innerHTML = '<h4>Percentage of Vote for Tiffany Caban</h4>' +  (props ?
        '<b>' + 'Election District' + ' ' + props.ElectDist + '</b><br />' + props.Refactored_Caban_VotePrcnt
				+ '%'
        : 'Hover over an Assembly District');
};

  cabanPrcntInfo.addTo(map);

  var legend = L.control();

  legend.onAdd = function () {

      var div = L.DomUtil.create('div', 'legend'),
          grades = [0, 10, 30, 50, 70, 90],
          labels = [];

      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + fillColor(grades[i] + 1) + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }

      return div;
  };

  legend.addTo(map);

  var searchControl = L.esri.Geocoding.geosearch().addTo(map);

  // create an empty layer group to store the results and add it to the map
  var results = L.layerGroup().addTo(map);

  // listen for the results event and add every result to the map
  searchControl.on("results", function(data) {
  		results.clearLayers();
  		for (var i = data.results.length - 1; i >= 0; i--) {
  				results.addLayer(L.marker(data.results[i].latlng).bindPopup('Address:' + ' ' + data.results[i].text));
  		}
  });
