// Filter Widget Type Implementation Class for Date (Month Year)
var VFilterWidgetTypeDateMY = VFilterWidgetType.extend({
	'version':'1.0.8',
	'type':'monthyear',
	
	'isValid':function() {
		// a month and year is selected
		var retM = $('select', this.$el).val()*1,
			retY = this.model.get('dp').datepicker('getUTCDate');
		return ( (retM>-1) && (retY));
	},
	
	'validate':function() {
		if(this.isValid()) {
			return true;
		}
		this.trigger('notify', 'danger', 'Date Filter ('+this.type+') Error', 'A month and year must be selected.');
		return false;
	},
	
	'getValueDescription':function() {
		if(this.isValid()) {
			return [
				'is in ', 
				moment({'month':$('select', this.$el).val()*1}).format('MMMM'),
				' of year ',
				moment.utc(this.model.get('dp').datepicker('getUTCDate')).format('YYYY')
			].join('');
		} else {
			return false;
		}
	},
	
	/**
	 * Returns:
	 * { type:'monthyear', month:<0-11>, start:<timestamp>, year:<int>, description:<string> }
	 */
	'getValue':function() {
		if(this.validate()) {
			return {
				'type':this.type,
				'month':$('select', this.$el).val()*1,
				'start':moment.utc(this.model.get('dp').datepicker('getUTCDate')).valueOf(),
				'year':moment.utc(this.model.get('dp').datepicker('getUTCDate')).year(),
				'description':this.getValueDescription()
			};
		}
		return false;
	},
	
	'setValue':function(filterValue) {
		// filterValue = {month:<int>, year:<int>}
		if(filterValue.month && filterValue.year) {
			$('select', this.$el).val(filterValue.month);
			this.model.get('dp').datepicker('update', moment({'year':filterValue.year}).toDate());
		}
	},
	
	'reset':function() {
		$('select', this.$el).val(0);
		this.model.get('dp').datepicker('update',null);
	},
	
	'template':_.template([
		'<div class="row">',
			'<div class="col-lg-5 col-md-6 col-sm-12 col-xs-8">',
				'<label class="control-label">Month: </label>',
				'<select class="form-control">',
				'<% for(var i in months) { %>',
					'<option value="<%= ((i*1)) %>"><%= months[i] %></option>',
				'<% } %>',
				'</select>',
			'</div>',
			'<div class="col-lg-5 col-md-6 col-sm-12 col-xs-8">',
				'<label class="control-label">Year: </label>',
				'<div class="input-group date">',
					'<input type="text" class="form-control date" value="" />',
					'<span class="input-group-addon">',
						'<span class="glyphicon glyphicon-calendar"></span>',
					'</span>',
				'</div>',
			'</div>',
		'</div>'
	].join('')),
	
	'events':{
		/* for testing
		'changeDate div.dpeq':function(e) {
			console.log(e);
			return false;
		}*/
	},
	
	'initialize':function(options) {
		this.model = new Backbone.Model({
			'dp':null,
			'dpConfig':{
				'autoclose':true,
				'name':'dpmy',
				'format':'yyyy',
				'defaultViewDate':'year',
				'minViewMode':'years'
			},
			'months':[
				'January', 'February', 'March', 'April',
				'May', 'June', 'July', 'August',
				'September', 'October', 'November', 'December' 
			]
		});
		
		// render this view's elements
		this.$el.html( this.template({'datepicker':this.model.get('dpConfig'), 'months':this.model.get('months')}) );
		
		// create the datepicker
		$('input', this.$el).datepicker(this.model.get('dpConfig'));
		
		// set the model's dp property now that the datepicker has been created
		this.model.set('dp', $('input', this.$el));
	}
});