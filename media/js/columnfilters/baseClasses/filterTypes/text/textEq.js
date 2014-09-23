// Filter Widget Type Implementation Class for Text (Equals)
var VFilterWidgetTypeTextEq = VFilterWidgetType.extend({
	type:'equals',
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
			'<span class="help-block">filtering the results by column values equal to this</span>'
		);
	},
	render:function() {
		return this;
	}
});
