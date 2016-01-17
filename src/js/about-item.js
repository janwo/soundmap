"use strict";
/*! Copyright Jan Wolf */
function AboutItem() {

	AboutItem.prototype.setDate = function(date_string) {
		var date = new Date(date_string);
		year.html(date.getFullYear().toString().substring(2,4));
		day.html((date.getDate() < 10 ? '0' : '') + date.getDate());
		month.html((date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1));
	};

	AboutItem.prototype.setLocation = function(lat, lng) {
		// Add zeros.
		while(lat.toString().length < 8) lat += '0';
		while(lng.toString().length < 8) lng += '0';
		latitude.html(lat.toString().substring(0,8));
		longitude.html(lng.toString().substring(0,8));
	};

	AboutItem.prototype.setDescription = function(text) {
		// Delete previous text.
		description_typed.empty();
		description_hidden.empty();

		/*
		var intervalObject = description_typed.data('text-animation-object');
		if(intervalObject !== undefined) clearInterval(intervalObject);


		// Get animation parameters.
		var typeSpeed = description_typed.attr('data-type-speed');
		*/

		// Stop here, if no new description is set.
		if(text == null) return;

		// If there is a description set, add text and animation.
		description_hidden.html(text);
		description_typed.html(text);

		/*
		description_typed.data('text-animation-object', setInterval(function(){
			// Clear animation object, when done.
			if(text === description_typed.html()){
				clearInterval(description_typed.data('text-animation-object'));
				console.log('Clear animation object.');
				return;
			}

			// Add a new letter.
			description_typed.html(text.substring(0, description_typed.html().length + 1));
		}, typeSpeed === undefined ? 100 : typeSpeed));
		*/
	};

	var about = $('.about-item');
	var year = about.find('.year' );
	var day = about.find('.day' );
	var month = about.find('.month' );
	var latitude = about.find('.lat' );
	var longitude = about.find('.lng' );
	var description = about.find('.description' );
	var description_hidden = description.find('.hidden-text' );
	var description_typed = description.find('.typed-text' );
}
