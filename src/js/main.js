"use strict";
/*! Copyright Jan Wolf */
(function ( $ ) {
	$(document).ready(function() {
		// Initialize modules.
		var map = new Map();
		var about = new AboutItem();
		var timeline = new Timeline();
		var pulsar = new PulsarPoint();
		var volume = new VolumeToggle();

		// Initialize audio.
		var audio = $('audio');

		// Get data of targets.
		$.getJSON( 'data/targets.json', function ( items ) {
			// Is there at least one item?
			if(items.length <= 0) return;

			// Set initial map position.
			map.setLocation(items[0].lat, items[0].lng);

			// Initialize timeline.
			timeline.addOnChangeListener(function(item){
				// Update pulsar.
				pulsar.stop();

				// Trigger events.
				audio.data('loops', 0);
				audio.off('loadstart');
				audio.on('loadstart', function(){
					// Audio file is loading.
					console.log('Audio file is loading.');
					audio.data('ready', false);

					// Seek to the start.
					this.currentTime = 0;
				});
				audio.trigger('pause');
				audio.attr('src', 'data/' + item.file);

				audio.off('canplay');
				audio.on('canplay', function() {
					// Audio file is ready.
					console.log('Audio file can be played.');
					audio.data('ready', true);
				} );

				audio.off('playwhenready');
				audio.on('playwhenready', function(){
					// Play function.
					var play = function(){
						console.log('Audio is now ready and plays.');
						audio.trigger('play');
						pulsar.start();
					};

					// Play audio and start pulsar if already ready.
					if(audio.data('ready') === true) return play();

					// Wait for it.
					console.log('Wait for audio until it is ready to start playing it.');
					audio.on('canplay', play);
				});

				audio.off('ended');
				audio.on('ended', function() {
					console.log('Audio file ended.');
					// Trigger text.
					var loops = audio.data('loops');
					if(loops == 0) about.setDescription(item.description);

					// Loop it.
					audio.data('loops', loops + 1);
					audio.trigger('play');
				});

				// Update about information.
				about.setDate(item.date);
				about.setDescription(null);

				// Update map location and set callback for the animation handling.
				map.animateLocationMove(item.lat, item.lng, 2000, function(lat, lng, delta) {
					// Update coordinates.
					about.setLocation(lat, lng);

					// Start pulsating.
					console.log('Animation ' + (delta * 100) + '% done.');
					if(delta >= 1) audio.trigger('playwhenready');
				});
			});

			// Set items of the timeline.
			timeline.setData(items);

			// Bind keys.
			$(document).keyup(function(e) {
				switch ( (e.keyCode ? e.keyCode : e.which) ) {
					case 37: // Left Arrow.
					case 38: // Up Arrow.
						timeline.previousTarget();
						break;
					case 39: // Right Arrow.
					case 40: // Down Arrow.
						timeline.nextTarget();
						break;
				}
			} );

			var overviewClickListener = function(){
				var overview = $('.overview').removeClass('fadeInDown fadeOutUp');
				var stage = $('.stage').removeClass('fadeOutDown fadeInUp');

				if($(this).is('.open-overview')) {
					stage.addClass('fadeOutDown');
					overview.show().addClass('fadeInDown');
					volume.mute();
				}

				if($(this ).is('.close-overview')) {
					overview.addClass('fadeOutUp');
					stage.addClass('fadeInUp');
					setTimeout(function(){
						overview.hide();
					}, 1000);

					// Set timeline position to the first one.
					if(timeline.getCurrentTarget() === undefined) {
						timeline.setTarget(0);
					} else {
						volume.unmute();
					}
				}
			};

			// Bind overview button toggles.
			$('.close-overview').click(overviewClickListener);
			$('.open-overview').click(overviewClickListener ).click(function(){
				// Change text of the button accordingly.
				var close_overview_button = $('.close-overview');
				var on_click_text = close_overview_button.attr('data-onclick-text');
				if( on_click_text !== undefined ) close_overview_button.html(on_click_text);
			});
		} );
	});
}(jQuery));
