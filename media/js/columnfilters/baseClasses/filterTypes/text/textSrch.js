// Filter Widget Type Implementation Class for Text (Search)
var VFilterWidgetTypeTextSrch = VFilterWidgetType.extend({
	type:'search',
	
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
		this.className += ' cf-widget-text-srch';
		this.$el.attr({'title':this.type}).append($(document.createElement('input')).attr({
			'type':'text','placeholder':'search',
			'size':'32',
			'maxlength':'45',
			'title':"filtering the results by column values similar to this",
			'autocomplete':'off',
			'value':''
		}));
	}
});
