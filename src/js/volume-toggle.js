"use strict";
/*! Copyright Jan Wolf */
function VolumeToggle() {

	VolumeToggle.prototype.toggleMute = function() {
		audio.prop("muted",!audio.prop("muted"));
	};

	// Initialize audio.
	var audio = $('audio');

	// Bind click listener of mute toggle.
	$('.volume-toggle').click(function(){
		VolumeToggle.prototype.toggleMute();
		$(this).toggleClass('fa-volume-off');
		$(this).toggleClass('fa-volume-up');
	});
}
