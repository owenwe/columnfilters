// Filter Widget Type Implementation Class for Date (After)
var VFilterWidgetTypeDateAfter = VFilterWidgetType.extend({
	'version':'1.0.1',
	'type':'after',
	'dp':null,
	'dpConfig':{
		autoclose:true,
		'name':'dpafter',
		'format':CFTEMPLATES.DATEPICKER_DATE_FORMATS.en_us
	},
	
	'isValid':function() {
		var d = this.dp.datepicker('getDate');
		return !isNaN(d.getTime());
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
			return 'is after ' + moment(this.dp.datepicker('getDate')).format('M/D/YYYY');
		} else {
			return false;
		}
	},
	'getValue':function() {
		if(this.validate()) {
			return {
				'type':this.type,
				'value':this.dp.datepicker('getDate'),
				'description':this.getValueDescription()
			};
		}
		return false;
	},
	'setValue':function(filterValue) {
		// new way with moment
		if(filterValue.value) {
			this.dp.datepicker('setUTCDate', moment(filterValue.value).toDate());
		}
	},
	'reset':function() {
		this.dp.datepicker('update',null);
	},
	
	'template':_.template([
		'<div class="row">',
			'<div class="col-lg-5 col-md-7 col-sm-12 col-xs-8">',
				CFTEMPLATES.datepicker,
			'</div>',
		'</div>'
	].join(''),
	{variable:'datepicker'}),
	'events':{},
	
	'initialize':function(options) {
		this.$el.html(this.template(this.dpConfig));
		$('.dpafter',this.$el).datepicker(this.dpConfig);
		this.dp = $('.dpafter',this.$el);
	}
});