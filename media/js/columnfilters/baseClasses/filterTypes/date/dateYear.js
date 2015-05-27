// Filter Widget Type Implementation Class for Date Year List (Equals)
var VFilterWidgetTypeDateYr = VFilterWidgetType.extend({
	'version':'1.0.4',
	'type':'year',
	
	'isValid':function() {
		var d = this.model.get('dp').datepicker('getUTCDate');
		return d && !isNaN(d.getTime());
	},
	
	'validate':function() {
		if(this.isValid()) {
			return true;
		}
		this.trigger('notify', 'danger', 'Date Filter ('+this.type+') Error', 'A year must be selected.');
		return false;
	},
	
	'getValueDescription':function() {
		if(this.isValid()) {
			var d = moment.utc(this.model.get('dp').datepicker('getUTCDate'));
			return 'year is ' + d.year();
		} else {
			return false;
		}
	},
	
	/**
	 * Returns:
	 * { type:'year', value:<int>, start:<timestamp>, description:<int> }
	 */
	'getValue':function() {
		if(this.validate()) {
			var d = this.model.get('dp').datepicker('getUTCDate');
			return {
				'type':this.type,
				'value':moment.utc(d).year(),
				'start':moment.utc(d).valueOf(),
				'description':this.getValueDescription()
			};
		}
		return false;
	},
	
	'setValue':function(filterValue) {
		// date should be a date
		if(_.isFinite(filterValue.value)) {
			this.model.get('dp').datepicker('setUTCDate', new Date(filterValue.value, 1, 1));
		}
	},
	
	'reset':function() {
		this.model.get('dp').datepicker('update',null);
	},
	
	'template':_.template([
		'<div class="row">',
			'<div class="col-lg-5 col-md-7 col-sm-12 col-xs-8">',
				'<div class="input-group date">',
					'<input type="text" class="form-control date" value="" />',
					'<span class="input-group-addon">',
						'<span class="glyphicon glyphicon-calendar"></span>',
					'</span>',
				'</div>',
			'</div>',
		'</div>'
	].join('')),
	
	'initialize':function(options) {
		this.model = new Backbone.Model({
			'dp':null,
			'dpConfig':{
				autoclose:true,
				'name':'dpyr',
				'minViewMode':'years',
				'format':CFTEMPLATES.DATEPICKER_DATE_FORMATS.year
			}
		});
		
		this.$el.html(this.template({}));
		$('input.date', this.$el).datepicker(this.model.get('dpConfig'));
		this.model.set('dp', $('input.date', this.$el));
	}
});