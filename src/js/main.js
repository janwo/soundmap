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

			/**
			 * Shows or hides the overview.
			 * @param show
			 */
			var showOverview = function(show){
				var overview = $('.overview').removeClass('fadeInDown fadeOutUp');
				var stage = $('.stage').removeClass('fadeOutDown fadeInUp');

				if(show) {
					// Stage: Fade out.
					stage.addClass('fadeOutDown');

					// Overview: Fade in.
					overview.show().scrollTop(0).addClass('fadeInDown');

					// Mute.
					volume.mute();

					// Cancel inactive listening.
					timeline.cancelInactiveListening();
				} else {
					// Overview: Fade out.
					overview.addClass('fadeOutUp');

					// Stage: Fade in.
					stage.addClass('fadeInUp');
					setTimeout(function(){
						// Hide overview.
						overview.hide();

						// Initial start.
						if(stage.hasClass('initial-state')) {
							// Set timeline position to the first one.
							timeline.setTarget(0);

							// Stage: Unhide controls.
							stage.removeClass('initial-state');

							// Change text of the button to the click text.
							var close_overview_button = $('.close-overview');
							var click_text = close_overview_button.attr('data-click-text');
							if( click_text !== undefined ) close_overview_button.html(click_text);
						} else {
							// Trigger inactive listening again.
							timeline.triggerInactiveListening();
						}

						// Unmute.
						volume.unmute();
					}, 1000);
				}
			};

			// Set inactivity detection.
			timeline.addOnInactiveListener(function(){
				// Change text of the button to its initial one.
				var close_overview_button = $('.close-overview');
				var initial_text = close_overview_button.attr('data-initial-text');
				if( initial_text !== undefined ) close_overview_button.html(initial_text);

				// Hide Overview.
				showOverview(true);

				// Reset timeline.
				timeline.reset();

				// Reset audio to default state.
				audio.trigger('pause');
				volume.unmute();

				// Reset map.
				map.setLocation(items[0].lat, items[0].lng);

				// Mark stage as to be in it's initial state.
				$('.stage').addClass('initial-state');
			});

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

			// Bind overview button toggles.
			$('.close-overview').click(function(){
				showOverview(false);
			});
			$('.open-overview').click(function(){
				showOverview(true);
			} );

			// Set initial map position.
			map.setLocation(items[0].lat, items[0].lng);
		} );

		// Update mask height on window resize.
		$(window).resize(function(){
			map.setBottomMaskHeight(about.getDescriptionOffsetFromBottom());
		});
	});
}(jQuery));
