/**
 * An abstract view to be extended by a filter widget
 */
var VFilterWidgetType = Backbone.View.extend({
	'type':'equals',//abstract
	'visible':false,
	'active':false,
	
	// abstract functions (must override)
	
	// if you just want to know if the widget inputs are valid for returning value(s)
	'isValid':function() {},
	
	// calling this function will cause the widget to check that it can return values from its inputs
	'validate':function() {},
	
	// returns a human-readable description of the filter input values
	'getValueDescription':function() {},
	
	// returns an object representing the filter values and properties if valid, otherwise false
	'getValue':function() {},
	
	// will set the inputs to the values given
	'setValue':function(filterValue) {},
	
	//
	//load:function(data) {},
	
	// restores the filter widget back to its initial state
	'reset':function() {},
	
	// default class functions, can override, but it's not neccessary to do so
	'show':function() {
		this.visible = true;
		this.active = true;
		this.$el.show();
	},
	'hide':function() {
		this.visible = false;
		this.active = false;
		this.$el.hide();
	},
	'enable':function() {
		this.$el[0].disabled = false;
	},
	'disable':function() {
		this.$el[0].disabled = true;
	},
	
	// default view properties/functions
	'tagName':'fieldset',
	'className':'cf-widget-type',
	'render':function() { return this; }
});
