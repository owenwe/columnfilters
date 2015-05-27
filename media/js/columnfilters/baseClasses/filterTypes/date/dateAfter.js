// Filter Widget Type Implementation Class for Date (After)
var VFilterWidgetTypeDateAfter = VFilterWidgetType.extend({
	'version':'1.0.4',
	'type':'after',
	
	'isValid':function() {
		var d = this.model.get('dp').datepicker('getUTCDate');
		return d && !isNaN(d.getTime());
	},
	
	'validate':function() {
		if(this.isValid()) {
			return true;
		}
		
		this.trigger('notify', 'danger', 'Date Filter ('+this.type+') Error', 'A date must be selected.');
		return false;
	},
	'getValueDescription':function() {
		if(this.isValid()) {
			return 'is after ' + moment.utc(this.model.get('dp').datepicker('getUTCDate')).format('M/D/YYYY');
		} else {
			return false;
		}
	},
	
	'getValue':function() {
		if(this.validate()) {
			return {
				'type':this.type,
				'value':moment.utc(this.model.get('dp').datepicker('getUTCDate')).valueOf(),
				'description':this.getValueDescription()
			};
		}
		return false;
	},
	
	'setValue':function(filterValue) {
		// new way with moment
		if(filterValue.value) {
			this.model.get('dp').datepicker('setUTCDate', moment.utc(filterValue.value).toDate());
		}
	},
	
	'reset':function() {
		this.model.get('dp').datepicker('update', null);
	},
	
	'template':_.template([
		'<div class="row">',
			'<div class="col-lg-5 col-md-7 col-sm-12 col-xs-8">',
				'<div class="input-group">',
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
				'autoclose':true,
				'name':'dpafter',
				'format':CFTEMPLATES.DATEPICKER_DATE_FORMATS.en_us
			}
		});
		
		this.$el.html(this.template({}));
		
		$('input.date', this.$el).datepicker(this.model.get('dpConfig'));
		this.model.set('dp', $('input.date', this.$el));
	}
});