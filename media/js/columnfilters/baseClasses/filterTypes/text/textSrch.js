// Filter Widget Type Implementation Class for Text (Search)
var VFilterWidgetTypeTextSrch = VFilterWidgetType.extend({
	'version':'1.0.2',
	'type':'search',
	
	
	'isValid':function() {
		return $.trim($('input',this.$el).val()).length>0;
	},
	'validate':function() {
		if(this.isValid()) {
			return true;
		}
		
		this.trigger('notify', 'danger', 'Text Filter ('+this.type+') Error', 'The text for the search filter can not be empty.');
		return false;
	},
	'getValueDescription':function() {
		if(this.isValid()) {
			return 'is like to ' + $.trim($('input',this.$el).val());
		} else {
			return false;
		}
	},
	'getValue':function() {
		if(this.validate()) {
			return {
				'type':this.type,
				'value':$.trim($('input',this.$el).val()),
				'description':this.getValueDescription()
			};
		}
		return false;
	},
	'setValue':function(filterValue) {
		$('input',this.$el).val(filterValue.value);
	},
	'reset':function() {
		$('input',this.$el).val(null);
	},
	
	
	'className':'row',
	'template':_.template([
		'<div class="col-xs-12">',
			'<input type="text" placeholder="is like" class="form-control" autocomplete="off" value="" />',
			'<span class="help-block">filtering the results by column values similar to this</span>',
		'</div>',
	].join('')),
	
	'initialize':function(options) {
		// TODO attributes for text input
		this.$el.html(this.template());
	}
});
