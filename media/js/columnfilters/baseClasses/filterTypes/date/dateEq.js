// Filter Widget Type Implementation Class for Date (Equals)
var VFilterWidgetTypeDateEq = VFilterWidgetType.extend({
	'version':'1.0.2',
	'type':'equals',
	'dp':null,
	'dpConfig':{
		autoclose:true,
		'name':'dpeq',
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
			return 'is equal to ' + this.dp.datepicker('getDate').toLocaleDateString();
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
		// deprecated method
		// date should be a date
		//if(_.isDate(filterValue.value)) {
		//	this.dp.datepicker('setUTCDate',filterValue.value);
		//}
		
		// new way with moment
		if(filterValue.value) {
			this.dp.datepicker('setUTCDate', moment(filterValue.value).toDate());
		}
	},
	'reset':function() {
		this.dp.datepicker('update',null);
	},
	
	
	//template:_.template(CFTEMPLATES.datepicker3,{variable:'datepicker'}),
	'template':_.template([
		'<div class="row">',
			'<div class="col-lg-5 col-md-7 col-sm-12 col-xs-8">',
				CFTEMPLATES.datepicker,
			'</div>',
		'</div>'
	].join(''),
	{variable:'datepicker'}),
	'events':{
		// why was this here?
		/*'changeDate div.dpeq':function(e) {
			return false;
			
		}*/
	},
	'initialize':function(options) {
		/*
		template datepicker3 wants: 
			name -required: string that will be added to the class list, 
			date: string date that should be in the same format as what you assign the datepicker, 
			format: string format - viewMode:CFTEMPLATES.DATEPICKER_DATE_FORMATS.en_us/en_gb/zh_cn, 
			viewMode: use CFTEMPLATES.DATEPICKER_VIEW_MODES.YEARS/MONTHS/DAYS, 
			minViewMode: same as viewMode
		*/
		this.$el.html(this.template(this.dpConfig));
		$('.dpeq',this.$el).datepicker(this.dpConfig);
		this.dp = $('.dpeq',this.$el);
	}
});
