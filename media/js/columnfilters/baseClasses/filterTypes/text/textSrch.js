// Filter Widget Type Implementation Class for Text (Search)
var VFilterWidgetTypeTextSrch = VFilterWidgetType.extend({
	type:'search',
	validate:function() {
		
	},
	getValue:function() {
		return {'type':this.type, value:$.trim($('input',this.$el).val())};
	},
	setValue:function(data) {
		$('input',this.$el).val(data);
	},
	reset:function() {
		$('input',this.$el)[0].reset();
	},
	
	
	initialize:function(options) {
		this.$el.html(
			'<input type="text" placeholder="equals" size="32" maxlength="45" autocomplete="off" value="" />'+
			'<span class="help-block">filtering the results by column values similar to this</span>'
		);
	},
	render:function() {
		return this;
	}
});
