// Filter Widget Type Implementation Class for Date Year List (Equals)
var VFilterWidgetTypeDateYr = VFilterWidgetType.extend({
	'version':'1.0.1',
	'type':'year',
	'dp':null,
	'dpConfig':{
		autoclose:true,
		'name':'dpyr',
		'minViewMode':'years',
		'format':CFTEMPLATES.DATEPICKER_DATE_FORMATS.year
	},
	
	'isValid':function() {
		var d = this.dp.datepicker('getDate');
		return !isNaN(d.getTime());
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
			var d = this.dp.datepicker('getDate');
			return 'year is ' + d.getFullYear();
		} else {
			return false;
		}
	},
	'getValue':function() {
		if(this.validate()) {
			var d = this.dp.datepicker('getDate');
			return {
				'type':this.type,
				'value':d.getFullYear(),
				'description':this.getValueDescription()
			};
		}
		return false;
	},
	'setValue':function(filterValue) {
		// date should be a date
		if(_.isFinite(filterValue.value)) {
			this.dp.datepicker('setUTCDate', new Date(filterValue.value,1,1));
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
	
	'initialize':function(options) {
		/*
		template datepicker wants: 
			name -required: string that will be added to the class list, 
			date: string date that should be in the same format as what you assign the datepicker, 
			format: string format - viewMode:CFTEMPLATES.DATEPICKER_DATE_FORMATS.en_us/en_gb/zh_cn, 
			viewMode: use CFTEMPLATES.DATEPICKER_VIEW_MODES.YEARS/MONTHS/DAYS, 
			minViewMode: same as viewMode
		*/
		this.$el.html(this.template(this.dpConfig));
		$('.dpyr',this.$el).datepicker(this.dpConfig);
		//this.dp = $('.dpyr input',this.$el);
		this.dp = $('.dpyr',this.$el);
	}
});