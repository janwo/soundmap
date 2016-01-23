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
		description_txt.empty();

		// Stop here, if no new description is set.
		if(text == null) {
			console.log('Clear Description' );
			return;
		}

		// If there is a description set, add text and animation.
		console.log('Fill Description' );
		description_txt.html(text);
	};

	AboutItem.prototype.getDescriptionOffsetFromBottom = function() {
		// Get offset.
		return $(window).height() - description.offset().top;
	};

	var about = $('.about-item');
	var year = about.find('.year' );
	var day = about.find('.day' );
	var month = about.find('.month' );
	var latitude = about.find('.lat' );
	var longitude = about.find('.lng' );
	var description = about.find('.description');
	var description_txt = description.children('span');
}
