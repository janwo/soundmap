"use strict";
/*! Copyright Jan Wolf */
function VolumeToggle() {

	VolumeToggle.prototype.toggleMute = function() {
		audio.prop("muted",!audio.prop("muted"));
		$('.volume-toggle').toggleClass('fa-volume-off fa-volume-up');
	};

	VolumeToggle.prototype.mute = function(){
		audio.prop("muted", true);
		$('.volume-toggle').addClass('fa-volume-off' ).removeClass('fa-volume-up');
	};

	VolumeToggle.prototype.unmute = function(){
		audio.prop("muted", false);
		$('.volume-toggle').removeClass('fa-volume-off' ).addClass('fa-volume-up');
	};

	// Initialize audio.
	var audio = $('audio');

	// Bind click listener of mute toggle.
	$('.volume-toggle').click(function(){
		VolumeToggle.prototype.toggleMute();
	});
}
