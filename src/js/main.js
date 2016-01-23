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
						console.log('Audio is now ready and is playing.');
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
					if(loops == 0) {
						about.setDescription(item.description);
						map.setBottomMaskHeight(about.getDescriptionOffsetFromBottom());
					}

					// Loop it.
					audio.data('loops', loops + 1);
					audio.trigger('play');
				});

				// Update about information.
				about.setDate(item.date);
				about.setDescription(null);
				console.log(about.getDescriptionOffsetFromBottom());
				map.setBottomMaskHeight(about.getDescriptionOffsetFromBottom());

				// Update map location and set callback for the animation handling.
				console.log('Playing moving animation.');
				map.animateLocationMove(item.lat, item.lng, 2000, function(lat, lng, delta) {
					// Update coordinates.
					about.setLocation(lat, lng);
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
					// Stage: Fade out.
					stage.addClass('fadeOutDown');

					// Overview: Fade in.
					overview.show().addClass('fadeInDown');

					// Mute.
					volume.mute();
				}

				if($(this ).is('.close-overview')) {
					// Overview: Fade out.
					overview.addClass('fadeOutUp');

					// Stage: Fade in.
					stage.addClass('fadeInUp');
					setTimeout(function(){
						// Hide overview.
						overview.hide();


						// Initial start.
						if(timeline.getCurrentTarget() === undefined) {
							// Set timeline position to the first one.
							timeline.setTarget(0);

							// Stage: Unhide controls.
							stage.removeClass('hide-controls');
						} else {
							// Unmute.
							volume.unmute();
						}
					}, 1000);
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

		// Update mask height on window resize.
		$(window).resize(function(){
			map.setBottomMaskHeight(about.getDescriptionOffsetFromBottom());
		});
	});
}(jQuery));
