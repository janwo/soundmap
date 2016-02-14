"use strict";
/*! Copyright Jan Wolf */
function Timeline() {

	Timeline.prototype.addOnChangeListener = function(onChangeListener) {
		onChangeListeners.push(onChangeListener);
	};

	Timeline.prototype.addOnInactiveListener = function(onInactiveListener) {
		onInactiveListeners.push(onInactiveListener);
	};

	Timeline.prototype.cancelInactiveListening = function() {
		if ( lastInteraction === null ) return;
		clearTimeout( lastInteraction );
		lastInteraction = null;
	};

	Timeline.prototype.triggerInactiveListening = function(){
		if(idleMillis <= 0) return;

		// Stop any previous timeouts.
		this.cancelInactiveListening();

		// Restart timer for inactivity detection.
		lastInteraction = setTimeout( function () {
			// Call OnInactiveListeners.
			onInactiveListeners.forEach( function ( onInactiveListener ) {
				onInactiveListener();
			} );
			console.log('Reset application due to inactivity.');
		}, idleMillis );
		console.log('Reset inactivity detection.');
	};

	Timeline.prototype.setTarget = function(index){
		// Update target info.
		this.currentIndex = index;
		var currentTarget = this.items[index];

		// Update target element.
		timeline.children().removeClass('current' ).eq(this.currentIndex).addClass('current');

		// Call OnChangeListeners.
		onChangeListeners.forEach(function(onChangeListener){
			onChangeListener(currentTarget);
		});

		// Respect inactivity?
		this.triggerInactiveListening();
	};

	Timeline.prototype.reset = function(){
		// Restart timer for inactivity detection.
		if ( lastInteraction !== null ) clearTimeout( lastInteraction );
		this.currentIndex = undefined;
		console.log('Reset timeline.');
	};

	Timeline.prototype.nextTarget = function(){
		if(this.currentIndex === undefined) return;
		this.setTarget(this.currentIndex >= this.items.length - 1 ? 0 : this.currentIndex + 1);
	};

	Timeline.prototype.previousTarget = function(){
		if(this.currentIndex === undefined) return;
		this.setTarget(this.currentIndex == 0 ? this.items.length - 1 : this.currentIndex - 1);
	};

	Timeline.prototype.setData = function(data) {
		// Set data as items.
		this.items = data;
		this.currentIndex = this.items.length > 0 ? 0 : undefined;

		// Copy of this object.
		var $this = this;

		// Build all target targets.
		for ( var i = 0; i < this.items.length; i++ ) {
			// Build main element.
			var target = $( '<div/>', {
				'style': 'height: ' + (100 / this.items.length) + '%;',
				'class': 'target',
				click: function(){
					$this.setTarget($(this).index());
				}
			} );

			// Build indicator text.
			var date = new Date(this.items[i].date);
			target.append($( '<div/>', {
				'class': 'indicator',
				'html': '<span class="day">' + (date.getDate() < 10 ? '0' : '') + date.getDate() + '</span>' +
				'<span class="month">' + (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1) + '</span>' +
				'<span class="year">' + date.getFullYear().toString().substring(2,4) + '</span>'
			}));

			// Add hover event to the targets.
			target.hover( targetMouseOver, targetMouseOut );

			// Add it to the timeline.
			$( timeline ).append( target );
		}
	};

	/**
	 * On mouse over.
 	 */
	var targetMouseOver = function () {
		// The centered element.
		$( this ).addClass( 'hovered' );

		// The surrounding elements.
		var prev = $( this ).prev().addClass( 'hovered-surround-0' );
		var next = $( this ).next().addClass( 'hovered-surround-0' );
		prev = prev.prev().addClass( 'hovered-surround-1' );
		next = next.next().addClass( 'hovered-surround-1' );
		prev.prev().addClass( 'hovered-surround-2' );
		next.next().addClass( 'hovered-surround-2' );
	};

	/**
	 * On mouse out.
 	 */
	var targetMouseOut = function () {
		$( this ).siblings().andSelf().removeClass( 'hovered hovered-surround-0 hovered-surround-1 hovered-surround-2' );
	};

	// Array that holds all OnChangeListener.
	var onChangeListeners = [];

	// Array that holds all OnInactiveListener.
	var onInactiveListeners = [];

	// Timer for inactivity detection.
	var idleMillis = 3 * 60 * 1000;
	var lastInteraction = null;

	// The wrapper that will contain all targets.
	var timeline = $( '.timeline .inner' );
}
