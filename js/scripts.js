var map = L.map('map', {
	minZoom: 9,
	maxZoom: 15,
}).setView([40.674649,-73.844261], 11);

L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var ADs = L.geoJSON(assemblyDistricts, {
	onEachFeature: adOnEachFeature,
	}).setStyle({
		color: '#a8e9ff',
		weight: 2,
		dashArray: 2,
		fillColor: '#a8e9ff',
		fillOpacity: .01,
	});

	function adOnEachFeature(feature, layer) {

		var assemblyWebsite = feature.properties.QnsPubAdvocateResults_URL
		layer.bindPopup('<h4>Assembly District</h4>' + ' ' + feature.properties.AssemDist + ' ' +
		'<a href="' + assemblyWebsite + '"  target="_blank" >Visit Website</a>' );

		if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
				layer.bringToFront();
		}
	};

// establishing external geoJSON file & giving it two arguments for style and onEachFeature
var CabanPrcntLayer = L.geoJSON(CabanPrcnt,
	{
		style: cabanStyle,
		onEachFeature: onEachFeature,
	}).addTo(map)

  function cabanfillColor(Refactored_Caban_VotePrcnt) {
      return Refactored_Caban_VotePrcnt >= 90 	? '#54278f' :
  					 Refactored_Caban_VotePrcnt >= 70 	? '#756bb1' :
             Refactored_Caban_VotePrcnt >= 50 	? '#9e9ac8' :
  					 Refactored_Caban_VotePrcnt >= 30 	? '#bcbddc' :
             Refactored_Caban_VotePrcnt >= 10		? '#dadaeb' :
  					 Refactored_Caban_VotePrcnt >= 0		? '#f2f0f7' :
  					 																				'black' ;
  }

  function cabanStyle(feature) {
      return {
					color: 'black',
					weight: .2,
          fillColor: cabanfillColor(feature.properties.Refactored_Caban_VotePrcnt),
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

    // function zoomToFeature(m) {
    //   map.fitBounds(m.target.getBounds());
    // }

    layer.on({
        mouseover: highlight,
        mouseout: resetHighlight,
        // click: zoomToFeature,
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
    this._div.innerHTML = '<h3>Percentage of Vote for Tiffany Caban</h3>' + (props ?
        '<b>' + 'Election District' + ' ' + props.ElectDist + '</b><br />' + props.Refactored_Caban_VotePrcnt
				+ '%'
        : 'Hover over an Election District');
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
              '<i style="background:' + cabanfillColor(grades[i] + 1) + '"></i> ' +
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

	var baseMaps = {
		    "Percentage of Vote Won by Tiffany Caban": CabanPrcntLayer,
			};

	var overlayMaps = {
		    "Assembly Districts": ADs,
		};

	L.control.layers(baseMaps, overlayMaps).addTo(map);
