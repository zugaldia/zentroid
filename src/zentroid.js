/*
 * Zentroid's JS
 * See: http://mapbox.com/hosting/api-embed/ and http://leaflet.cloudmade.com/
 */

function Zentroid(message_element) {
	var zentroid = {},
		mapbox_url = 'http://a.tiles.mapbox.com/v3/zugaldia.map-qshm3c0v.jsonp',
		message_id = "#" + message_element,
		default_latitude = 38.895111,
		default_longitude = -77.036667,
		default_zoom = 15,
		latlngs = new Array(),
		map, centroid;
	
	var CentroidIcon = L.Icon.extend({
	    iconUrl: './static/glyphicons_207_remove_2@2x_orange.png',
	    iconSize: new L.Point(37, 38)
	});
	
	zentroid.set_message = function(text) {
		$(message_id).text(text);
	}
	
	zentroid.map_setup = function(map_element) {
	    map = new L.Map(map_element).setView(new L.LatLng(default_latitude, default_longitude), default_zoom);
	    
	    // MapBox tiles
	    wax.tilejson(mapbox_url, function(tilejson) {
	        map.addLayer(new wax.leaf.connector(tilejson));
	        zentroid.set_message('Map loaded.');
	    });
	    
	    // Click to add markers
	    map.on('click', function(e) {
	    	latlngs.push(e.latlng);
	        var marker = new L.Marker(e.latlng);
	        map.addLayer(marker);
	        zentroid._update_centroid();
	    });

	}
	
	zentroid.switch_google = function() {
		// TBD
		zentroid.set_message('Switched to Google Maps.');
	}
	
	zentroid.switch_mapbox = function() {
		// TBD
		zentroid.set_message('Switched to MapBox.');
	}
	
	zentroid._update_centroid = function () {
		// No centroid with less than 2 markers
		if (latlngs.length > 1) {
			if (centroid) { map.removeLayer(centroid); } // Remove previous one
			centroid = new L.Marker(zentroid._get_centroid_coordinates(), {icon: new CentroidIcon()});
			map.addLayer(centroid);
			zentroid.set_message('The X marks the spot.');
		}
	}
	
	zentroid._get_centroid_coordinates = function () {
		var latSum = 0, lonSum = 0;
		for (var i = 0; i < latlngs.length; i++) {
			latSum += latlngs[i].lat;
			lonSum += latlngs[i].lng;
		}

		return new L.LatLng(latSum/latlngs.length, lonSum/latlngs.length);
	}
	
	return zentroid;
}

$(document).ready(function() {
	var s = Zentroid('zentroid-message');
    s.map_setup('zentroid-map');
    
    //TBD
    $("#zentroid-layer-form").hide();
//    $('#zentroid-layer').change(function() {
//		if($(this).is(':checked')) { s.switch_google(); }
//		else { s.switch_mapbox(); }
//	});
});
