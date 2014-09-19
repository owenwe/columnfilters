// Filter Widget Type Implementation Class for Number (Equals)
var VFilterWidgetTypeNumberEq = VFilterWidgetType.extend({
	type:'equals',
	
	enable:function() {
		$('input',this.$el)[0].disabled = false;
	},
	disable:function() {
		$('input',this.$el)[0].disabled = true;
	},
	load:function(data) {
		$('input',this.$el).val(data);
	},
	reset:function() {
		$('input',this.$el)[0].reset();
	},
	
	initialize:function(options) {
		this.className += ' cf-widget-text-eq';
		this.$el.attr({'title':this.type}).append($(document.createElement('input')).attr({
			'type':'text', 'placeholder':'equals (number)',
			'size':'12',
			'maxlength':'16',
			'title':"filtering the results by column values equal to this",
			'autocomplete':'off',
			'value':''
		}));
	}
});
