// Filter Widget Type Implementation Class for Date (Month)
var VFilterWidgetTypeDateM = VFilterWidgetType.extend({
	'version':'1.0.7',
	'type':'month',
	
	'isValid':function() {
		// a month and year is selected
		var retM = $('select', this.$el).val()*1
		return (retM>-1 && retM<12);
	},
	
	'validate':function() {
		if(this.isValid()) {
			return true;
		}
		
		this.trigger('notify', 'danger', 'Date Filter ('+this.type+') Error', 'A month must be selected.');
		return false;
	},
	
	'getValueDescription':function() {
		if(this.isValid()) {
			return [
				'is in ', 
				moment({'month':$('select', this.$el).val()*1}).format('MMMM')
			].join('');
		} else {
			return false;
		}
	},
	
	/**
	 * Returns:
	 * { type:'month', month:<0-11>, description:<string> } 
	 */
	'getValue':function() {
		if(this.validate()) {
			return {
				'type':this.type,
				'month':$('select', this.$el).val()*1,
				'description':this.getValueDescription()
			};
		}
		return false;
	},
	
	'setValue':function(filterValue) {
		// filterValue = {month:<int>}
		if(filterValue.month) {
			$('select', this.$el).val(filterValue.month);
		}
	},
	
	'reset':function() {
		$('select', this.$el).val(0);
	},
	
	'template':_.template([
		'<div class="row">',
			'<div class="col-lg-8 col-md-8 col-sm-12 col-xs-8">',
				'<label class="control-label">Month: </label>',
				'<select class="form-control">',
				'<% for(var i in months) { %>',
					'<option value="<%= ((i*1)) %>"><%= months[i] %></option>',
				'<% } %>',
				'</select>',
			'</div>',
		'</div>'
	].join('')),
	
	'initialize':function(options) {
		this.model = new Backbone.Model({
			'months':[
				'January', 'February', 'March', 'April',
				'May', 'June', 'July', 'August',
				'September', 'October', 'November', 'December' 
			]
		});
		
		// render this view's elements
		this.$el.html( this.template(this.model.toJSON()) );
	}
});