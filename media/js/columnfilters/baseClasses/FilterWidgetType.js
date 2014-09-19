var VFilterWidgetType = Backbone.View.extend({
	enable:function() {},
	disable:function() {},
	load:function(data) { console.log('abstract load function called');},
	reset:function() {},
	
	//id should be built dynamically
	tagName:'div',
	className:'cf-widget-type',
	render:function() { return this; }
});
