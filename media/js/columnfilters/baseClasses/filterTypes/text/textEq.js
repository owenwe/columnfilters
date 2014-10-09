// Filter Widget Type Implementation Class for Text (Equals)
var VFilterWidgetTypeTextEq = VFilterWidgetType.extend({
	version:'1.0.2',
	type:'equals',
	
	
	isValid:function() {
		return $.trim($('input',this.$el).val()).length>0;
	},
	validate:function() {
		// TODO unset inputs/labels from danger status
		if(this.isValid()) {
			// TODO set inputs/labels to danger status
			return true;
		}
		
		console.log('text cannot be empty');
		return false;
	},
	getValueDescription:function() {
		if(this.isValid()) {
			return 'is equal to ' + $.trim($('input',this.$el).val());
		} else {
			return false;
		}
	},
	getValue:function() {
		if(this.validate()) {
			return {
				'type':this.type,
				value:$.trim($('input',this.$el).val()),
				'description':this.getValueDescription()
			};
		}
		return false;
	},
	setValue:function(filterValue) {
		$('input',this.$el).val(filterValue.value);
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
