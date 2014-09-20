// Filter Widget Type Implementation Class for Text (Equals)
var VFilterWidgetTypeTextEq = VFilterWidgetType.extend({
	type:'equals',
	
	enable:function() {
		$('input',this.$el)[0].disabled = false;
	},
	disable:function() {
		console.log('text equals disable');
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
			'type':'text', 'placeholder':'equals',
			'size':'32',
			'maxlength':'45',
			'title':"filtering the results by column values equal to this",
			'autocomplete':'off',
			'value':''
		}));
	}
});
