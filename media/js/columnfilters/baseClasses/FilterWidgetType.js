var VFilterWidgetType = Backbone.View.extend({
	visible:false,
	active:false,
	validate:function() {},
	getValue:function() {},
	show:function() {
		//console.log('FilterWidgetType Interface show called ('+this.type+')');
		this.visible = true;
		this.active = true;
		this.$el.show();
	},
	hide:function() {
		this.visible = false;
		this.active = false;
		this.$el.hide();
	},
	enable:function() {
		this.$el[0].disabled = false;
	},
	disable:function() {
		this.$el[0].disabled = true;
	},
	load:function(data) {},
	reset:function() {},
	
	tagName:'fieldset',
	className:'cf-widget-type',
	render:function() { return this; }
});
