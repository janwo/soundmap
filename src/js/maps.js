"use strict";
/*! Copyright Jan Wolf */
function Map() {

	Map.prototype.setLocation = function(lat, lng){
		location = new google.maps.LatLng( lat, lng );
		map.setCenter(location);
	};

	Map.prototype.animateLocationMove = function(lat, lng, millis, moveCallback) {
		var framesPerSecond = 28;
		var initialMillis = Date.now();
		var initialLat = location.lat();
		var initialLng = location.lng();

		// Set new interval.
		var intervalObject = $map.data('intervalObject');
		if(intervalObject !== undefined) clearInterval(intervalObject);
		$map.data('intervalObject', setInterval(function(){
			// Calculate new coordinates.
			var delta = ( Date.now() - initialMillis ) / millis;
			var deltaEased = delta < 0.5 ? 2 * delta * delta : -1 + (4 - 2 * delta) * delta;
			deltaEased = Math.round(deltaEased * 1000) / 1000;
			var newLat = initialLat + (lat - initialLat) * deltaEased;
			var newLng = initialLng + (lng - initialLng) * deltaEased;

			// Set new location.
			Map.prototype.setLocation(newLat, newLng);
			moveCallback(newLat, newLng, deltaEased);

			// Stop animation if final point was reached.
			if(deltaEased >= 1) clearInterval($map.data('intervalObject'));
		}, 1000 / framesPerSecond));
	};

	// Initialize map.
	var $map = $('.map');
	if($map.length == 0) return;

	var styles = [
		{
			"featureType": "administrative.country",
			"elementType": "labels.text.fill",
			"stylers": [
				{ "visibility": "on" },
				{ "lightness": 5 }
			]
		},{
			"elementType": "labels.text.stroke",
			"stylers": [
				{ "visibility": "off" }
			]
		},{
			"featureType": "administrative.province",
			"stylers": [
				{ "visibility": "off" }
			]
		},{
			"featureType": "landscape",
			"stylers": [
				{ "visibility": "off" }
			]
		},{
			"featureType": "administrative.locality",
			"stylers": [
				{ "visibility": "off" }
			]
		},{
			"featureType": "transit",
			"stylers": [
				{ "visibility": "off" }
			]
		},{
			"featureType": "road",
			"stylers": [
				{ "visibility": "off" }
			]
		},{
			"featureType": "administrative.country",
			"elementType": "geometry.stroke",
			"stylers": [
				{ "visibility": "on" },
				{ "lightness": 5 }
			]
		},{
			"featureType": "poi",
			"stylers": [
				{ "visibility": "off" }
			]
		},{
			"featureType": "water",
			"elementType": "labels",
			"stylers": [
				{ "visibility": "off" }
			]
		},{
			"featureType": "landscape",
			"elementType": "geometry.fill",
			"stylers": [
				{ "visibility": "on" },
				{ "color": "#dfc0a9" }
			]
		},{
			"featureType": "water",
			"elementType": "geometry.fill",
			"stylers": [
				{ "color": "#ffeee3" }
			]
		}
	];

	// Set location.;
	var location = new google.maps.LatLng(0, 0);

	// Set options.
	var options = {
		mapTypeControlOptions: {
			mapTypeIds: ['Styled']
		},
		center: location,
		zoom: 5,
		scrollwheel: false,
		navigationControl: false,
		mapTypeControl: false,
		disableDoubleClickZoom: true,
		keyboardShortcuts: false,
		tilt: 45,
		zoomControl: false,
		draggable: false,
		disableDefaultUI: true,
		mapTypeId: 'Styled'
	};

	// Get the div.
	var map = new google.maps.Map($map[0], options);

	// Style Map.
	var styledMapType = new google.maps.StyledMapType(styles, { name: 'Styled' });
	map.mapTypes.set('Styled', styledMapType);

	// Move masks.
	google.maps.event.addListenerOnce(map, 'bounds_changed', function(){
		$('.mask' ).appendTo($map.find('.gm-style'));
	});

	// Resize.
	google.maps.event.addDomListener(window, 'resize', function() {
		map.setCenter(location);
	});
}
