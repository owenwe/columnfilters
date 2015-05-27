/**
 * Filter Widget Type Implementation Class for Date (Equals)
 * !!! SEND/RECEIVE ALL TIMESTAMPS AS UTC !!!
 */
var VFilterWidgetTypeDateEq = VFilterWidgetType.extend({
	'version':'1.0.7',
	'type':'equals',
	'dp':null,
	'dpConfig':{
		autoclose:true,
		'name':'dpeq',
		'format':CFTEMPLATES.DATEPICKER_DATE_FORMATS.en_us
	},
	
	'isValid':function() {
		var d = this.dp.datepicker('getUTCDate');
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
			return 'is equal to ' + moment.utc(this.dp.datepicker('getUTCDate')).format('M/D/YYYY');
		} else {
			return false;
		}
	},
	
	'getValue':function() {
		if(this.validate()) {
			return {
				'type':this.type,
				'value':this.dp.datepicker('getUTCDate').getTime(),
				'description':this.getValueDescription()
			};
		}
		return false;
	},
	
	'setValue':function(filterValue) {
		// new way with moment
		if(filterValue.value) {
			this.dp.datepicker('setUTCDate', moment.utc(filterValue.value).toDate());
		}
	},
	
	'reset':function() {
		this.dp.datepicker('update',null);
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
	].join(''), {variable:'datepicker'}),
	
	'initialize':function(options) {
		this.$el.html(this.template(this.dpConfig));
		$('input.date',this.$el).datepicker(this.dpConfig);
		this.dp = $('input.date', this.$el);
	}
});
