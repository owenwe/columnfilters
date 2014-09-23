// Filter Widget Type Implementation Class for Number (Between)
var VFilterWidgetTypeNumberBtwn = VFilterWidgetType.extend({
	type:'between',
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
		// TODO make this a spinner (FuelUX, JQueryUI)
		this.$el.attr({'title':this.type}).html(
			'<input type="text" placeholder="between (number)" size="12" maxlength="16" autocomplete="off" value="" />'+
			'<span class="help-block">filtering the results by column values between these numbers</span>'
		);
	},
	render:function() {
		return this;
	}
});
