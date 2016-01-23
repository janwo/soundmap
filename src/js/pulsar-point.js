"use strict";
/*! Copyright Jan Wolf */
function PulsarPoint() {

	PulsarPoint.prototype.start = function() {
		// Set start time.
		start = Date.now();

		// Draw frame.
		animationId = window.requestAnimationFrame(PulsarPoint.prototype.draw);
	};

	PulsarPoint.prototype.stop = function(){
		cancelAnimationFrame(animationId);
		PulsarPoint.prototype.clear();
	};

	PulsarPoint.prototype.clear = function(){
		pulsar_context.clearRect(0, 0, canvas_size.main, canvas_size.main);

		// Pulsar point.
		pulsar_context.beginPath();
		pulsar_context.arc(canvas_size.main / 2, canvas_size.main / 2, wave.dot_size / 2, 0, 2 * Math.PI, false);
		pulsar_context.fillStyle = 'rgba(0, 0, 0, 0.5)';
		pulsar_context.fill();
	};

	PulsarPoint.prototype.draw = function() {
		// Clear.
		PulsarPoint.prototype.clear();

		// Get current time.
		var now = Date.now();

		// Get progress.
		var progress = ( ( now - start ) % wave.duration ) / wave.duration;

		// Draw wave.
		pulsar_context.beginPath();
		pulsar_context.arc(canvas_size.main / 2, canvas_size.main / 2, wave.dot_size / 2 + ( canvas_size.main - wave.dot_size ) / 2 * progress , 0, 2 * Math.PI, false);
		pulsar_context.lineWidth = wave.thickness.start + progress * ( wave.thickness.end - wave.thickness.start );
		var alpha = wave.alpha.start + progress * ( wave.alpha.end - wave.alpha.start);
		pulsar_context.strokeStyle = 'rgba(0, 0, 0, ' +  alpha + ')';
		pulsar_context.stroke();

		// Request next frame.
		animationId = window.requestAnimationFrame(PulsarPoint.prototype.draw);
	};

	// Parameters for the animation.
	var canvas_size = {
		main: 500,
		main_rem: 15
	};

	var wave = {
		duration: 10000,
		dot_size: 1 / canvas_size.main_rem * canvas_size.main,
		thickness: {
			start: 0.1 / canvas_size.main_rem * canvas_size.main,
			end: 0.5 / canvas_size.main_rem * canvas_size.main
		},
		alpha: {
			start: 0.5,
			end: 0
		}
	};

	// Get the pulsar point.
	var pulsar = $( '.pulsar-point' );
	pulsar[0].width  = canvas_size.main;
	pulsar[0].height = canvas_size.main;
	var pulsar_context = pulsar[0 ].getContext('2d');

	// Timestamp.
	var start;
	var animationId;
}
