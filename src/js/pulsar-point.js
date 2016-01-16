"use strict";
/*! Copyright Jan Wolf */
function PulsarPoint() {
	PulsarPoint.prototype.start = function() {
		// Clear any previous interval.
		var interval = pulsar_point.data( 'interval-object');
		if(interval !== null) clearInterval(interval);

		// Create interval object.
		pulsar_point.data('idx', 0);
		pulsar_point.data( 'interval-object', setInterval( function () {
			// Increment index.
			var idx = pulsar_point.data('idx');
			var nidx = (idx + 1) % waves.length;
			pulsar_point.data('idx', nidx);

			// Update animation.
			waves.each( function ( cidx ) {
				if ( cidx == idx ) $( this ).addClass( 'ready running' );
				if ( cidx == nidx ) $( this ).removeClass( 'ready running' );
			} )
		}, interval_length ) );
	};

	PulsarPoint.prototype.stop = function(){
		clearInterval(pulsar_point.data( 'interval-object'));
		waves.removeClass( 'ready running' );
	};

	// Get the pulsar point.
	var pulsar_point = $( '.pulsar-point' );

	// Duration in seconds.
	var wave_duration = 10000;

	// Calculate animations.
	var waves = pulsar_point.find( '.circular-wave' );
	var interval_length = wave_duration / (waves.length - 1);
}
