var VFilterWidgetType = Backbone.View.extend({
	visible:false,
	show:function() {
		this.visible = true;
		this.$el.show();
	},
	hide:function() {
		this.visible = false;
		this.$el.hide();
	},
	enable:function() {},
	disable:function() {},
	load:function(data) { console.log('abstract load function called');},
	reset:function() {},
	
	//id should be built dynamically
	tagName:'div',
	className:'cf-widget-type',
	render:function() { return this; }
});
